import axios from "axios";
import {
  always,
  andThen,
  evolve,
  flatten,
  head,
  identity,
  ifElse,
  map,
  match,
  otherwise,
  path,
  pipe,
  project,
  prop,
  propOr,
  tap,
} from "ramda";
import { andThenIfDefined, isNilOrEmpty } from "./fp";
import { Parser } from "xml2js";
import { type Article, type RawFeed } from "../types";
import { toRefinedArticles } from "./articles";

const NEWS_MINIMALIST_NEWSLETTER_URL = "https://newsletter.newsminimalist.com/";
const NEWS_MINIMALIST_NEWSLETTER_RSS_URL_REGEX =
  /(https:\/\/rss\.beehiiv\.com\/feeds\/\S*\.xml)/;

const parser = new Parser();

/**
 * Scrap the RSS URL from the News Minimalist Newsletter website.
 *
 * The promise returned will never be rejected since any error will be caught and logged.
 * Instead, the promise will resolve to undefined.
 */
export const scrapRSSUrl = async (): Promise<string | undefined> => {
  try {
    const { data } = await axios.get(NEWS_MINIMALIST_NEWSLETTER_URL);

    return pipe(
      match(NEWS_MINIMALIST_NEWSLETTER_RSS_URL_REGEX),
      // @ts-expect-error propOr is not typed correctly
      propOr("", 1),
      ifElse(
        isNilOrEmpty,
        pipe(
          tap(() => {
            console.error("RSS URL not found");
          }),
          always(undefined),
        ),
        pipe(
          tap((url) => {
            console.info("RSS URL found", url);
          }),
          identity,
        ),
      ),
    )(data);
  } catch (e) {
    console.error("Error while scrapping for RSS URL", e);
  }
};

const fetchRSSXML: (url: string) => Promise<string | undefined> = pipe(
  axios.get.bind(axios),
  andThen(prop("data")),
);

const fetchRawFeed: () => Promise<RawFeed | undefined> = pipe(
  scrapRSSUrl,
  andThenIfDefined(
    pipe(
      fetchRSSXML,
      andThenIfDefined(
        pipe(
          parser.parseStringPromise.bind(parser),
          andThenIfDefined(
            pipe(
              path(["rss", "channel", 0, "item"]) as (v: unknown) => RawFeed,
              project(["pubDate", "content:encoded"]),
              map(
                evolve({ pubData: head, "content:encoded": head }) as (
                  v: unknown,
                ) => RawFeed,
              ),
            ),
          ),
        ),
      ),
    ),
  ),
  otherwise(tap(console.error.bind(console, "Error while fetching RSS"))),
);

export const fetchArticles: () => Promise<Article[]> = pipe(
  fetchRawFeed,
  andThenIfDefined(pipe(map(toRefinedArticles), flatten)),
  otherwise(
    pipe(
      tap(console.error.bind(console, "Error while fetching articles")),
      always([]),
    ),
  ),
);
