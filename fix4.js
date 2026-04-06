const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const pagesMap = {
    'Home': 'index.html',
    'Home 1': 'index.html',
    'WaveKind FM': 'index.html',
    'About': 'AboutPage.html',
    'Shows': 'ShowPage.html',
    'Podcasts': 'PodcastPage.html',
    'Contact': 'ContactPage.html',
    'Live': 'LivePage.html',
    'Live Stream': 'LivePage.html',
    'User Panel': 'Dashborad/User/User.html',
    'Admin Panel': 'Dashborad/Admin/AdminPage.html',
    'Dashboard': 'Dashborad/User/User.html'
};

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

const htmlFiles = getAllHtmlFiles(rootDir);

const footerResponsiveCSS = `
        /* ================= INJECTED FOOTER RESPONSIVENESS ================= */
        .site-footer { font-family: '"Plus Jakarta Sans"', system-ui, -apple-system, sans-serif; }
        @media (max-width: 1024px) {
            .footer-main-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 2.5rem;
            }
        }
        @media (max-width: 768px) {
            .newsletter-form { flex-direction: column; }
            .newsletter-form button { width: 100%; }
            .footer-main-grid {
                grid-template-columns: 1fr !important;
                gap: 2.5rem;
            }
            .bottom-wrapper {
                flex-direction: column;
                text-align: center;
                gap: 15px;
            }
        }
`;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Ensure footer responsive overrides exist right before </style>
  if(!content.includes('INJECTED FOOTER RESPONSIVENESS')) {
      content = content.replace(/<\/style>/, footerResponsiveCSS + '</style>');
  }

  // Calculate relative path base
  const fileDir = path.dirname(file);

  // Link Replacement Function
  content = content.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (fullMatch, currentHref, innerHTML) => {
      // Don't modify external links or #anchors that are not mostly empty dummy links
      if(currentHref.startsWith('http')) return fullMatch;
      
      const cleanText = innerHTML.replace(/<[^>]+>/g, '').trim();
      let targetFile = null;

      // Special cases based on distinct icons/text
      if (cleanText.includes('Live')) targetFile = pagesMap['Live'];
      else if (cleanText.includes('Admin Panel')) targetFile = pagesMap['Admin Panel'];
      else if (cleanText.includes('User Panel')) targetFile = pagesMap['User Panel'];
      else if (cleanText.includes('WaveKind FM') || fullMatch.includes('nav-logo')) targetFile = 'index.html';
      else if (pagesMap[cleanText]) {
          targetFile = pagesMap[cleanText];
      } else if (cleanText === '') {
          if(fullMatch.includes('nav-logo')) targetFile = 'index.html';
      }

      if(targetFile) {
          const targetAbs = path.join(rootDir, targetFile);
          let relative = path.relative(fileDir, targetAbs).replace(/\\\\/g, '/');
          if (relative === '') relative = path.basename(targetFile);
          
          return fullMatch.replace(/href="[^"]*"/, 'href="' + relative + '"');
      }
      
      return fullMatch;
  });

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Successfully injected footer responsive CSS and bound all navigation links!');
