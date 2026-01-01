#!/usr/bin/env python3
import os
import re

# List of files to update
files = [
    '/Users/dankeegan/placement/src/pages/private-credit-placement-agents/index.astro',
    '/Users/dankeegan/placement/src/pages/real-estate-private-equity-placement-agents/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-europe/index.astro',
    '/Users/dankeegan/placement/src/pages/articles/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-singapore/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-us/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-asia-pacific/index.astro',
    '/Users/dankeegan/placement/src/pages/private-equity-placement-agents-list/index.astro',
    '/Users/dankeegan/placement/src/pages/private-equity-placement-agents-list/[slug].astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-north-america/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-latin-america/index.astro',
    '/Users/dankeegan/placement/src/pages/top-private-equity-placement-agents-uk/index.astro',
    '/Users/dankeegan/placement/src/pages/venture-capital-placement-agents/index.astro',
]

old_nav = '''          <a href="/top-private-equity-placement-agents-us">United States</a>
          <a href="/top-private-equity-placement-agents-uk">United Kingdom</a>
          <a href="/top-private-equity-placement-agents-singapore">Singapore</a>
        </div>'''

new_nav = '''          <a href="/top-private-equity-placement-agents-us">United States</a>
          <a href="/top-private-equity-placement-agents-uk">United Kingdom</a>
          <a href="/top-private-equity-placement-agents-singapore">Singapore</a>
          <div class="dropdown-divider"></div>
          <a href="/venture-capital-placement-agents">Venture Capital Placement Agents</a>
          <a href="/private-credit-placement-agents">Private Credit Placement Agents</a>
          <a href="/real-estate-private-equity-placement-agents">Real Estate PE Placement Agents</a>
        </div>'''

for filepath in files:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    if old_nav in content:
        updated_content = content.replace(old_nav, new_nav)
        with open(filepath, 'w') as f:
            f.write(updated_content)
        print(f"✓ Updated navigation in {filepath}")
    else:
        print(f"⚠ Navigation pattern not found in {filepath}")

print("\nNavigation update complete!")
