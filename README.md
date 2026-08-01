# funabashi.dev

[Funabashi.dev](https://funabashi.dev)(船橋市を中心としたIT/Web系開発者コミュニティ)の公式サイト。Astro 製。

情報設計・リニューアルの経緯は bot リポジトリの `docs/plans/2026-08-01-funabashi-dev-site-redesign.md` を参照。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的出力
npm run preview
```

## 記事の追加(ふなデブくん新聞部)

`src/content/news/YYYY-MM-DD-slug.md` を置いてコミットするとデプロイされる。

```markdown
---
title: 記事タイトル
date: 2026-08-01
category: discord   # discord | local | tech
hitokoto: ふなデブくんの一言(全記事必須)
description: 一覧・OGP用の要約(任意)
---

本文(Markdown)
```

## デプロイ(Cloudflare Pages)

GitHub リポジトリ連携で main へのマージが本番反映される。**VitePress → Astro 移行に伴い、Cloudflare Pages のビルド設定を次に変更すること**:

| 設定 | 値 |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| 環境変数 `NODE_VERSION` | `22`(Astro 5 は Node 18.17 以上必須) |
