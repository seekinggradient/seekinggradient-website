import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const TRACKING_FILE = path.join(DATA_DIR, 'tracking.json');

async function main() {
    if (!fs.existsSync(TRACKING_FILE)) {
        console.error('tracking.json not found');
        return;
    }

    const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    
    // Construct a compact prompt for the agent to analyze the data
    const summary = {
        stocks: data.stocks.map(s => `${s.symbol}: ${s.price} (${s.change}%)`),
        crypto: data.crypto.map(c => `${c.symbol}: ${c.price} (${c.change24h}%)`),
        hn: data.hackerNews.map(h => h.title),
        tc: data.techCrunch.map(t => t.title)
    };

    const prompt = `Analyze this market and tech news snapshot for Seeking Gradient. 
Provide a "Quick Take": 2-3 sentences of commentary on the current market sentiment and most interesting tech trend from these headlines. 
Keep it insightful, professional, and concise.

DATA:
${JSON.stringify(summary, null, 2)}

Format: Just the plain text commentary.`;

    // Note: In this script context, we expect the agent to fill this in or a subagent to provide it.
    // For now, this is a placeholder script that the main agent or subagent will "invoke" by 
    // generating the text and then writing it back to the data file.
    console.log('SENTIMENT_PROMPT_START');
    console.log(prompt);
    console.log('SENTIMENT_PROMPT_END');
}

main();
