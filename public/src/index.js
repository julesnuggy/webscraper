const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
        width: 1280,
        height: 800
    });
  await page.goto('http://www.wegottickets.com/');
  await page.click('#adv_genre');
  await page.select('select#adv_genre', '11');
  await page.click('#adv_search')
  await page.waitFor(3000);

  const result = await page.evaluate(() => {
    let scrapedEvents = {};
    let data = [];
    let element, artist, venue;

    let elements = document.querySelectorAll('div.content.block-group.chatterbox-margin')

    elements.forEach((element) => {
      artist = element.childNodes[1].innerText;
      venue = element.childNodes[3].childNodes[3].children[0].innerHTML;

      data.push({
        'artist': artist,
        'venue': venue
      });
    })

    scrapedEvents['data'] = data
    return scrapedEvents;
  })

browser.close();
return result;
};

scrape().then((value) => {
  console.log(value); // Success!
});
