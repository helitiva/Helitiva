import puppeteer from 'puppeteer-core'

const URL = 'http://localhost:3457/'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  })
  const page = await browser.newPage()

  const logs = []
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err}`))
  page.on('requestfailed', (req) => logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`))

  // Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 20000 })
  await new Promise((r) => setTimeout(r, 2500))
  await page.screenshot({ path: '/tmp/helitiva-desktop-hero.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25))
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: '/tmp/helitiva-desktop-25.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5))
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: '/tmp/helitiva-desktop-50.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72))
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: '/tmp/helitiva-desktop-72.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: '/tmp/helitiva-desktop-bottom.png' })

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 20000 })
  await new Promise((r) => setTimeout(r, 2000))
  await page.screenshot({ path: '/tmp/helitiva-mobile-hero.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45))
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: '/tmp/helitiva-mobile-mid.png' })

  console.log('--- console/log output ---')
  console.log(logs.join('\n') || '(clean, no console messages)')
  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
