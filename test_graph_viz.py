#!/usr/bin/env python3
"""
Test Zep Graph Visualization

Regenerates Evercore to test graph data fetching and visualization
"""
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/quest')

from temporalio.client import Client
from gateway.temporal_client import TemporalClientManager

async def test_graph_viz():
    """Trigger Evercore regeneration with graph data"""
    print("=" * 70)
    print("🔄 Testing Zep Graph Visualization")
    print("=" * 70)

    # Get client
    client = await TemporalClientManager.get_client()

    # Input data
    input_data = {
        "url": "https://www.evercore.com",
        "category": "placement_agent",
        "jurisdiction": "US",
        "force_update": True,
        "app": "placement"
    }

    workflow_id = f"test-graph-viz-evercore"

    print(f"✅ Starting workflow: {workflow_id}")
    print(f"🔗 Force update: True")
    print("⏳ Waiting for completion...\n")

    # Start and wait
    result = await client.execute_workflow(
        "CompanyCreationWorkflow",
        input_data,
        id=workflow_id,
        task_queue="company-queue"
    )

    print("\n" + "=" * 70)
    print("✅ Graph Visualization Test Complete!")
    print("=" * 70)
    print(f"Status: {result.get('status')}")
    print(f"Company ID: {result.get('company_id')}")
    print(f"Slug: {result.get('slug')}")
    print(f"Data Completeness: {result.get('data_completeness')}%")
    print(f"Research Cost: ${result.get('research_cost', 0):.4f}")
    print(f"Research Confidence: {result.get('research_confidence', 0):.2f}")
    print(f"\n🌐 View at: https://placement.quest/private-equity-placement-agents/{result.get('slug')}")
    print(f"🎨 Check graph at: /api/zep-graph/{result.get('company_id')}")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_graph_viz())
