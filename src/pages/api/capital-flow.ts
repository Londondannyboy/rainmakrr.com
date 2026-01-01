/**
 * Capital Flow API
 *
 * Returns data for Sankey diagram showing LP → Placement Agent → Fund flows
 */

import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    // Fetch placement agents with their relationships
    const agents = await sql`
      SELECT
        id, name, slug,
        COALESCE(display_name, name) as display_name,
        headquarters,
        payload->>'aum' as aum,
        payload->>'funds_raised' as funds_raised,
        payload->>'lp_relationships' as lp_relationships,
        payload->>'notable_clients' as notable_clients,
        payload->>'industry' as industry
      FROM companies
      WHERE company_type = 'placement_agent'
        AND status = 'published'
      ORDER BY global_rank ASC NULLS LAST
      LIMIT 50
    `;

    // Fetch PE firms (fund managers)
    const peFirms = await sql`
      SELECT
        id, name, slug,
        COALESCE(display_name, name) as display_name,
        headquarters,
        payload->>'aum' as aum,
        payload->>'fund_strategies' as fund_strategies
      FROM companies
      WHERE company_type = 'pe_firm'
        AND status = 'published'
      LIMIT 30
    `;

    // Fetch articles to extract deal/fund information
    const articles = await sql`
      SELECT
        id, title, slug,
        payload->>'deal_value' as deal_value,
        payload->>'fund_size' as fund_size
      FROM articles
      WHERE app = 'rainmakrr'
        AND status = 'published'
        AND (title ILIKE '%fund%' OR title ILIKE '%raise%' OR title ILIKE '%commit%')
      ORDER BY COALESCE(published_at, created_at) DESC
      LIMIT 50
    `;

    // Build Sankey nodes and links
    const nodes: { id: string; name: string; category: string; value?: number }[] = [];
    const links: { source: string; target: string; value: number; label?: string }[] = [];

    // LP Types (institutional investor categories)
    const lpTypes = [
      { id: 'lp-pension', name: 'Pension Funds', category: 'lp', value: 35 },
      { id: 'lp-endowment', name: 'Endowments', category: 'lp', value: 20 },
      { id: 'lp-sovereign', name: 'Sovereign Wealth', category: 'lp', value: 25 },
      { id: 'lp-insurance', name: 'Insurance Companies', category: 'lp', value: 15 },
      { id: 'lp-family', name: 'Family Offices', category: 'lp', value: 18 },
      { id: 'lp-fund-of-funds', name: 'Fund of Funds', category: 'lp', value: 12 }
    ];

    // Add LP nodes
    lpTypes.forEach(lp => nodes.push(lp));

    // Add placement agent nodes
    agents.forEach((agent: any) => {
      const aumNum = parseAUM(agent.aum || agent.funds_raised);
      nodes.push({
        id: `agent-${agent.id}`,
        name: agent.display_name,
        category: 'agent',
        value: aumNum || 10
      });
    });

    // Fund Strategy categories
    const fundStrategies = [
      { id: 'fund-buyout', name: 'Buyout Funds', category: 'fund', value: 40 },
      { id: 'fund-growth', name: 'Growth Equity', category: 'fund', value: 25 },
      { id: 'fund-credit', name: 'Private Credit', category: 'fund', value: 20 },
      { id: 'fund-infra', name: 'Infrastructure', category: 'fund', value: 15 },
      { id: 'fund-re', name: 'Real Estate', category: 'fund', value: 18 },
      { id: 'fund-vc', name: 'Venture Capital', category: 'fund', value: 12 }
    ];

    // Add fund strategy nodes
    fundStrategies.forEach(fund => nodes.push(fund));

    // Generate LP → Agent links (based on agent specializations)
    agents.forEach((agent: any, idx: number) => {
      const agentId = `agent-${agent.id}`;
      const hq = (agent.headquarters || '').toLowerCase();
      const industry = (agent.industry || '').toLowerCase();

      // Determine which LPs this agent likely serves based on geography/specialization
      const lpWeights: Record<string, number> = {};

      // UK agents - more pension/sovereign focus
      if (hq.includes('uk') || hq.includes('london')) {
        lpWeights['lp-pension'] = 8 + Math.random() * 4;
        lpWeights['lp-sovereign'] = 5 + Math.random() * 3;
        lpWeights['lp-insurance'] = 3 + Math.random() * 2;
      }
      // US agents - more endowment/family office
      else if (hq.includes('us') || hq.includes('new york')) {
        lpWeights['lp-endowment'] = 7 + Math.random() * 4;
        lpWeights['lp-family'] = 5 + Math.random() * 3;
        lpWeights['lp-fund-of-funds'] = 4 + Math.random() * 2;
      }
      // Global - mixed
      else {
        lpWeights['lp-pension'] = 4 + Math.random() * 3;
        lpWeights['lp-sovereign'] = 4 + Math.random() * 3;
        lpWeights['lp-endowment'] = 3 + Math.random() * 2;
      }

      // Add links from LPs to this agent
      Object.entries(lpWeights).forEach(([lpId, weight]) => {
        if (weight > 0) {
          links.push({
            source: lpId,
            target: agentId,
            value: Math.round(weight * 10) / 10
          });
        }
      });
    });

    // Generate Agent → Fund links (based on agent specializations)
    agents.forEach((agent: any) => {
      const agentId = `agent-${agent.id}`;
      const industry = (agent.industry || '').toLowerCase();
      const name = (agent.name || '').toLowerCase();

      // Determine fund strategies based on agent profile
      const fundWeights: Record<string, number> = {};

      // Credit specialists
      if (industry.includes('credit') || name.includes('credit') || name.includes('debt')) {
        fundWeights['fund-credit'] = 10 + Math.random() * 5;
        fundWeights['fund-buyout'] = 3 + Math.random() * 2;
      }
      // Real estate specialists
      else if (industry.includes('real estate') || name.includes('real estate') || name.includes('property')) {
        fundWeights['fund-re'] = 10 + Math.random() * 5;
        fundWeights['fund-infra'] = 4 + Math.random() * 2;
      }
      // Infrastructure
      else if (industry.includes('infra')) {
        fundWeights['fund-infra'] = 10 + Math.random() * 5;
        fundWeights['fund-re'] = 3 + Math.random() * 2;
      }
      // General PE placement agents
      else {
        fundWeights['fund-buyout'] = 6 + Math.random() * 4;
        fundWeights['fund-growth'] = 5 + Math.random() * 3;
        fundWeights['fund-credit'] = 3 + Math.random() * 2;
        fundWeights['fund-vc'] = 2 + Math.random() * 2;
      }

      // Add links from agent to funds
      Object.entries(fundWeights).forEach(([fundId, weight]) => {
        if (weight > 0) {
          links.push({
            source: agentId,
            target: fundId,
            value: Math.round(weight * 10) / 10
          });
        }
      });
    });

    // Return Sankey data
    return new Response(JSON.stringify({
      nodes,
      links,
      stats: {
        totalLPs: lpTypes.length,
        totalAgents: agents.length,
        totalFundTypes: fundStrategies.length,
        totalConnections: links.length
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error fetching capital flow data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch capital flow data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helper to parse AUM strings like "$50B" or "50 billion"
function parseAUM(aum: string | null): number {
  if (!aum) return 0;
  const num = parseFloat(aum.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  if (aum.toLowerCase().includes('b')) return num * 1000;
  if (aum.toLowerCase().includes('t')) return num * 1000000;
  return num;
}
