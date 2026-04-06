const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dashUserPath = path.join(rootDir, 'Dashborad', 'User', 'User.html');
const dashAdminPath = path.join(rootDir, 'Dashborad', 'Admin', 'AdminPage.html');

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
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

const standardFooterHTML = '<footer class="site-footer">' +
'    <div class="footer-newsletter">' +
'        <div class="footer-container newsletter-wrapper">' +
'            <div class="newsletter-text">' +
'                <h3 class="text-textMain text-2xl font-extrabold mb-2">Stay in the <span class="text-primary">Loop</span></h3>' +
'                <p class="text-base text-textMuted font-medium">Weekly updates on shows, podcasts & exclusive content.</p>' +
'            </div>' +
'            <form class="newsletter-form" onsubmit="event.preventDefault(); alert(\\\'Thanks for subscribing!\\\');">' +
'                <input type="email" placeholder="Your email address" required>' +
'                <button class="btn btn-primary-custom" type="submit">Subscribe</button>' +
'            </form>' +
'        </div>' +
'    </div>' +
'    <div class="footer-main-grid">' +
'        <div class="footer-col">' +
'            <a href="index.html" class="nav-logo" style="margin-bottom: 0.5rem;">' +
'                <div class="logo-mark"><i class="bi bi-broadcast-pin"></i></div>' +
'                <span class="logo-text">WaveKind FM</span>' +
'            </a>' +
'            <div class="footer-brand">' +
'                <p>Independent, community-powered radio platform. Discover local voices, live shows, and meaningful stories — anytime, anywhere.</p>' +
'            </div>' +
'        </div>' +
'        <div class="footer-col">' +
'            <h4>Quick Links</h4>' +
'            <ul class="footer-links">' +
'                <li><a href="index.html">Home</a></li>' +
'                <li><a href="AboutPage.html">About</a></li>' +
'                <li><a href="ShowPage.html">Shows</a></li>' +
'                <li><a href="PodcastPage.html">Podcasts</a></li>' +
'                <li><a href="ContactPage.html">Contact</a></li>' +
'            </ul>' +
'        </div>' +
'        <div class="footer-col">' +
'            <h4>Explore</h4>' +
'            <ul class="footer-links">' +
'                <li><a href="LivePage.html">Live Radio</a></li>' +
'                <li><a href="ShowPage.html">Featured Shows</a></li>' +
'                <li><a href="PodcastPage.html">Podcast Directory</a></li>' +
'                <li><a href="MemperShip.html">Membership</a></li>' +
'            </ul>' +
'        </div>' +
'        <div class="footer-col">' +
'            <h4>Connect</h4>' +
'            <div class="contact-item"><i class="bi bi-envelope-fill"></i><span>hello@wavekind.fm</span></div>' +
'            <div class="contact-item"><i class="bi bi-geo-alt-fill"></i><span>42 Frequency Ave, New York</span></div>' +
'            <div class="contact-item"><i class="bi bi-telephone-fill"></i><span>+1 (555) 019-8832</span></div>' +
'            <div class="social-icons">' +
'                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
'                <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>' +
'                <a href="#" aria-label="Spotify"><i class="bi bi-spotify"></i></a>' +
'            </div>' +
'        </div>' +
'    </div>' +
'    <div class="footer-bottom">' +
'        <div class="bottom-wrapper">' +
'            <div class="copyright">© 2026 WaveKind FM. All rights reserved.</div>' +
'            <div class="trust-legal">' +
'                <a href="#">Privacy Policy</a><span>|</span>' +
'                <a href="#">Terms of Service</a><span>|</span>' +
'                <a href="#">Cookie Settings</a>' +
'            </div>' +
'        </div>' +
'    </div>' +
'</footer>';

const smallFooterHTML = '<footer class="bg-card border-t border-border py-6 mt-auto w-full z-10 relative">' +
'    <div class="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-textMuted">' +
'        <div>&copy; 2026 WaveKind FM. All rights reserved.</div>' +
'        <div class="flex gap-6">' +
'            <a href="../../index.html" class="hover:text-accent transition-colors font-bold text-textMain"><i class="bi bi-arrow-left-short"></i> Back to Main Site</a>' +
'            <a href="#" class="hover:text-accent transition-colors">Support</a>' +
'            <a href="#" class="hover:text-accent transition-colors">Terms</a>' +
'        </div>' +
'    </div>' +
'</footer>';

