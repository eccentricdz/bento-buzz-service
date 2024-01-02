import { type Article, type RawArticles } from "../types";
import { assoc, map, pipe } from "ramda";

export const collectArticles = (
  encodedContent: string,
): Array<Omit<Article, "pubDate" | "source">> => {
  const articleRegex =
    /<b>\[(?<score>\d\.\d)] (?<title>.*?) — <\/b>.*?<a.*?href=.*?"(?<link>http.*?)".*?<p.*?>(?<content>.*?)<\/p>/gm;
  const matches = encodedContent.matchAll(articleRegex);
  const articles: Array<Omit<Article, "pubDate" | "source">> = [];

  let nextMatch = matches.next();
  while (nextMatch.done === false) {
    const {
      groups: { score, title, link, content },
    } = nextMatch.value as unknown as {
      groups: { score: string; title: string; link: string; content: string };
    };
    articles.push({ score: Number(score), title, link, content });
    nextMatch = matches.next();
  }

  return articles;
};

export const deriveSource = (link: string): string | undefined => {
  const sourceRegex = /https+:\/\/(?:www.)?(?<source>.*?)\..*(?:\/.*)*/;
  const match = link.match(sourceRegex);
  if (match === null) {
    console.error(`Unable to derive source from link: ${link}`);
  }
  return match?.groups?.source;
};

export const toRefinedArticles = ({
  pubDate,
  "content:encoded": encodedContent,
}: RawArticles): Article[] =>
  pipe(
    collectArticles,
    map(assoc("pubDate", new Date(pubDate))),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    map(({ link, ...rest }) => ({ link, ...rest, source: deriveSource(link) })),
  )(encodedContent) as Article[];
