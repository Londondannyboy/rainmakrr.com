/**
 * API endpoint for Zep knowledge graph data
 * Returns graph nodes and edges for interactive visualization
 */

export async function GET({ params }: { params: { companyId: string } }) {
  const { companyId } = params;

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
      { id: "12", label: "Campbell Lutyens", group: "entity" },
      { id: "13", label: "Eaton Partners", group: "entity" },
      { id: "14", label: "First Avenue", group: "entity" }
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
