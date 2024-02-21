## Bangumi Downloader
Download bangumi to cloud drive support offline download in GitHub actions.

For now only pikpak is supported.

## Usage
### Pre requirements

1. Fork this repo. delete the `data/db.sqlite3` file
2. Change the config.ts according to your need.
3. Set three secrets in settings enable GitHub action in your repository
<img width="1421" alt="image" src="https://github.com/fengkx/bangumi-downloader/assets/16515468/490efecf-6d99-4dee-82ce-f3cc6b3cdd02">

GEMINI_API_KEY is used to extract information from epsoide title. You can get one from https://makersuite.google.com/app/apikey

## Add Feed Url
<img width="1682" alt="image" src="https://github.com/fengkx/bangumi-downloader/assets/16515468/05974521-9043-4604-b8ba-374990b7294f">

Run *Add RSS feed* action, the feed url input will write to config file

## Run download
It is configured to run every hour with cron schedule. But we can also trigger from GitHub web page.

## TODO

- [x] config file / cli
- [x] log 优化
- [x] 内容去重， 支持 v2， 分辨率选择最高
- [ ] 检查下载任务
- [ ] 删除无效文件
- [ ] refresh login
