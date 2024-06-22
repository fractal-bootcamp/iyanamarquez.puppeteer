import puppeteer from "puppeteer";
import * as fs from "fs";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  const quotes = async () => {
    // Inside page.evaluate(), directly return the data you need
    return await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");

      // Convert NodeList to Array and map each quote to extract text and author
      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText.trim();
        const author = quote.querySelector(".author").innerText.trim();
        return { text, author };
      });
    });
  };

  const selector = ".pager .next > a";
  const allQuotes = [];
  let counter = 0;
  let hasNextPage = true;

  while (hasNextPage) {
    console.log(selector);
    counter += 1;
    console.log(counter);

    await page.waitForSelector(selector);
    console.log("selector found");
    const bruh = await quotes();
    fs.writeFileSync("quotes.json", JSON.stringify(bruh, null, 2), {
      flag: "a",
    });

    console.log("getting quotes");
    allQuotes.push(bruh);

    hasNextPage = await page.evaluate(
      () => !!document.querySelector(".pager .next > a")
    );
  }
  return allQuotes;
};

// Start the scraping
getQuotes();
