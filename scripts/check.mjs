import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const packagesDir = new URL('../packages/', import.meta.url);
let failed = false;

function fail(message) {
  failed = true;
  console.error(`FAIL: ${message}`);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label}: ${error.message}`);
    return undefined;
  }
}

const entries = await readdir(packagesDir, { withFileTypes: true });
for (const entry of entries.filter((item) => item.isDirectory())) {
  const dir = new URL(`${entry.name}/`, packagesDir);
  const pkg = parseJson(await readFile(new URL('package.json', dir), 'utf8'), `${entry.name}/package.json`);
  if (!pkg) continue;
  console.log(`Checking ${pkg.name}@${pkg.version}`);
  if (pkg.private === true) fail(`${pkg.name}: private must not be true`);
  if (!pkg.dsh?.bundle?.patch) fail(`${pkg.name}: missing dsh.bundle.patch`);
  if (!pkg.dsh?.client) fail(`${pkg.name}: missing dsh.client`);
  for (const key of ['.', './client', './icon']) {
    const target = pkg.exports?.[key];
    if (typeof target !== 'string') fail(`${pkg.name}: missing export ${key}`);
  }
  for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'README.md', 'LICENSE']) {
    try {
      await readFile(new URL(file, dir));
    } catch {
      fail(`${pkg.name}: missing ${file}`);
    }
  }
  for (const file of ['locale/en.json', 'locale/zh.json']) {
    const metadata = parseJson(await readFile(new URL(file, dir), 'utf8'), `${pkg.name}/${file}`);
    if (!metadata?.meta?.title || !metadata?.meta?.description) fail(`${pkg.name}/${file}: incomplete metadata`);
  }
  const svg = await readFile(new URL('icon.svg', dir), 'utf8');
  if (!svg.includes('<svg') || !svg.includes('</svg>')) fail(`${pkg.name}: invalid icon.svg`);
  for (const file of ['index.js', 'client.js']) {
    const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, dir))], { encoding: 'utf8' });
    if (result.status !== 0) fail(`${pkg.name}/${file}: ${result.stderr || result.stdout}`);
  }
}

console.log(`Repository root: ${root.pathname}`);
if (failed) process.exit(1);
console.log('All checks passed.');