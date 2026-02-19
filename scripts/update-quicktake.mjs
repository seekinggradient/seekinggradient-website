import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const TRACKING_FILE = path.join(DATA_DIR, 'tracking.json');

const newCommentary = process.argv[2];

if (!newCommentary) {
    console.error('Usage: node update-quicktake.mjs "Your commentary here"');
    process.exit(1);
}

if (!fs.existsSync(TRACKING_FILE)) {
    console.error('tracking.json not found');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
data.quickTake = newCommentary;
fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
console.log('✅ Updated quickTake in tracking.json');
