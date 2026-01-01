/**
 * API endpoint to fetch Zep knowledge graph data for a company
 *
 * Returns nodes and edges for vis-network visualization
 */

import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Company ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch company data
    const companies = await sql`
      SELECT id, name, slug, payload
      FROM companies
      WHERE id = ${id}
      LIMIT 1
    `;

    if (companies.length === 0) {
      return new Response(JSON.stringify({ error: 'Company not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const company = companies[0];
    const payload = company.payload || {};

    // Priority order: 3D video > Interactive data > Screenshot

    // Check for 3D video (most engaging - Attempt #2)
    const videoUrl = payload.zep_graph_3d_video_url;

    if (videoUrl) {
      return new Response(JSON.stringify({
        type: 'video',
        video_url: videoUrl,
        message: '3D animated graph visualization'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Check for interactive graph data (Attempt #1)
    const graphData = payload.zep_graph_data;

    if (graphData && graphData.nodes && graphData.nodes.length > 0) {
      return new Response(JSON.stringify({
        type: 'data',
        nodes: graphData.nodes,
        edges: graphData.edges,
        message: 'Interactive graph visualization'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Check for screenshot (Attempt #3 - fallback)
    const screenshotUrl = payload.zep_graph_screenshot_url;

    if (screenshotUrl) {
      return new Response(JSON.stringify({
        type: 'screenshot',
        screenshot_url: screenshotUrl,
        message: 'Graph visualization screenshot'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // No graph data available yet
    return new Response(JSON.stringify({
      type: 'none',
      message: 'Graph data will be available after next company update'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching graph data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch graph data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
