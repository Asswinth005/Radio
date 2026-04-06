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

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Calculate relative depth
  const fileDir = path.dirname(file);
  const relativeToRoot = path.relative(fileDir, rootDir).replace(/\\\\/g, '/');
  
  // The prefix to append before 'Asserts/Images/'
  const prefix = relativeToRoot ? relativeToRoot + '/' : '';

  // Only fix files that actually need the prefix (i.e. not in root)
  if (prefix !== '') {
      // 1. Fix src attributes
      content = content.replace(/src="(?:\\.\\.\\/)*(Asserts\\/Images\\/[^"]+)"/g, 'src="' + prefix + '$1"');
      
      // 2. Fix url() in inline styles
      content = content.replace(/url\\(['"]?(?:\\.\\.\\/)*(Asserts\\/Images\\/[^'"]+)['"]?\\)/g, 'url(\\'' + prefix + '$1\\')');
  }

  // Double check that we didn't leave any broken css URLs in Dashborad
  // Actually, I should just fix ANY 'Asserts/Images/' that doesn't start with '../' if depth > 0
  if (prefix !== '') {
      // First strip any existing ../ to normalize, then apply the exact correct prefix
      content = content.replace(/src="(?:\\.\\.\\/)+Asserts\\/Images\\/([^"]+)"/g, 'src="Asserts/Images/$1"');
      content = content.replace(/src="Asserts\\/Images\\/([^"]+)"/g, 'src="' + prefix + 'Asserts/Images/$1"');

      content = content.replace(/url\\(['"]?(?:\\.\\.\\/)+Asserts\\/Images\\/([^'"]+)['"]?\\)/g, 'url(\\'Asserts/Images/$1\\')');
      content = content.replace(/url\\(['"]?Asserts\\/Images\\/([^'"]+)['"]?\\)/g, 'url(\\'' + prefix + 'Asserts/Images/$1\\')');
  }

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Successfully bound deeply-nested image sources mapping dynamically to Asserts/Images!');
