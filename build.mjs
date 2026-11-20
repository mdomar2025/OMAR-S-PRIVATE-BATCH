import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');

const url = process.env.VITE_SUPABASE_URL || 'https://hxkfuatjenittwhgobzy.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || 'sb_publishable_wo9hBOl3sszigds9Y_0wUw_GKznymVw';

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
  throw new Error('VITE_SUPABASE_URL is not a valid Supabase project URL.');
}
if (!/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9._-]+)$/.test(key)) {
  throw new Error('Use only the Supabase publishable/anon public key. Never use a service_role or sb_secret key.');
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(
  /const SB_URL='[^']*',SB_KEY='[^']*';/,
  `const SB_URL=${JSON.stringify(url)},SB_KEY=${JSON.stringify(key)};`
);
fs.writeFileSync(path.join(out, 'index.html'), html);

for (const file of ['plus.js', 'plus2.js', 'manifest.json', 'sw.js', 'logo.jpg', 'icon-192.png', 'icon-512.png', 'diag.html']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
console.log(`Built static OMAR'S PRIVATE BATCH app into dist/`);
