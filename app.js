// Imports
const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

// Variables
const app = express();
const port = 3000;

// ====================
// TODO: sort and finish

app.get("/", async (req, res) => {
    const data = await MainWebScraper("https://www.amazon.fr/Pilot-Hi-Tecpoint-stylos-bille-Pointe/dp/B00LXAOICW?pd_rd_w=PzeqQ&content-id=amzn1.sym.8f917f30-0e7e-4c71-8b5f-1e2cdeb046b8&pf_rd_p=8f917f30-0e7e-4c71-8b5f-1e2cdeb046b8&pf_rd_r=VZW1K9CVH38CPMEQA85M&pd_rd_wg=rljYz&pd_rd_r=0dd1c8be-5ddb-435f-af6e-e03bd39afa35&pd_rd_i=B00LXAOICW&psc=1&ref_=pd_bap_d_grid_rp_0_1_ec_i");
    const { date, product, price } = data;

    const DATA = await MainWebScraperExperimental();
    console.log(DATA[0].product);

    const html = await ejs.renderFile(path.join(__dirname, "index.ejs"), { date, product, price });

    res.send(html);
});

app.use(express.static(path.join(__dirname, "/")));
app.use(express.static("public"));
app.use(express.json());

function getDate() {
    let date = new Date();
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return fullDate;
}

app.post("/addProduct", (req, res) => {
    const product = req.body;
    WriteNewProduct(product, "rawData.json");
    res.sendStatus(200);
});

// ====================
// Web scrapers
// ====================

// TODO: experimental, finish
async function MainWebScraperExperimental() {
    let I_url = "";
    let I_product = "";
    let DATA = [];

    const jsonDataArray = JSON.parse(fs.readFileSync("rawData.json", "utf8"));

    for (let i = 0; i < jsonDataArray.length; i++) {
        I_url = jsonDataArray[i].url;
        I_product = jsonDataArray[i].name;

        if (I_url.includes("amazon")) {
            let data1 = await AmazonWebScraper(I_url);
            let data2 = {
                date: data1.date,
                product: I_product,
                price: data1.price,
                url: I_url,
            };
            DATA.push(data2);
        }
    }
    return DATA;
}

// TODO: all below temporary, will be removed later
// Main web scraper
async function MainWebScraper(url) {
    if (url.includes("amazon")) {
        return await AmazonWebScraper(url);
    }
    if (url.includes("cdiscount")) {
        return await CdiscountWebScraper(url);
    }
    if (url.includes("google")) {
        return await GoogleWebScraper(url);
    }
}

// Amazon web scraper
async function AmazonWebScraper(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" }, { timeout: 60000 }); // Set timeout to 60 seconds
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

// Cdiscount web scraper TODO: integrate cdiscount
async function CdiscountWebScraper(url) {}

// Google web scraper TODO: integrate google
async function GoogleWebScraper(url) {}

// ====================
// File handling
// ====================

// Write data to file TODO: Old, remove
function writeDataToFile(data) {
    const jsonData = JSON.stringify(data);
    fs.writeFile("data.json", jsonData, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Data written to data.json");
    });
}

// Add a product to rawData.json
function WriteNewProduct(data, filePath) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read the existing data
    jsonData.push(data); // Add new data to JSON object
    const jsonDataString = JSON.stringify(jsonData, null, 2); // Convert back to JSON string with indentation
    fs.writeFileSync(filePath, jsonDataString, "utf8"); // Write updated JSON data to file
}

// ====================
// Local server
// ====================

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
