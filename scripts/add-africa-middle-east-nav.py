#!/usr/bin/env python3
import os
import re

# Files to update
files_to_update = [
    'src/pages/private-equity-placement-agents-list/index.astro',
    'src/pages/top-private-equity-placement-agents-north-america/index.astro',
    'src/pages/top-private-equity-placement-agents-europe/index.astro',
    'src/pages/top-private-equity-placement-agents-asia-pacific/index.astro',
    'src/pages/top-private-equity-placement-agents-latin-america/index.astro',
    'src/pages/top-private-equity-placement-agents-us/index.astro',
    'src/pages/top-private-equity-placement-agents-uk/index.astro',
    'src/pages/top-private-equity-placement-agents-singapore/index.astro',
    'src/pages/venture-capital-placement-agents/index.astro',
    'src/pages/private-credit-placement-agents/index.astro',
    'src/pages/real-estate-private-equity-placement-agents/index.astro',
    'src/pages/boutique-private-equity-placement-agents/index.astro',
    'src/pages/resources/placement-agent-software.astro',
]

# Pattern 1: Standard dropdown navigation (homepage style)
pattern1 = r'(href="/top-private-equity-placement-agents-latin-america">Latin America</a>\s*\n\s*<div class="dropdown-divider"></div>)'
replacement1 = r'href="/top-private-equity-placement-agents-latin-america">Latin America</a>\n          <a href="/top-private-equity-placement-agents-africa">Africa</a>\n          <a href="/top-private-equity-placement-agents-middle-east">Middle East</a>\n          <div class="dropdown-divider"></div>'

# Pattern 2: Tailwind-style dropdown navigation (slug page style)
pattern2 = r'(href="/top-private-equity-placement-agents-latin-america" class="block px-4 py-2[^"]*">Latin America</a>\s*\n\s*<div class="h-px bg-slate-800/50 my-2"></div>)'
replacement2 = r'href="/top-private-equity-placement-agents-latin-america" class="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm">Latin America</a>\n              <a href="/top-private-equity-placement-agents-africa" class="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm">Africa</a>\n              <a href="/top-private-equity-placement-agents-middle-east" class="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm">Middle East</a>\n              <div class="h-px bg-slate-800/50 my-2"></div>'

updated_count = 0

for file_path in files_to_update:
    full_path = f'/Users/dankeegan/placement/{file_path}'
    if not os.path.exists(full_path):
        print(f'⚠️  Skipping {file_path} (not found)')
        continue

    with open(full_path, 'r') as f:
        content = f.read()

    original_content = content

    # Try pattern 1 first
    content = re.sub(pattern1, replacement1, content)

    # Then try pattern 2
    content = re.sub(pattern2, replacement2, content)

    if content != original_content:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f'✅ Updated {file_path}')
        updated_count += 1
    else:
        print(f'⏭️  No changes needed in {file_path}')

print(f'\n✨ Complete! Updated {updated_count} files.')
