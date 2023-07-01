// Imports
const express = require("express");
const puppeteer = require("puppeteer");
const { createPool } = require("generic-pool");
const fs = require("fs");

const app = express();

app.get("/api", async (req, res) => {
    console.time("MainWebScraperExperimental");
    const DATA = await MainWebScraperExperimental();
    console.timeEnd("MainWebScraperExperimental");
    res.json({ users: [DATA[0].O_price, "userTwo", "userThree"] });
});

app.listen(5000, () => console.log("Server running on port 5000"));

function getDate() {
    let date = new Date();
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return fullDate;
}

// ====================
// Web scrapers
// ====================

async function scrapeProductData(browser, url, product) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Scrape data
    const priceElement = await page.waitForSelector(".a-price-whole");
    const priceText = await page.evaluate((el) => el.textContent, priceElement);

    page.close();

    return {
        O_date: getDate(),
        O_product: product,
        O_price: priceText,
        O_url: url,
    };
}

async function MainWebScraperExperimental() {
    const jsonDataArray = JSON.parse(fs.readFileSync("rawData.json", "utf8"));

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--blink-settings=imagesEnabled=false"],
    });

    // Limit the number of concurrent requests to 5
    const maxConcurrentRequests = 5;
    const dataPromises = [];

    for (let i = 0; i < jsonDataArray.length; i++) {
        const { url, name } = jsonDataArray[i];

        // Scrape each product and store the promise in an array
        dataPromises.push(scrapeProductData(browser, url, name));

        // Limit concurrent requests based on the maximum allowed
        if (dataPromises.length >= maxConcurrentRequests) {
            await Promise.all(dataPromises);
            dataPromises.length = 0; // Clear the array
        }
    }

    // Wait for the remaining promises to resolve
    const scrapedData = await Promise.all(dataPromises);

    await browser.close();

    return scrapedData;
}

// // Main web scraper
// async function MainWebScraperExperimental() {
//     let I_url = "";
//     let I_product = "";
//     let DATA = [];

//     // launch browser
//     const browser = await puppeteer.launch({
//         headless: "new", // Run Puppeteer in headless mode
//         args: ["--blink-settings=imagesEnabled=false"], // Disable image loading
//     });
//     const page = await browser.newPage();

//     // read json file with products
//     const jsonDataArray = JSON.parse(fs.readFileSync("rawData.json", "utf8"));

//     // for each product in json file
//     for (let i = 0; i < jsonDataArray.length; i++) {
//         I_url = jsonDataArray[i].url;
//         I_product = jsonDataArray[i].name;

//         // depending on the marketplace
//         if (I_url.includes("amazon")) {
//             // scrape data
//             await page.goto(I_url, { waitUntil: "domcontentloaded" }, { timeout: 60000 }); // Set timeout to 60 seconds
//             var price = await page.waitForSelector(".a-price-whole");
//             var priceText = await page.evaluate((price) => price.textContent, price);

//             // create object & add to array
//             let data2 = {
//                 O_date: getDate(),
//                 O_product: I_product,
//                 O_price: priceText,
//                 O_url: I_url,
//             };
//             DATA.push(data2);
//         }
//         if (I_url.includes("cdiscount")) {
//         }
//         if (I_url.includes("google")) {
//         }
//     }

//     browser.close();

//     // return array with all data
//     return DATA;
// }
