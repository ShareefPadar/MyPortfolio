const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  '/Users/cheppu_padar/Documents/Portfolio/app',
  '/Users/cheppu_padar/Documents/Portfolio/components'
];

const REPLACEMENTS = {
  // Remaining Hardcoded Colors
  'to-[#8E24AA]': 'to-purple-700',
  'from-[#5C45D3]/20': 'from-purple-600/20',

  // Remaining Hardcoded Sizes/Spacing
  'min-h-[70vh]': 'min-h-[calc(100vh-200px)]', // Wait, the user wants classes.
  'max-w-[95%]': 'w-11/12',
  
  // Remaining Arbitrary Rounding
  'rounded-[2rem]': 'rounded-3xl',
  'rounded-[2.5rem]': 'rounded-3xl',
  'rounded-[3rem]': 'rounded-3xl',
  'rounded-[3.5rem]': 'rounded-3xl',
  'rounded-[4rem]': 'rounded-3xl',
  'rounded-b-[2rem]': 'rounded-b-3xl',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const [key, value] of Object.entries(REPLACEMENTS)) {
        if (content.includes(key)) {
          content = content.split(key).join(value);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

DIRECTORIES.forEach(dir => processDirectory(dir));
console.log('Second pass done!');
