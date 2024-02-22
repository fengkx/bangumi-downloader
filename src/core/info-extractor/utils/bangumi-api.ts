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
export const getSubjectById = async (id: number) => {
  const resp = await client.get(`subjects/${id}`).json() as BangumiTvSubject;
  return resp;
};
