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

  // Fix the broken media query syntax left over by fix.js
  const brokenCSSRegex = /\s*\.desktop-only\s*{\s*display:\s*none\s*!important;\s*}\s*\.hamburger\s*{\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*}\s*}/g;
  content = content.replace(brokenCSSRegex, '');

  content = content.replace(/\s*\.desktop-only\s*{\s*display:\s*none\s*!important;\s*}\s*\.hamburger\s*{\s*display:\s*flex\s*!important;\s*align-items:\s*center;\s*justify-content:\s*center;\s*visibility:\s*visible;\s*opacity:\s*1;\s*}\s*}\s*}/g, '');


  // Double check any rogue '}' immediately before '/* ================= FOOTER'
  content = content.replace(/}\s*(\/\* =+ FOOTER)/g, '$1');

  // 1. Double check the accent color applied cleanly
  // In `MemperShip.html`, the text color gradient from-accent to-secondary might have been corrupted by removing `from-` and `to-`.
  // Let's ensure text classes are safe.
  content = content.replace(/text-transparent bg-clip-text bg-accent to-[a-z0-9-]+/g, 'text-accent');

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Final syntax checks complete!');
