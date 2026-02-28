const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message}));

  try {
    await page.goto('http://localhost:3000/image-activity', { waitUntil: 'networkidle2', timeout: 15000 });

    await page.waitForSelector('#generateBtn', {timeout: 5000});
    await page.click('#generateBtn');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    await new Promise(r => setTimeout(r, 1000));

    const contentExists = await page.evaluate(() => {
      const el = document.getElementById('activityContent');
      return el ? el.innerText.trim().length > 0 : false;
    });

    const excerpt = await page.evaluate(() => {
      const el = document.getElementById('activityContent');
      return el ? el.innerText.substring(0, 2000) : '';
    });

    console.log('CONTENT_EXISTS:', contentExists);
    console.log('CONSOLE_LOGS:', JSON.stringify(logs, null, 2));
    console.log('EXCERPT:', excerpt);

    await browser.close();
  } catch (e) {
    console.error('TEST ERROR:', e && e.message ? e.message : e);
    try { await browser.close(); } catch {}
    process.exit(1);
  }
})();