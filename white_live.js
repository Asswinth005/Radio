const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f_path => {
    let content = fs.readFileSync(f_path, 'utf8');

    // Change .live-dot background to white in CSS
    // Matches .live-dot { ... background: var(--accent); ... }
    const cssRegex = /(\.live-dot\s*\{[^}]*background:\s*)var\(--accent\)/g;
    content = content.replace(cssRegex, '$1#ffffff');

    // Also handle possible direct colors in badges
    content = content.replace(/border-red-500\/30/g, 'border-white/20');
    content = content.replace(/bg-red-500\/10/g, 'bg-white/5');
    content = content.replace(/text-red-500/g, 'text-white');
    content = content.replace(/shadow-\[0_0_15px_rgba\(239,68,68,0\.2\)\]/g, 'shadow-[0_0_15px_rgba(255,255,255,0.1)]');

    fs.writeFileSync(f_path, content);
});
