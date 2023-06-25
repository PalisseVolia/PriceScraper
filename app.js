// Imports
const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const { get } = require("http");

// Variables
const app = express();
const port = 3000;

// ====================
// TODO: sort and finish

// TEMP: ETAPE 3 fonctions générales c'est le bordel
app.get("/", async (req, res) => {
    // get data
    const DATA = await MainWebScraperExperimental();
    console.log(DATA);
    // write data to json file
    WriteAllData(DATA, "data.json");
    // set variables
    const { date, product, price } = { date: DATA[0].O_date, product: DATA[0].O_product, price: DATA[0].O_price };

    // render html
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

// TEMP: ETAPE 2 ajout des produits au fichier json
app.post("/addProduct", (req, res) => {
    const product = req.body;
    WriteNewProduct(product, "rawData.json");
    res.sendStatus(200);
});

// ====================
// Web scrapers
// ====================

// Main web scraper
// TEMP: ETAPE 4 web scraper / récupération des donneés
async function MainWebScraperExperimental() {
    let I_url = "";
    let I_product = "";
    let DATA = [];

    // launch browser
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // read json file with products
    const jsonDataArray = JSON.parse(fs.readFileSync("rawData.json", "utf8"));

    // for each product in json file
    for (let i = 0; i < jsonDataArray.length; i++) {
        I_url = jsonDataArray[i].url;
        I_product = jsonDataArray[i].name;

        // depending on the marketplace
        if (I_url.includes("amazon")) {
            // scrape data
            await page.goto(I_url, { waitUntil: "domcontentloaded" }, { timeout: 60000 }); // Set timeout to 60 seconds
            var price = await page.waitForSelector(".a-price-whole");
            var priceText = await page.evaluate((price) => price.textContent, price);

            // create object & add to array
            let data2 = {
                O_date: getDate(),
                O_product: I_product,
                O_price: priceText,
                O_url: I_url,
            };
            DATA.push(data2);
        }
        if (I_url.includes("cdiscount")) {
        }
        if (I_url.includes("google")) {
        }
    }

    browser.close();

    // return array with all data
    return DATA;
}

// ====================
// File handling
// ====================

// Write all data to a file
function WriteAllData(data, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
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
