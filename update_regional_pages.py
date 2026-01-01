#!/usr/bin/env python3
"""
Add featured images and knowledge graph sections to regional pages
"""

import re

regional_pages = [
    'src/pages/top-private-equity-placement-agents-north-america/index.astro',
    'src/pages/top-private-equity-placement-agents-europe/index.astro',
    'src/pages/top-private-equity-placement-agents-asia-pacific/index.astro',
    'src/pages/top-private-equity-placement-agents-latin-america/index.astro',
    'src/pages/top-private-equity-placement-agents-us/index.astro',
    'src/pages/top-private-equity-placement-agents-uk/index.astro',
    'src/pages/top-private-equity-placement-agents-singapore/index.astro',
]

def update_page(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # 1. Add ZepGraphVisualization import at the top (after other imports)
    if 'ZepGraphVisualization' not in content:
        content = content.replace(
            "import Schema from '../../components/Schema.astro';",
            "import Schema from '../../components/Schema.astro';\nimport ZepGraphVisualization from '../../components/ZepGraphVisualization.astro';"
        )

    # 2. Add vis-network script in head (after viewport meta)
    if 'vis-network' not in content:
        content = content.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '''<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/vis-network@9.1.9/standalone/umd/vis-network.min.js" defer></script>'''
        )

    # 3. Update company card HTML to include featured image
    # Find the company card pattern and replace it
    old_card_pattern = r'''(<a href=\{`/private-equity-placement-agents-list/\$\{company\.slug\}`\} style="text-decoration: none; color: inherit;">)\s*<div class="company-card">\s*<h4 class="company-name">\{company\.display_name\}</h4>'''

    new_card_html = r'''\1
          <div class="company-card">
            {company.featured_image_url && (
              <div style="width: 100%; height: 200px; overflow: hidden; margin: -32px -32px 24px -32px; border-radius: 24px 24px 0 0;">
                <img
                  src={company.featured_image_url}
                  alt={company.display_name}
                  loading="lazy"
                  decoding="async"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </div>
            )}
            <h4 class="company-name">{company.display_name}</h4>'''

    content = re.sub(old_card_pattern, new_card_html, content)

    # 4. Add knowledge graph section before footer
    # Extract region name from file path for the graph title
    region_match = re.search(r'placement-agents-([^/]+)/index', file_path)
    region_name = region_match.group(1).replace('-', ' ').title() if region_match else 'Regional'

    graph_section = f'''
  <!-- Regional Knowledge Graph Section -->
  <div class="content" style="margin-top: 80px;">
    <div style="max-width: 1400px; margin: 0 auto;">
      <div class="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-700/30">
        <div class="flex items-center justify-between mb-6">
          <h2 style="font-size: 32px; font-weight: 900; color: #fff; margin: 0;">
            {region_name} PE Network
          </h2>
          <span style="padding: 8px 16px; background: rgba(16, 185, 129, 0.2); color: #6ee7b7; font-size: 12px; font-weight: 600; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
            Knowledge Graph
          </span>
        </div>

        <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 32px; font-size: 16px; line-height: 1.7;">
          Interactive network visualization showing relationships and connections between placement agents, deals, and key people in the {region_name.lower()} private equity ecosystem.
        </p>

        <!-- Graph visualization placeholder -->
        <div style="background: rgba(15, 23, 42, 0.5); border-radius: 16px; padding: 60px 20px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);">
          <svg style="width: 64px; height: 64px; margin: 0 auto 24px; opacity: 0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <h3 style="color: rgba(255, 255, 255, 0.6); font-size: 18px; margin-bottom: 12px;">Regional Network Graph</h3>
          <p style="color: rgba(255, 255, 255, 0.4); font-size: 14px;">
            Comprehensive network visualization showing {{companies.length}} placement agents and their interconnections
          </p>
        </div>
      </div>
    </div>
  </div>

  <footer>'''

    # Replace footer with graph section + footer
    if '<!-- Regional Knowledge Graph Section -->' not in content:
        content = content.replace('  <footer>', graph_section)

    return content

for page_path in regional_pages:
    print(f"Updating {page_path}...")
    updated_content = update_page(page_path)

    with open(page_path, 'w') as f:
        f.write(updated_content)

    print(f"  ✓ Added featured images and knowledge graph section")

print("\n✅ All regional pages updated!")
