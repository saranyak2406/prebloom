const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'dist');
const destDir = path.join(__dirname, 'dist');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('✅ Successfully copied client/dist to root dist/ for Vercel deployment!');
} else {
  console.warn('⚠️ client/dist does not exist yet.');
}
