import puppeteer from 'puppeteer';
import { links } from './newegg_links.js';
import fetch from 'node-fetch';




async function run() {
    const url = 'https://maker.ifttt.com/trigger/notify/with/key/KViZKf99lRE8HAqw2MlAw'
    const browser = await puppeteer.launch({headless: true,
                                    defaultViewport: { width: 1366, height: 768 }
                                    });
    const page = await browser.newPage();
    let loop_number = links.length;
    let current = true

    while(current) {
        for (let x = 0; x < loop_number; x++) {
            await page.goto(links[x].url)
            console.log(`Trying model: ${links[x].brand} - ${links[x].model}`)
            await page.waitForSelector('#ProductBuy', {timeout: 5000})
            const page_status = await page.evaluate(() => {
                return document.querySelector("#ProductBuy").innerText.includes("ADD TO CART");
            })
            if(page_status == true) {
                console.log('FOUND ONE')
                let notif_data = {
                    "value1": `${links[x].brand} - ${links[x].model} is IN STOCK: ${links[x].cartUrl}`
                }
                const options = {
                    method: 'POST',
                    body: JSON.stringify(notif_data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                fetch(url, options);
                console.log('Notification has been sent!');
                current = false;
                break;
            }
        else {
            console.log(`${links[x].brand} - ${links[x].model} is OOS`)
            };
            if (x == (loop_number - 1)){
                x = -1;
            }
        }
    }
};
run();