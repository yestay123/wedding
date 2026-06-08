const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  try {
    await page.waitForSelector('.intro__button:not([disabled])', { timeout: 15000 })
    await page.keyboard.press('Enter')
  } catch (e) {
    console.log('intro skip failed:', e.message)
  }
  await page.waitForSelector('.inv__env-img', { timeout: 15000 })
  await page.waitForTimeout(1200)
  await page.locator('.inv').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.locator('.inv').screenshot({ path: 'shot-inv.png' })
  console.log('done')
  await browser.close()
})()
