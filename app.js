const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
    const data = await webScraper("https://www.amazon.fr/SABRENT-Interne-Performance-extr%C3%AAme-SB-RKT4P-8TB/dp/B09WZK8YMY/ref=pd_ci_mcx_mh_mcx_views_0?pd_rd_w=8CwaL&content-id=amzn1.sym.5ff22ff7-b8e2-443a-8dfb-67b22e8a7de3&pf_rd_p=5ff22ff7-b8e2-443a-8dfb-67b22e8a7de3&pf_rd_r=84JHMTC3PH07TA4MVWPP&pd_rd_wg=q8eUl&pd_rd_r=2072cddf-32a7-4fd1-bdb9-ea28c4319af7&pd_rd_i=B09WZK8YMY");
    res.send(data);
});

async function webScraper(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60000 }); // Set timeout to 60 seconds
    var product = await page.waitForSelector("#productTitle");
    var productText = await page.evaluate((product) => product.textContent, product);
    var price = await page.waitForSelector(".a-price-whole");
    var priceText = await page.evaluate((price) => price.textContent, price);

    const data = {
        date: getDate(),
        product: productText,
        price: priceText,
    };

    browser.close();

    return data;
}

function getDate() {
    let date = new Date();
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return fullDate;
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
