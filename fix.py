import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Contact Page Let's Talk fix
    content = re.sub(
        r'class="text-transparent\s+bg-clip-text\s+bg-accent\s*"',
        'class="text-accent"',
        content
    )

    # 2. Dashboard width and padding
    if "Dashborad" in filepath:
        content = re.sub(r'max-w-\[1200px\]', 'max-w-5xl', content)
        content = re.sub(r'p-4\s+sm:p-6\s+lg:p-10', 'p-6 sm:p-8 lg:p-12', content)

    # 3. Nav bar font size
    content = re.sub(
        r'(\.nav-link\s*\{[^}]*)font-size:\s*0\.9rem;',
        r'\1font-size: 1.1rem;',
        content
    )

    # 4. Contrast issues
    # Light mode accent:
    # We replace --accent: #ff4d6d; inside :root but not inside [data-theme="dark"]
    # We can do a smart replace where we see :root { ... }
    
    # Let's standardize all --accent: #ff4d6d to --accent: #e63956
    # #e63956 has a much better contrast on light backgrounds.
    content = re.sub(r'--accent:\s*#[a-fA-F0-9]+;', '--accent: #d90429;', content)
    content = re.sub(r'--accent-dark:\s*#[a-fA-F0-9]+;', '--accent-dark: #bd0022;', content)
    
    content = re.sub(r'--text-muted:\s*#6c757d;', '--text-muted: #495057;', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for filepath in glob.glob('f:/Radio/**/*.html', recursive=True):
    process_file(filepath)
