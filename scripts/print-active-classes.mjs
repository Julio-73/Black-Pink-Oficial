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

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
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
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log("Scrolling...");
  await autoScroll(page);
  await new Promise(r => setTimeout(r, 2000));
  
  const elementsInfo = await page.evaluate(() => {
    const selector = '.reveal, .reveal-scale, .reveal-glide, .reveal-glide-right, section';
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map(el => {
      return {
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        rect: {
          top: el.getBoundingClientRect().top,
          height: el.getBoundingClientRect().height
        }
      };
    });
  });
  
  console.log("=== REVEAL ELEMENTS STATUS ===");
  elementsInfo.forEach(el => {
    console.log(`${el.tagName}#${el.id || ''}.${el.className.split(' ').join('.')} - height: ${el.rect.height}px, top: ${el.rect.top}px`);
  });
  
  await browser.close();
}

run().catch(console.error);
