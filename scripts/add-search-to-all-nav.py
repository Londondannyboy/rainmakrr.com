#!/usr/bin/env python3
import os
import re

# Files to update
files_to_update = [
    'src/pages/top-private-equity-placement-agents-north-america/index.astro',
    'src/pages/top-private-equity-placement-agents-europe/index.astro',
    'src/pages/top-private-equity-placement-agents-asia-pacific/index.astro',
    'src/pages/top-private-equity-placement-agents-latin-america/index.astro',
    'src/pages/top-private-equity-placement-agents-africa/index.astro',
    'src/pages/top-private-equity-placement-agents-middle-east/index.astro',
    'src/pages/top-private-equity-placement-agents-us/index.astro',
    'src/pages/top-private-equity-placement-agents-uk/index.astro',
    'src/pages/top-private-equity-placement-agents-singapore/index.astro',
    'src/pages/venture-capital-placement-agents/index.astro',
    'src/pages/private-credit-placement-agents/index.astro',
    'src/pages/real-estate-private-equity-placement-agents/index.astro',
    'src/pages/boutique-private-equity-placement-agents/index.astro',
    'src/pages/resources/placement-agent-software.astro',
]

# Pattern: Add search link after Articles link in nav
pattern = r'(<li><a href="/articles">Articles</a></li>\s*\n\s*<li class="nav-item">)'
replacement = r'<li><a href="/articles">Articles</a></li>\n      <li><a href="/search" style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px;">🔍 Search</a></li>\n      <li class="nav-item">'

updated_count = 0

for file_path in files_to_update:
    full_path = f'/Users/dankeegan/placement/{file_path}'
    if not os.path.exists(full_path):
        print(f'⚠️  Skipping {file_path} (not found)')
        continue

    with open(full_path, 'r') as f:
        content = f.read()

    original_content = content

    # Add search link
    content = re.sub(pattern, replacement, content)

    if content != original_content:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f'✅ Updated {file_path}')
        updated_count += 1
    else:
        print(f'⏭️  No changes needed in {file_path}')

print(f'\n✨ Complete! Updated {updated_count} files.')
