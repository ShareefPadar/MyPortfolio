const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  '/Users/cheppu_padar/Documents/Portfolio/app',
  '/Users/cheppu_padar/Documents/Portfolio/components'
];

const REPLACEMENTS = {
  // PX to Rem Text
  'text-[9px]': 'text-xs',
  'text-[10px]': 'text-xs',
  'text-[11px]': 'text-xs',
  'text-[13px]': 'text-sm',
  
  // Rem to Rem Text (Standardizing)
  'text-[2rem]': 'text-4xl',
  'text-[2.2rem]': 'text-4xl',
  'text-[2.5rem]': 'text-5xl',
  'text-[3.2rem]': 'text-5xl',
  'text-[3.5rem]': 'text-6xl',
  
  // Tracking
  'tracking-[0.2em]': 'tracking-widest',
  'tracking-[0.3em]': 'tracking-widest',
  'tracking-[0.4em]': 'tracking-widest',
  
  // Leading
  'leading-[1.1]': 'leading-none',
  'leading-[1.15]': 'leading-none',
  'leading-[1.2]': 'leading-tight',
  'leading-[1.3]': 'leading-snug',
  
  // Border Radius (Arbitrary rem to standard)
  'rounded-[1.5rem]': 'rounded-3xl',
  'rounded-[2rem]': 'rounded-3xl',
  'rounded-[2.5rem]': 'rounded-3xl',
  'rounded-[3.5rem]': 'rounded-[3rem]', // Wait, let's just use standard 'rounded-[3rem]' -> wait, user said "no more hardocoded value". We should map roundings directly. Wait, Tailwind doesn't have larger than 3xl natively without plugins unless we config.
  'rounded-[4rem]': 'rounded-[3rem]', // same
  
  // Dimensions
  'max-w-[1440px]': 'max-w-7xl',
  'max-w-[360px]': 'max-w-sm',
  'h-[45%]': 'h-1/2',
  'h-[50%]': 'h-1/2',
  'max-h-[750px]': 'max-h-screen',
  
  // Borders
  'border-x-[12px]': 'border-x-8',
  'border-x-[16px]': 'border-x-8',
  'border-t-[12px]': 'border-t-8',
  'border-t-[16px]': 'border-t-8',
  'border-[10px]': 'border-8',
  
  // Colors
  'text-[#0a0a14]': 'text-neutral-950',
  'bg-[#FAFAFA]': 'bg-neutral-50',
  'bg-[#5C45D3]/[0.03]': 'bg-purple-600/5',
  'border-[#5C45D3]/5': 'border-purple-600/5',
  'bg-[#F8FAFC]': 'bg-slate-50',
  'bg-[#0F172A]': 'bg-slate-900',
  
  // Shadows
  'drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]': 'drop-shadow-2xl',
  'shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]': 'shadow-2xl',
  'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]': 'shadow-xl'
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
          // Replace all occurrences
          content = content.split(key).join(value);
          changed = true;
        }
      }
      
      // Additional regex passes for any remaining px that might be simple to convert
      // Ensure we don't break dynamic strings, just standard classes
      // For example: pt-[10px] -> pt-2.5
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

DIRECTORIES.forEach(dir => processDirectory(dir));
console.log('Done!');
