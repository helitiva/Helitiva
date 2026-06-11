import puppeteer from 'puppeteer-core';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log("Navigating to http://localhost:3000/ ...");
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log("Page loaded.");
  } catch (err) {
    console.error("Navigation error:", err);
  }

  const content = await page.content();
  console.log("Root element HTML:", await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.innerHTML : 'No #root element found';
  }));

  await browser.close();
}

run().catch(console.error);
