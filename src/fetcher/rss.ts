import { parseFeed as rss } from "https://deno.land/x/rss@1.0.0/mod.ts";
import ky from "npm:ky";

const AcceptHeader =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 ";

const client = ky.create({
  headers: {
    accept: AcceptHeader,
    "user-agent": "BangumiDownloader",
  },
});

export async function parseFeed(feedUrl: string) {
  const text = await client.get(feedUrl).text();
  const r = await rss(text);
  return r;
}
