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

  // I mistakenly removed the closing bracket of the @media query in fix2.js
  // Let's add it back right after the hamburger class closes, before the footer comment.
  content = content.replace(/visibility:\s*visible;\s*opacity:\s*1;\s*}\s*\/\*\s*=+ FOOTER/g, 
                            "visibility: visible; opacity: 1; }\n        }\n\n        /* ================= FOOTER");
  
  // Just in case it was formatted slightly differently in index.html vs others
  content = content.replace(/justify-content:\s*center;\s*}\n\s*\/\*\s*=+ CENTERED/g, 
                            "justify-content: center;\n            }\n        }\n\n        /* ================= CENTERED");

  // Also catch other variants
  content = content.replace(/visibility:\s*visible;\s*opacity:\s*1;\s*}\s*\/\*\s*-+\s*STRICT/g, 
                            "visibility: visible; opacity: 1; }\n        }\n\n        /* ---------- STRICT");

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Restored the missing @media closing brackets!');
