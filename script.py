import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Update font-weights for headings/elements 
    content = re.sub(r'font-extrabold', 'font-semibold', content)
    content = re.sub(r'font-bold', 'font-semibold', content)
    content = re.sub(r'font-black', 'font-semibold', content)

    # 2. Update CSS font-weight
    content = re.sub(r'font-weight:\s*700\s*;?', 'font-weight: 600;', content)
    content = re.sub(r'font-weight:\s*800\s*;?', 'font-weight: 600;', content)
    content = re.sub(r'font-weight:\s*900\s*;?', 'font-weight: 600;', content)

    # 3. Brand color without variations (Make accent-dark the same as accent)
    content = re.sub(r'--accent-dark:\s*#[a-f0-9A-F]+;', '--accent-dark: #ff4d6d;', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for filepath in glob.glob('f:/Radio/**/*.html', recursive=True):
    process_file(filepath)

print("Done font weights and brand color consistency.")
