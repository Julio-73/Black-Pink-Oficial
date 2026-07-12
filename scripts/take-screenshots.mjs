import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of chromePaths) {
  if (existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error("No Chrome or Edge browser found!");
  process.exit(1);
}

console.log(`Found browser at: ${executablePath}`);

const destDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\60d3cda6-afa4-4838-bdbd-77896dffae77';

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;
      let noChangeCount = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        const currentHeight = document.body.scrollHeight;
        
        if (currentHeight === lastHeight) {
          noChangeCount++;
        } else {
          noChangeCount = 0;
          lastHeight = currentHeight;
        }

        const isBottom = window.innerHeight + window.scrollY >= currentHeight - 10;
        if (isBottom && noChangeCount > 5) {
          clearInterval(timer);
          resolve();
        }
      }, 40);
    });
  });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Desktop screenshot
  await page.setViewport({ width: 1280, height: 800 });
  console.log("Navigating to http://localhost:5173/ (Desktop)...");
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log("Scrolling desktop page to trigger all reveals...");
  await autoScroll(page);
  console.log("Scrolling back to top...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: join(destDir, 'desktop.png'), fullPage: true });
  console.log("Saved desktop.png");
  
  // Mobile screenshot
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  console.log("Navigating to http://localhost:5173/ (Mobile)...");
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log("Scrolling mobile page to trigger all reveals...");
  await autoScroll(page);
  console.log("Scrolling back to top...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: join(destDir, 'mobile.png'), fullPage: true });
  console.log("Saved mobile.png");
  
  await browser.close();
}

run().catch(console.error);
