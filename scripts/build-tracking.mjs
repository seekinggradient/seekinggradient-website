#!/usr/bin/env node
/**
 * scripts/build-tracking.mjs
 *
 * Fetches live data for the "What I'm Tracking" page and writes a
 * normalized JSON file to data/tracking.json.  Run before `astro build`
 * (wired into the prebuild npm hook).
 *
 * Data sources:
 *   • Tech stocks (GOOGL, AAPL) — yahoo-finance2 if installed, otherwise placeholder
 *   • Crypto (BTC, ETH) — CoinGecko simple/price (free, no key)
 *   • Hacker News top 5 — official Firebase API
 *   • TechCrunch latest 5 — RSS feed (XML)
 *
 * The script is intentionally dependency-free (Node 18+ built-ins only)
 * with an optional yahoo-finance2 enhancement.
 *
 * Usage:
 *   node scripts/build-tracking.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUTPUT = path.join(DATA_DIR, 'tracking.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fetch JSON with a timeout and basic error handling */
async function fetchJSON(url, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch raw text with a timeout */
async function fetchText(url, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Extract text content between XML tags (simple, robust parser) */
function xmlTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

/** Extract all occurrences of a tag block */
function xmlTagAll(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'g');
  return xml.match(re) || [];
}

/** Decode common HTML entities */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch stock prices for given symbols.
 * Tries yahoo-finance2 first; falls back to placeholders with TODO.
 */
async function fetchStocks(symbols = ['GOOGL', 'AAPL']) {
  // Try yahoo-finance2 (optional dependency)
  try {
    const yf = await import('yahoo-finance2');
    const yahoo = yf.default || yf;
    const results = [];
    for (const symbol of symbols) {
      const quote = await yahoo.quote(symbol);
      results.push({
        symbol,
        price: quote.regularMarketPrice ?? null,
        change: quote.regularMarketChangePercent ?? null,
        currency: quote.currency ?? 'USD',
      });
    }
    console.log(`  ✅ Stocks fetched via yahoo-finance2`);
    return results;
  } catch (_) {
    // yahoo-finance2 not installed — use placeholder data
    // TODO: Install yahoo-finance2 (`npm i yahoo-finance2`) for live stock data,
    //       or integrate an alternative free API (e.g. Alpha Vantage, Finnhub).
    console.log(`  ⚠️  yahoo-finance2 not available — using placeholder stock data`);
    console.log(`     TODO: npm i yahoo-finance2 for live prices`);
    return symbols.map((symbol) => ({
      symbol,
      price: null,
      change: null,
      currency: 'USD',
      placeholder: true, // TODO: Remove once live data is wired up
    }));
  }
}

/**
 * Fetch crypto prices from CoinGecko simple/price endpoint (free, no key).
 */
async function fetchCrypto() {
  try {
    const data = await fetchJSON(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
    );
    const results = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: data.bitcoin?.usd ?? null,
        change24h: data.bitcoin?.usd_24h_change ?? null,
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: data.ethereum?.usd ?? null,
        change24h: data.ethereum?.usd_24h_change ?? null,
      },
    ];
    console.log(`  ✅ Crypto fetched via CoinGecko`);
    return results;
  } catch (err) {
    console.warn(`  ⚠️  CoinGecko fetch failed: ${err.message}`);
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: null, change24h: null, error: true },
      { symbol: 'ETH', name: 'Ethereum', price: null, change24h: null, error: true },
    ];
  }
}

/**
 * Fetch top 5 Hacker News stories via the official Firebase API.
 */
async function fetchHackerNews(count = 5) {
  try {
    const topIds = await fetchJSON('https://hacker-news.firebaseio.com/v0/topstories.json');
    const stories = await Promise.all(
      topIds.slice(0, count).map((id) =>
        fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      )
    );
    const results = stories.map((s) => ({
      title: s.title,
      url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
      points: s.score,
      comments: s.descendants || 0,
      hnUrl: `https://news.ycombinator.com/item?id=${s.id}`,
    }));
    console.log(`  ✅ Hacker News top ${count} fetched`);
    return results;
  } catch (err) {
    console.warn(`  ⚠️  Hacker News fetch failed: ${err.message}`);
    return [];
  }
}

/**
 * Fetch latest 5 TechCrunch items via RSS.
 * Parses XML robustly without any dependency.
 */
async function fetchTechCrunch(count = 5) {
  try {
    const xml = await fetchText('https://techcrunch.com/feed/');
    const items = xmlTagAll(xml, 'item').slice(0, count);
    const results = items.map((item) => ({
      title: decodeEntities(xmlTag(item, 'title')),
      url: decodeEntities(xmlTag(item, 'link')),
      pubDate: xmlTag(item, 'pubDate'),
      creator: decodeEntities(xmlTag(item, 'dc:creator')),
    }));
    console.log(`  ✅ TechCrunch latest ${results.length} fetched via RSS`);
    return results;
  } catch (err) {
    console.warn(`  ⚠️  TechCrunch RSS fetch failed: ${err.message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('📡 Building tracking data…\n');

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const [stocks, crypto, hackerNews, techCrunch] = await Promise.all([
    fetchStocks(),
    fetchCrypto(),
    fetchHackerNews(),
    fetchTechCrunch(),
  ]);

  const tracking = {
    generatedAt: new Date().toISOString(),
    stocks,
    crypto,
    hackerNews,
    techCrunch,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(tracking, null, 2));
  console.log(`\n✅ Wrote ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((err) => {
  console.error('⚠️  build-tracking failed (non-fatal):', err.message);
  // Write a fallback file so the page still renders
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const fallback = {
    generatedAt: new Date().toISOString(),
    stocks: [],
    crypto: [],
    hackerNews: [],
    techCrunch: [],
    error: err.message,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(fallback, null, 2));
  console.log('   Wrote fallback tracking.json so the build can continue.');
});
