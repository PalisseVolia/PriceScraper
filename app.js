const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
    const data = await webScraper("https://www.amazon.fr/Pilot-Hi-Tecpoint-stylos-bille-Pointe/dp/B00LXAOICW?pd_rd_w=PzeqQ&content-id=amzn1.sym.8f917f30-0e7e-4c71-8b5f-1e2cdeb046b8&pf_rd_p=8f917f30-0e7e-4c71-8b5f-1e2cdeb046b8&pf_rd_r=VZW1K9CVH38CPMEQA85M&pd_rd_wg=rljYz&pd_rd_r=0dd1c8be-5ddb-435f-af6e-e03bd39afa35&pd_rd_i=B00LXAOICW&psc=1&ref_=pd_bap_d_grid_rp_0_1_ec_i");
    const { date, product, price } = data;

    const html = await ejs.renderFile(path.join(__dirname, "index.ejs"), { date, product, price });

    res.send(html);
});

app.use(express.static(path.join(__dirname, "/")));

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
