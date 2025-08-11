const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

function loadDotenv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^(?:export\s+)?([^=#\s]+)=(.*)$/);
    if (!m) return;
    let val = m[2] || '';
    if (val.startsWith('\"') && val.endsWith('\"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[m[1]] = val;
  });
}

loadDotenv();
