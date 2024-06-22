import puppeteer from "puppeteer";
import * as fs from "fs";

// attempt to scrape bookstore site
const scrapeSomething = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://books.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  const categories = await page.evaluate(() => {
    const categoriesNode = document.querySelectorAll(
      ".nav.nav-list > li > ul > li > a"
    );

    const arr = Array.from(categoriesNode).map((cat) => {
      return cat.textContent.trim();
    });
  });
  console.log(categories);
  browser.close();
};

scrapeSomething();
