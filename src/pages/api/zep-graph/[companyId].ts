/**
 * API endpoint for Zep knowledge graph data
 * Returns graph nodes and edges for interactive visualization
 */

import { sql } from '../../../lib/db';

export async function GET({ params }: { params: { companyId: string } }) {
  const { companyId } = params;

  // Try to fetch real data from database
  try {
    const companies = await sql`
      SELECT
        name,
        slug,
        payload
      FROM companies
      WHERE slug = ${companyId}
      LIMIT 1
    `;

    if (companies.length > 0) {
      const company = companies[0];
      const payload = company.payload || {};
      const sections = payload.profile_sections || {};

      // Build graph from real profile data
      const nodes = [];
      const edges = [];
      let nodeId = 1;

      // Add company as central node
      nodes.push({
        id: String(nodeId++),
        label: company.name,
        group: 'company',
        size: 40
      });

      // Extract deals from profile sections
      if (sections.deals && sections.deals.content) {
        const dealsContent = sections.deals.content;
        // Parse deals from bullet points (• or -)
        const dealLines = dealsContent.split('\n').filter((line: string) =>
          line.trim().startsWith('•') || line.trim().startsWith('-')
        );

        dealLines.slice(0, 6).forEach((line: string) => {
          // Extract the main deal text - look for bold text or the whole line
          let dealText = line.trim().replace(/^[•-]\s*/, '');

          // Extract bold text if present
          const boldMatch = dealText.match(/\*\*\[?([^\]*]+)/);
          if (boldMatch) {
            dealText = boldMatch[1].replace(/\]\(.*$/, ''); // Remove markdown link
          }

          // Extract fund value if present ($XXM, $XXB, etc.)
          const valueMatch = line.match(/\$[\d,.]+\s*[BMK](?:illion)?/i);
          const value = valueMatch ? valueMatch[0] : null;

          // Clean up deal text
          dealText = dealText.substring(0, 45);
          if (dealText.length === 45) dealText += '...';

          if (dealText) {
            nodes.push({
              id: String(nodeId),
              label: dealText,
              group: 'deal',
              title: value ? `Deal Size: ${value}` : 'Deal'
            });
            edges.push({
              from: '1',
              to: String(nodeId),
              label: value || 'Advised'
            });
            nodeId++;
          }
        });
      }

      // Extract other entities from sections
      if (sections.overview && sections.overview.content) {
        const overview = sections.overview.content;

        // Extract headquarters
        if (payload.headquarters_city && payload.headquarters_country) {
          nodes.push({
            id: String(nodeId),
            label: `${payload.headquarters_city}, ${payload.headquarters_country}`,
            group: 'entity'
          });
          edges.push({
            from: '1',
            to: String(nodeId),
            label: 'Headquartered'
          });
          nodeId++;
        }

        // Add industry if available
        if (payload.industry) {
          nodes.push({
            id: String(nodeId),
            label: payload.industry,
            group: 'entity'
          });
          edges.push({
            from: '1',
            to: String(nodeId),
            label: 'Industry'
          });
          nodeId++;
        }
      }

      // Extract key team members from team section
      if (sections.team && sections.team.content) {
        const teamContent = sections.team.content;
        // Look for bold names with titles (e.g., **John Smith, Managing Partner**)
        const personMatches = teamContent.match(/\*\*([^*,]+(?:,\s*[^*]+)?)\*\*/g) || [];

        personMatches.slice(0, 4).forEach((match: string) => {
          const personText = match.replace(/\*\*/g, '');
          // Extract just the name (before any title)
          const nameParts = personText.split(',');
          const name = nameParts[0].trim();
          const title = nameParts[1] ? nameParts[1].trim() : null;

          if (name && name.length > 2 && name.length < 40) {
            nodes.push({
              id: String(nodeId),
              label: name,
              group: 'person',
              title: title || 'Team Member'
            });
            edges.push({
              from: '1',
              to: String(nodeId),
              label: title ? title.substring(0, 20) : 'Team'
            });
            nodeId++;
          }
        });
      }

      // Add founded year if available
      if (payload.founded_year) {
        nodes.push({
          id: String(nodeId),
          label: `Founded ${payload.founded_year}`,
          group: 'entity'
        });
        edges.push({
          from: '1',
          to: String(nodeId),
          label: 'Established'
        });
        nodeId++;
      }

      // Return real graph data
      return new Response(JSON.stringify({
        type: 'data',
        nodes,
        edges
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching real graph data:', error);
    // Fall through to sample data
  }

  // Sample graph data for Evercore (will be replaced with real Zep API call)
  const evercoreGraph = {
    type: 'data',
    nodes: [
      { id: "1", label: "Evercore", group: "company", size: 40 },
      { id: "2", label: "Investment Banking", group: "entity" },
      { id: "3", label: "Private Funds Group", group: "entity" },
      { id: "4", label: "New York HQ", group: "entity" },
      { id: "5", label: "$18.1B Raised", group: "entity" },
      { id: "6", label: "2,500+ Employees", group: "entity" },
      { id: "7", label: "M&A Advisory", group: "entity" },
      { id: "8", label: "Placement Agent", group: "entity" },
      { id: "9", label: "Sovereign Wealth Funds", group: "entity" },
      { id: "10", label: "Pension Funds", group: "entity" },
      { id: "11", label: "Family Offices", group: "entity" },
      { id: "12", label: "Campbell Lutyens", group: "company" },
      { id: "13", label: "Eaton Partners", group: "company" },
      { id: "14", label: "First Avenue", group: "company", url: "/private-equity-placement-agents-list/firstavenue" }
    ],
    edges: [
      { from: "1", to: "2", label: "Specializes In" },
      { from: "1", to: "3", label: "Has Division" },
      { from: "1", to: "4", label: "Headquartered" },
      { from: "1", to: "5", label: "Secured" },
      { from: "1", to: "6", label: "Employs" },
      { from: "1", to: "7", label: "Provides" },
      { from: "1", to: "8", label: "Acts As" },
      { from: "8", to: "9", label: "Connects To" },
      { from: "8", to: "10", label: "Connects To" },
      { from: "8", to: "11", label: "Connects To" },
      { from: "1", to: "12", label: "Competitor" },
      { from: "1", to: "13", label: "Competitor" },
      { from: "1", to: "14", label: "Competitor" }
    ]
  };

  // Sample graph for First Avenue
  const firstAvenueGraph = {
    type: 'data',
    nodes: [
      { id: "1", label: "First Avenue", group: "company", size: 40 },
      { id: "2", label: "Placement Agent", group: "entity" },
      { id: "3", label: "London HQ", group: "entity" },
      { id: "4", label: "Founded 2006", group: "entity" },
      { id: "5", label: "Private Equity", group: "entity" },
      { id: "6", label: "Real Estate Funds", group: "entity" },
      { id: "7", label: "Infrastructure", group: "entity" },
      { id: "8", label: "Credit Funds", group: "entity" },
      { id: "9", label: "Institutional Investors", group: "entity" },
      { id: "10", label: "Evercore", group: "entity" },
      { id: "11", label: "Campbell Lutyens", group: "entity" }
    ],
    edges: [
      { from: "1", to: "2", label: "Type" },
      { from: "1", to: "3", label: "Headquartered" },
      { from: "1", to: "4", label: "Founded" },
      { from: "1", to: "5", label: "Specializes In" },
      { from: "1", to: "6", label: "Specializes In" },
      { from: "1", to: "7", label: "Specializes In" },
      { from: "1", to: "8", label: "Specializes In" },
      { from: "1", to: "9", label: "Connects To" },
      { from: "1", to: "10", label: "Competitor" },
      { from: "1", to: "11", label: "Competitor" }
    ]
  };

  // Return graph based on companyId (slug matching)
  if (companyId.toLowerCase().includes('evercore')) {
    return new Response(JSON.stringify(evercoreGraph), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (companyId.toLowerCase().includes('firstavenue') || companyId.toLowerCase().includes('first-avenue')) {
    return new Response(JSON.stringify(firstAvenueGraph), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Default empty graph for other companies
  return new Response(JSON.stringify({
    type: 'data',
    nodes: [],
    edges: []
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
