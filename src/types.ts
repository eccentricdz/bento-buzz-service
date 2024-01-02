export interface RawArticles {
  pubDate: string;
  "content:encoded": string;
}

export type RawFeed = RawArticles[];

export interface Article {
  title: string;
  score: number;
  content: string;
  link: string;
  pubDate: Date;
  source?: string;
}
