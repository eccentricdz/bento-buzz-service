import { collectArticles, toRefinedArticles } from "../articles";

const encodedContent =
  '\n    <div class=\'beehiiv\'><div class=\'beehiiv__body\'><p class="paragraph" style="text-align:left;">Today ChatGPT read 1297 top news stories. After removing previously covered events, there are 2 articles with a <a class="link" href="https://www.newsminimalist.com/faq" target="_blank" rel="noopener noreferrer nofollow">significance score</a> over 7.</p><div class="image"><img alt="" class="image__image" style="" src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/e8a85c20-2b98-4f00-a00f-a3ca44d2c45f/image.png"/></div><p class="paragraph" style="text-align:start;"><b>[7.2] IMF says central bank digital currencies can replace cash — </b><a class="link" href="https://www.cnbc.com/2023/11/15/imf-says-central-bank-digital-currencies-can-replace-cash.html" target="_blank" rel="noopener noreferrer nofollow"><b>CNBC</b></a></p><p class="paragraph" style="text-align:start;">Kristalina Georgieva, managing director of the IMF, stated that central bank digital currencies (CBDCs) have the potential to replace cash, offering resilience and improving financial inclusion. Over 100 countries are exploring CBDCs, with 11 already adopting them, and 53 in advanced planning stages.</p><p class="paragraph" style="text-align:start;"><b>[7.1] Chinese companies bypassing US export curbs for chipmaking — </b><b><a class="link" href="https://www.reuters.com/technology/china-receives-us-equipment-make-advanced-chips-despite-new-rules-report-2023-11-14/" target="_blank" rel="noopener noreferrer nofollow">Reuters</a></b></p><p class="paragraph" style="text-align:start;">Chinese companies are circumventing U.S. export curbs to acquire advanced chipmaking equipment, as per a congressional report. The report criticizes the effectiveness of the Biden administration&#39;s restrictions and highlights loopholes allowing imports. Despite efforts to restrict exports, China imported $3.2 billion worth of semiconductor manufacturing machines from the Netherlands in 2023, a 96.1% increase from 2022.</p><p class="paragraph" style="text-align:start;"><b>Want to read more?</b></p><p class="paragraph" style="text-align:start;">See additional news on <a class="link" href="https://www.newsminimalist.com" target="_blank" rel="noopener noreferrer nofollow">newsminimalist.com</a>.</p><hr class="content_break"><p class="paragraph" style="text-align:start;">Thanks for reading us and see you tomorrow,</p><p class="paragraph" style="text-align:start;">Vadim</p></div><div class=\'beehiiv__footer\'><br class=\'beehiiv__footer__break\'><hr class=\'beehiiv__footer__line\'><a target="_blank" class="beehiiv__footer_link" style="text-align: center;" href="https://www.beehiiv.com/?utm_campaign=a3756d4d-0036-4fff-b292-d648ef8a99f6&amp;utm_medium=post_rss&amp;utm_source=news_minimalist_daily">Powered by beehiiv</a></div></div>\n  ';

describe("collectArticles", () => {
  it("should collect all relevant articles from encoded content", () => {
    const articles = collectArticles(encodedContent);
    expect(articles).toEqual([
      {
        score: 7.2,
        title: "IMF says central bank digital currencies can replace cash",
        link: "https://www.cnbc.com/2023/11/15/imf-says-central-bank-digital-currencies-can-replace-cash.html",
        content:
          "Kristalina Georgieva, managing director of the IMF, stated that central bank digital currencies (CBDCs) have the potential to replace cash, offering resilience and improving financial inclusion. Over 100 countries are exploring CBDCs, with 11 already adopting them, and 53 in advanced planning stages.",
      },
      {
        score: 7.1,
        title: "Chinese companies bypassing US export curbs for chipmaking",
        link: "https://www.reuters.com/technology/china-receives-us-equipment-make-advanced-chips-despite-new-rules-report-2023-11-14/",
        content:
          "Chinese companies are circumventing U.S. export curbs to acquire advanced chipmaking equipment, as per a congressional report. The report criticizes the effectiveness of the Biden administration&#39;s restrictions and highlights loopholes allowing imports. Despite efforts to restrict exports, China imported $3.2 billion worth of semiconductor manufacturing machines from the Netherlands in 2023, a 96.1% increase from 2022.",
      },
    ]);
  });

  it("should return an empty array when no relevant articles are found", () => {
    expect(collectArticles("ABCD")).toEqual([]);
  });
});

describe("toRefinedArticles", () => {
  it("should return an array of articles with pubDate", () => {
    const articles = toRefinedArticles({
      "content:encoded": encodedContent,
      pubDate: "Wed, 15 Nov 2023 16:27:37 +0000",
    });
    expect(articles).toMatchInlineSnapshot(`
[
  {
    "content": "Kristalina Georgieva, managing director of the IMF, stated that central bank digital currencies (CBDCs) have the potential to replace cash, offering resilience and improving financial inclusion. Over 100 countries are exploring CBDCs, with 11 already adopting them, and 53 in advanced planning stages.",
    "link": "https://www.cnbc.com/2023/11/15/imf-says-central-bank-digital-currencies-can-replace-cash.html",
    "pubDate": 2023-11-15T16:27:37.000Z,
    "score": 7.2,
    "title": "IMF says central bank digital currencies can replace cash",
  },
  {
    "content": "Chinese companies are circumventing U.S. export curbs to acquire advanced chipmaking equipment, as per a congressional report. The report criticizes the effectiveness of the Biden administration&#39;s restrictions and highlights loopholes allowing imports. Despite efforts to restrict exports, China imported $3.2 billion worth of semiconductor manufacturing machines from the Netherlands in 2023, a 96.1% increase from 2022.",
    "link": "https://www.reuters.com/technology/china-receives-us-equipment-make-advanced-chips-despite-new-rules-report-2023-11-14/",
    "pubDate": 2023-11-15T16:27:37.000Z,
    "score": 7.1,
    "title": "Chinese companies bypassing US export curbs for chipmaking",
  },
]
`);
  });
});
