// Imports
const express = require("express");
const puppeteer = require("puppeteer");
const { createPool } = require("generic-pool");
const fs = require("fs");

const app = express();

// ====================
// APIs
// ====================

app.get("/api", async (req, res) => {
    console.time("MainWebScraperExperimental");
    const DATA = await MainWebScraperExperimental();
    console.timeEnd("MainWebScraperExperimental");
    res.json({ users: [DATA[0].O_price, "userTwo", "userThree"] });
});

app.listen(5000, () => console.log("Server running on port 5000"));

// ====================
// Web scrapers
// ====================

async function scrapeProductData(browser, url, product) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Scrape data
    const priceElement = await page.waitForSelector(".a-price-whole");
    const priceText = await page.evaluate((el) => el.textContent, priceElement);

    await page.close();

    // Return an object with the data
    return {
        O_date: getDate(),
        O_product: product,
        O_price: priceText,
        O_url: url,
    };
}

async function MainWebScraperExperimental() {
    // TODO: replace with a database
    const jsonDataArray = JSON.parse(fs.readFileSync("rawData.json", "utf8"));

    const browserPool = createPool({
        create: async () => {
            return puppeteer.launch({
                headless: "new",
                args: ["--blink-settings=imagesEnabled=false"],
            });
        },
        destroy: async (browser) => {
            await browser.close();
        },
    });

    // choose how many concurrent browsers should be open at once (max 8)
    const maxConcurrentRequests = 8;
    const dataPromises = [];
    let j = 0;

    for (let i = 0; i < jsonDataArray.length; i++) {
        const { url, name } = jsonDataArray[i];

        // Acquire a browser instance from the pool
        const browser = await browserPool.acquire();

        // Scrape each product and store the promise in an array
        dataPromises.push(scrapeProductData(browser, url, name));

        // counter
        j += 1;

        // Release the browser instance back to the pool
        if (j >= maxConcurrentRequests) {
            await Promise.all(dataPromises); // Wait for the promises to resolve
            j = 0;
        }
        browserPool.release(browser);
    }

    // Wait for the remaining promises to resolve
    const scrapedData = await Promise.all(dataPromises);
    await browserPool.clear();

    return scrapedData;
}

// ====================
// Utilities
// ====================

// Get the current date and time
function getDate() {
    let date = new Date();
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return fullDate;
}