const universalFooterCSS = "        /* ================= UNIFIED FOOTER CSS FOR ALIGNMENT AND FONT ================= */\n" +
"        .site-footer { font-family: inherit; background: var(--footer-bg); margin-top: auto; border-top: 1px solid var(--border); width: 100%; }\n" +
"        .site-footer * { font-family: inherit; }\n" +
"        .footer-newsletter { background: var(--bg2); padding: 3rem 0; border-bottom: 1px solid var(--border-footer); }\n" +
"        .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; width: 100%; }\n" +
"        .newsletter-wrapper { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem; text-align: center; }\n" +
"        .newsletter-text h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; }\n" +
"        .newsletter-text p { color: var(--text-muted); font-size: 0.95rem; }\n" +
"        .newsletter-form { display: flex; gap: 0.5rem; width: 100%; max-width: 450px; justify-content: center; }\n" +
"        .newsletter-form input { flex: 1; padding: 0.85rem 1.2rem; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text-main); outline: none; }\n" +
"        .newsletter-form input:focus { border-color: var(--accent); }\n" +
"        .newsletter-form button { flex-shrink: 0; }\n" +
"        .footer-main-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; padding: 4rem 1.5rem; max-width: 1200px; margin: 0 auto; }\n" +
"        .footer-col { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }\n" +
"        .footer-brand { display: flex; flex-direction: column; align-items: flex-start; text-align: left; margin-top: 1rem; }\n" +
"        .footer-brand p { color: var(--text-muted); line-height: 1.6; font-size: 0.9rem; max-width: 260px; }\n" +
"        .footer-col h4 { color: var(--text-main); font-size: 1.1rem; font-weight: 800; margin-bottom: 1.25rem; }\n" +
"        .footer-links { list-style: none; padding: 0; display: flex; flex-direction: column; align-items: flex-start; width: 100%; }\n" +
"        .footer-links li { margin-bottom: 0.75rem; }\n" +
"        .footer-links a { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: 0.2s; text-decoration: none; }\n" +
"        .footer-links a:hover { color: var(--accent); transform: translateX(3px); }\n" +
"        .contact-item { display: flex; flex-direction: row; align-items: flex-start; gap: 12px; margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }\n" +
"        .contact-item i { color: var(--accent); font-size: 1.1rem; margin-top: 2px; }\n" +
"        .social-icons { display: flex; justify-content: flex-start; gap: 10px; margin-top: 0.5rem; flex-wrap: wrap; }\n" +
"        .social-icons a { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; color: var(--text-main); transition: 0.3s; text-decoration: none; }\n" +
"        .social-icons a:hover { background: var(--accent); border-color: var(--accent); color: white; transform: translateY(-3px); }\n" +
"        .footer-bottom { border-top: 1px solid var(--border-footer); padding: 1.5rem 0; background: var(--bg); }\n" +
"        .bottom-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 1rem; }\n" +
"        .copyright { color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }\n" +
"        .trust-legal { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; justify-content: center; }\n" +
"        .trust-legal a { color: var(--text-muted); font-size: 0.85rem; font-weight: 600; transition: 0.2s; text-decoration: none; }\n" +
"        .trust-legal a:hover { color: var(--accent); }\n" +
"        .trust-legal span { color: var(--border-footer); }\n" +
"        @media (max-width: 1024px) { \n" +
"            .footer-main-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 3rem; padding: 3rem 1.5rem; } \n" +
"        }\n" +
"        @media (max-width: 768px) { \n" +
"            .newsletter-form { flex-direction: column; width: 100%; } \n" +
"            .newsletter-form button { width: 100%; } \n" +
"            .footer-main-grid { grid-template-columns: 1fr !important; gap: 2.5rem; } \n" +
"            .bottom-wrapper { flex-direction: column; text-align: center; gap: 1rem; } \n" +
"        }\n";

function fixPath(htmlString, fileDir) {
    return htmlString.replace(/href="([^"]+)"/g, (match, p1) => {
        if(p1.startsWith('http') || p1 === '#' || p1.startsWith('#')) return match;
        const targetAbs = path.join(rootDir, p1);
        let rel = path.relative(fileDir, targetAbs).replace(/\\\\/g, '/');
        if(rel==='') rel = path.basename(p1);
        return 'href="' + rel + '"';
    });
}

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  const fileDir = path.dirname(file);

  const uiPolish = "        /* UX Overrides */\n" +
  "        .pro-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid var(--border); }\n" +
  "        .pro-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-color: var(--accent); z-index: 10; }\n" +
  "        .btn { transition: all 0.3s ease; }\n" +
  "        .btn:active { transform: scale(0.97); }\n";

  if(!content.includes('UNIFIED FOOTER CSS')) {
      content = content.replace(/<\/style>/, uiPolish + universalFooterCSS + '</style>');
  }

  // Clear out any old footer and replace with unified footer template to fix font variations!
  content = content.replace(/<footer\b[^>]*>([\\s\\S]*?)<\/footer>/gi, '');
  
  const isDashboard = file.includes('Dashborad');
  let injectedFooter = isDashboard ? fixPath(smallFooterHTML, fileDir) : fixPath(standardFooterHTML, fileDir);
  
  content = content.replace(/<\/body>/, injectedFooter + '\\n</body>');
  content = content.replace(/font-family:\\s*'[^']+',[^;]+;/, "font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;");

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Successfully polished Footers, UI UX effects, and Font Inheritance!');
