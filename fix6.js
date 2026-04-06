const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

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
'</footer>\n</body>';

const smallFooterHTML = '<footer class="bg-card border-t border-border py-6 mt-auto w-full z-10 relative">' +
'    <div class="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-textMuted">' +
'        <div>&copy; 2026 WaveKind FM. All rights reserved.</div>' +
'        <div class="flex gap-6">' +
'            <a href="../../index.html" class="hover:text-accent transition-colors font-bold text-textMain"><i class="bi bi-arrow-left-short"></i> Back to Main Site</a>' +
'            <a href="#" class="hover:text-accent transition-colors">Support</a>' +
'            <a href="#" class="hover:text-accent transition-colors">Terms</a>' +
'        </div>' +
'    </div>' +
'</footer>\n</body>';

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

  // 1. Force removal of ALL existing footers completely.
  content = content.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
  
  // 2. Also scrub out the previous corrupted "\n</body>" attachments that might have piled up
  content = content.replace(/\\n<\/body>/g, '');
  content = content.replace(/<\/body>/gi, '');

  // 3. Re-inject EXACTLY ONE Footer + exact </body>!
  const isDashboard = file.includes('Dashborad');
  let injectedFooter = isDashboard ? fixPath(smallFooterHTML, fileDir) : fixPath(standardFooterHTML, fileDir);
  
  // Clean trailing spaces and append safely
  content = content.trim() + '\n' + injectedFooter + '\n</html>';
  // Also clean up trailing </html> </html> if it piled up
  content = content.replace(/(<\/html>\s*)+/gi, '\n</html>');

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Successfully wiped and reset EXACTLY ONE footer natively!');
