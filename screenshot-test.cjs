const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const pages = [
    { url: 'https://placement.quest', name: 'homepage' },
    { url: 'https://placement.quest/visualizations/geo-map', name: 'geo-map' },
    { url: 'https://placement.quest/momentum-signals', name: 'momentum-signals' },
    { url: 'https://placement.quest/deal-flow', name: 'deal-flow' },
    { url: 'https://placement.quest/ecosystem', name: 'ecosystem' },
  ];

  for (const p of pages) {
    console.log(`Screenshotting ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for animations
    await page.screenshot({ path: `/tmp/${p.name}.png`, fullPage: false });
    console.log(`Saved /tmp/${p.name}.png`);
  }

  await browser.close();
  console.log('Done!');
}

takeScreenshots().catch(console.error);
