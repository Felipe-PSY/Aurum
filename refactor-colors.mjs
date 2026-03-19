import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    content = content.replace(/\[#0A0A0A\]/gi, "brand-primary");
    content = content.replace(/\[#0F0F0F\]/gi, "brand-secondary");
    content = content.replace(/\[#D4AF37\]/gi, "brand-accent");
    content = content.replace(/\[#F5F5DC\]/gi, "brand-text");
    
    // Replace strings that are used as regular properties (like `<stop stopColor="#D4AF37" />`)
    content = content.replace(/"#D4AF37"/gi, "\"var(--color-accent)\"");
    content = content.replace(/'#D4AF37'/gi, "'var(--color-accent)'");

    if (content !== orig) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Modified: ' + filePath);
      modifiedCount++;
    }
  }
});

console.log(`Refactor complete. Modified ${modifiedCount} files.`);
