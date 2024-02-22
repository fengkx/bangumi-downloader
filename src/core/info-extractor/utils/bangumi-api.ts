import ky from "npm:ky";
const client = ky.create({
  headers: {
    accept: "application/json",
    "user-agent":
      "Bangumi Downloader (https://github.com/fengkx/bangumi-downloader)",
  },
  prefixUrl: "https://api.bgm.tv/v0/",
});

type BangumiTvSubject = {
  "name": string;
  "name_cn": string;
  type: number;
};

const privateCache = new Map<number, BangumiTvSubject>();

export const getSubjectById = async (id: number) => {
  let e = privateCache.get(id);
  if (!e) {
    e = await client.get(`subjects/${id}`).json() as BangumiTvSubject;
    privateCache.set(id, e);
  }

  return e;
};
