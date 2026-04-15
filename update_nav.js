const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f_path => {
    let content = fs.readFileSync(f_path, 'utf8');

    // Desktop Nav
    content = content.replace(/<li>\s*<a href="LivePage\.html" class="nav-link[^"]*".*?>([\s\S]*?)Live<\/a>\s*<\/li>/g, 
        '<li><a href="LivePage.html" class="nav-link" style="color:var(--accent);">Streaming</a></li>');

    // Mobile Nav
    content = content.replace(/<li>\s*<a href="LivePage\.html" class="mobile-nav-link[^"]*".*?>Live Stream([\s\S]*?)<\/a>\s*<\/li>/g, 
        '<li><a href="LivePage.html" class="mobile-nav-link" style="color:var(--accent);">Streaming</a></li>');

    // Footer
    content = content.replace(/<li>\s*<a href="LivePage\.html">Live Radio<\/a>\s*<\/li>/g, 
        '<li><a href="LivePage.html">Streaming</a></li>');

    fs.writeFileSync(f_path, content);
});
