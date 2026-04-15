const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f_path => {
    let content = fs.readFileSync(f_path, 'utf8');

    // Desktop Nav Swap: find Contact then Streaming and swap them
    // Supports various class attributes (text-primary, nav-link, etc.)
    const contactRegex = /<li><a href="ContactPage\.html" class="nav-link[^"]*">Contact<\/a><\/li>/;
    const streamingRegex = /<li><a href="LivePage\.html" class="nav-link[^"]*">Streaming<\/a><\/li>/;
    
    const contactMatch = content.match(contactRegex);
    const streamingMatch = content.match(streamingRegex);

    if (contactMatch && streamingMatch) {
        // Ensure they are adjacent (ignoring whitespace)
        // This is tricky with regex, I'll just find the one that comes first
        if (contactMatch.index < streamingMatch.index) {
            // Check if they are actually in the same list area
            // We'll just replace the whole sequence
            const sequenceRegex = new RegExp(contactMatch[0] + '\\s*' + streamingMatch[0]);
            content = content.replace(sequenceRegex, streamingMatch[0] + '\n                ' + contactMatch[0]);
        }
    }

    // Mobile Nav Swap
    const contactMobileRegex = /<li><a href="ContactPage\.html" class="mobile-nav-link[^"]*">Contact<\/a><\/li>/;
    const streamingMobileRegex = /<li><a href="LivePage\.html" class="mobile-nav-link[^"]*">Streaming<\/a><\/li>/;

    const contactMobileMatch = content.match(contactMobileRegex);
    const streamingMobileMatch = content.match(streamingMobileRegex);

    if (contactMobileMatch && streamingMobileMatch) {
        if (contactMobileMatch.index < streamingMobileMatch.index) {
            const sequenceMobileRegex = new RegExp(contactMobileMatch[0] + '\\s*' + streamingMobileMatch[0]);
            content = content.replace(sequenceMobileRegex, streamingMobileMatch[0] + '\n            ' + contactMobileMatch[0]);
        }
    }

    fs.writeFileSync(f_path, content);
});
