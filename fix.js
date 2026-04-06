const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(__dirname);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Theme Variables
  content = content.replace(/--accent:\s*#[a-zA-Z0-9]+;/g, '--accent: #ff4d6d;');
  content = content.replace(/--accent-dark:\s*#[a-zA-Z0-9]+;/g, '--accent-dark: #e63956;');
  content = content.replace(/--secondary:\s*#[a-zA-Z0-9]+;/g, '--secondary: #6366f1;');
  
  // Light bg
  content = content.replace(/--bg:\s*#[a-zA-Z0-9]+;/, '--bg: #ffffff;');
  content = content.replace(/--bg2:\s*#[a-zA-Z0-9]+;/, '--bg2: #f8f9fa;');
  content = content.replace(/--bg3:\s*#[a-zA-Z0-9]+;/, '--bg3: #e9ecef;');
  content = content.replace(/--card:\s*#[a-zA-Z0-9]+;/, '--card: #ffffff;');
  content = content.replace(/--text-main:\s*#[a-zA-Z0-9]+;/, '--text-main: #2b2b2b;');
  content = content.replace(/--text-muted:\s*#[a-zA-Z0-9]+;/, '--text-muted: #6c757d;');
  content = content.replace(/--border:\s*[^;]+;/, '--border: rgba(0, 0, 0, 0.08);');
  content = content.replace(/--border-footer:\s*[^;]+;/, '--border-footer: rgba(0, 0, 0, 0.08);');
  content = content.replace(/--footer-bg:\s*#[a-zA-Z0-9]+;/, '--footer-bg: #f8f9fa;');

  // Dark bg
  content = content.replace(/\[data-theme="dark"\]\s*{([\s\S]*?)}/g, function(match, p1) {
    let inner = p1;
    inner = inner.replace(/--bg:\s*#[a-zA-Z0-9]+;/, '--bg: #111827;');
    inner = inner.replace(/--bg2:\s*#[a-zA-Z0-9]+;/, '--bg2: #1f2937;');
    inner = inner.replace(/--bg3:\s*#[a-zA-Z0-9]+;/, '--bg3: #374151;');
    inner = inner.replace(/--card:\s*#[a-zA-Z0-9]+;/, '--card: #1f2937;');
    inner = inner.replace(/--text-main:\s*#[a-zA-Z0-9]+;/, '--text-main: #f1f5f9;');
    inner = inner.replace(/--text-muted:\s*#[a-zA-Z0-9]+;/, '--text-muted: #94a3b8;');
    inner = inner.replace(/--border:\s*[^;]+;/, '--border: rgba(255, 255, 255, 0.08);');
    inner = inner.replace(/--border-footer:\s*[^;]+;/, '--border-footer: rgba(255, 255, 255, 0.08);');
    inner = inner.replace(/--footer-bg:\s*#[a-zA-Z0-9]+;/, '--footer-bg: #111827;');
    return '[data-theme="dark"] {' + inner + '}';
  });

  // 2. Fix Navbar Breakpoint
  const navQueryRegex = /@media\s*\(\s*max-width:\s*1024px\s*\)\s*{[^}]+}/g;
  const newNavQuery = `@media (max-width: 1024px) {
            .nav-menu { display: none !important; }
            .desktop-only { display: none !important; }
            .nav-actions .icon-btn:not(.hamburger) { display: none !important; }
            .hamburger { display: flex !important; align-items: center; justify-content: center; visibility: visible; opacity: 1; }
        }`;
  if (navQueryRegex.test(content)) {
    content = content.replace(navQueryRegex, newNavQuery);
  }

  // Ensure hamburger is cleanly defined
  content = content.replace(/.hamburger\s*{\s*display:\s*none;/, '.hamburger { display: none;');

  // 3. Remove Tailwind Gradients
  content = content.replace(/\bbg-gradient-to-[a-z]+\b/g, 'bg-accent');
  content = content.replace(/\bfrom-[a-z0-9-]+\b/g, '');
  content = content.replace(/\bvia-[a-z0-9-]+\b/g, '');
  content = content.replace(/\bto-[a-z0-9-]+\b/g, '');
  // Because replacing them might leave multiple spaces, but browser ignores them.
  // We swapped bg-gradient-to-... with bg-accent, so it gets a solid color!

  // 4. Alignments max-w-7xl -> max-w-[1200px]
  content = content.replace(/\bmax-w-7xl\b/g, 'max-w-[1200px]');
  content = content.replace(/\bmax-w-6xl\b/g, 'max-w-[1100px]');

  // 5. Image Local Paths & Object Fit
  // Replace unplash
  content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s'"]+/g, 'Asserts/Images/hero-bg.jpg');
  content = content.replace(/https:\/\/i\.pravatar\.cc\/[^\s'"]+/g, 'Asserts/Images/user.jpg');
  // Make sure img tags have object fit if they don't
  content = content.replace(/<img(.*?)class="([^"]*?)"/g, function(match, p1, p2) {
      if(!p2.includes('object-cover')) {
          return `<img${p1}class="${p2} w-full h-auto object-cover"`;
      }
      return match;
  });

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('All files processed with Node.js!');
