#!/usr/bin/env python3
"""
Comprehensive CSS fix for all regional pages.
Fixes 6 types of CSS errors across 5 files.
"""

files_to_fix = [
    'src/pages/top-private-equity-placement-agents-us/index.astro',
    'src/pages/top-private-equity-placement-agents-uk/index.astro',
    'src/pages/top-private-equity-placement-agents-singapore/index.astro',
    'src/pages/top-private-equity-placement-agents-latin-america/index.astro',
    'src/pages/top-private-equity-placement-agents-asia-pacific/index.astro',
]

# Fix 1: Move transform into .region-btn:hover block
fix_1_old = '''    .region-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
      transform: translateY(-2px);
    }'''

fix_1_new = '''    .region-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      transform: translateY(-2px);
    }'''

# Fix 2: Remove extra brace after .region-btn.active
fix_2_old = '''    .region-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: transparent;
      color: #fff;
    }
    }'''

fix_2_new = '''    .region-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: transparent;
      color: #fff;
    }'''

# Fix 3: Remove extra brace after h2
fix_3_old = '''    h2 {
      font-size: 36px;
      margin-bottom: 16px;
      color: #fff;
    }
    }'''

fix_3_new = '''    h2 {
      font-size: 36px;
      margin-bottom: 16px;
      color: #fff;
    }'''

# Fix 4: Combine .btn block
fix_4_old = '''    .btn {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
    }
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.3s;
    }'''

fix_4_new = '''    .btn {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.3s;
    }'''

# Fix 5: Remove extra brace after .footer-section h4
fix_5_old = '''    .footer-section h4 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #fff;
    }
    }'''

fix_5_new = '''    .footer-section h4 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #fff;
    }'''

# Fix 6: Remove extra brace after .footer-section a:hover
fix_6_old = '''    .footer-section a:hover {
      color: #fff;
    }
    }'''

fix_6_new = '''    .footer-section a:hover {
      color: #fff;
    }'''

fixes = [
    (fix_1_old, fix_1_new, "transform in .region-btn:hover"),
    (fix_2_old, fix_2_new, "extra brace after .region-btn.active"),
    (fix_3_old, fix_3_new, "extra brace after h2"),
    (fix_4_old, fix_4_new, ".btn block properties"),
    (fix_5_old, fix_5_new, "extra brace after .footer-section h4"),
    (fix_6_old, fix_6_new, "extra brace after .footer-section a:hover"),
]

for file_path in files_to_fix:
    print(f"\nProcessing {file_path}...")

    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content
    fixes_applied = []

    for old, new, description in fixes:
        if old in content:
            content = content.replace(old, new)
            fixes_applied.append(description)

    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Fixed: {', '.join(fixes_applied)}")
    else:
        print(f"  ✓ No fixes needed (already clean)")

print("\n✅ All CSS fixes complete!")
