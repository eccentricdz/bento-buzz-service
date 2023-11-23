import axios from "axios";
import { scrapRSSUrl } from "../data";

jest.mock("axios");
const consoleInfoSpy = jest.spyOn(console, "info");
const consoleErrorSpy = jest.spyOn(console, "error");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("scrapRSSUrl", () => {
  it("should return the RSS url if present", async () => {
    const expected = "https://rss.beehiiv.com/feeds/abc.xml";
    const data: string = `
            <html>
                <head>
                    <link rel="alternate" type="application/rss+xml" title="RSS" href="${expected}">
                </head>
            </html>
        `;

    mockedAxios.get.mockResolvedValue({ data });
    const rssUrl = await scrapRSSUrl();
    expect(rssUrl).toEqual(expected);
    expect(consoleInfoSpy).toHaveBeenCalledWith("RSS URL found", expected);
  });

  it("should return undefined if no RSS url is present", async () => {
    const data: string = `
            <html>
                <head>
                </head>
            </html>
        `;

    mockedAxios.get.mockResolvedValue({ data });
    const rssUrl = await scrapRSSUrl();
    expect(rssUrl).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith("RSS URL not found");
  });

  it("should log any error thrown", async () => {
    expect.assertions(3);
    const error = new Error("Disaster");
    mockedAxios.get.mockRejectedValue(error);
    expect(async () => await scrapRSSUrl()).not.toThrow();
    await expect(scrapRSSUrl()).resolves.toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error while scrapping for RSS URL",
      error,
    );
  });
});
