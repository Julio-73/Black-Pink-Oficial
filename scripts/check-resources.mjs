import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of chromePaths) {
  if (existsSync(p)) {
    executablePath = p;
    break;
  }
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      console.log(`[HTTP ERROR ${status}] ${url}`);
    } else {
      // Log successful local files for verification
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        console.log(`[HTTP ${status}] ${url}`);
      }
    }
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER EXCEPTION] ${err.message}`);
  });

  console.log("Navigating to http://localhost:5173/...");
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
}

run().catch(console.error);
