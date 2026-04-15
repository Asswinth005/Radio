import os
import re

def update_nav():
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    for f_path in files:
        with open(f_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Desktop Nav (more robust)
        # Matches <li><a href="LivePage.html" ... >[anything]Live</a></li>
        content = re.sub(
            r'<li>\s*<a href="LivePage\.html" class="nav-link[^"]*".*?>(.*?)Live</a>\s*</li>',
            r'<li><a href="LivePage.html" class="nav-link" style="color:var(--accent);">Streaming</a></li>',
            content, flags=re.DOTALL
        )
        
        # Mobile Nav
        # Matches <li><a href="LivePage.html" class="mobile-nav-link" ... >Live Stream[anything]</a></li>
        content = re.sub(
            r'<li>\s*<a href="LivePage\.html" class="mobile-nav-link[^"]*".*?>Live Stream.*?</a>\s*</li>',
            r'<li><a href="LivePage.html" class="mobile-nav-link" style="color:var(--accent);">Streaming</a></li>',
            content, flags=re.DOTALL
        )
        
        # Footer
        content = re.sub(
            r'<li>\s*<a href="LivePage\.html">Live Radio</a>\s*</li>',
            r'<li><a href="LivePage.html">Streaming</a></li>',
            content
        )

        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    update_nav()
