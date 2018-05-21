const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://www.wegottickets.com/');
  await page.click('#adv_genre');
  await page.select('select#adv_genre', '11');
  await page.click('#adv_search')
  await page.waitFor(3000);

  const result = await page.evaluate(() => {
    let scrapedEvents = {};
    let data = [];
    let element, artist, venue, date, detailedPrice, finalPound, price;

    let elements = document.querySelectorAll('div.content.block-group.chatterbox-margin')

    elements.forEach((element) => {
      artist = element.childNodes[1].innerText;
      venue = element.childNodes[3].childNodes[3].children[0].innerHTML;
      date = element.childNodes[3].childNodes[3].children[1].innerHTML;
      detailedPrice = element.childNodes[5].childNodes[1].innerText;
      finalPound = detailedPrice.lastIndexOf("£");
      price = detailedPrice.slice(finalPound, detailedPrice.length);

      data.push({
        'artist': artist,
        'venue': venue,
        'date': date,
        'price': price
      });
    })

    scrapedEvents['data'] = data
    return JSON.stringify(scrapedEvents);
  })

browser.close();
return result;
};

scrape().then((value) => {
  console.log(value); // Success!
});
