# funabashi.dev

[Funabashi.dev](https://funabashi.dev)(船橋市を中心としたIT/Web系開発者コミュニティ)の公式サイト。Astro 5 製の静的サイト。

2026-08-01 に VitePress からフルリニューアル。情報設計・リニューアルの経緯は bot リポジトリの `docs/plans/2026-08-01-funabashi-dev-site-redesign.md`、日々の運用手順(統計更新・記事書き出し・再ビルド)の正本は同リポジトリの `.claude/skills/funadev-site/SKILL.md` を参照。

## 開発

パッケージマネージャは bun(bun.lock があるので Cloudflare Pages も自動で bun を使う)。

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # dist/ に静的出力
bun run preview
```

## ページ構成

- `/` トップ(実コピー+「数字で見る」statタイル+次回イベント告知ピル)
- `/about` `/activities` `/events` `/join` `/funadebu` 各静的ページ
- `/news/` ふなデブくん新聞部(content collection、下記)

## 記事の追加(ふなデブくん新聞部)

`src/content/news/YYYY-MM-DD-slug.md` を置いてコミットするとデプロイされる。frontmatter スキーマの正本は `src/content.config.ts`。

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

Discord の話題を記事化する際の編集方針(公開可否の判断)は bot リポジトリの funadev-site スキル参照。

## データの仕組み

### connpass イベント(`src/lib/connpass.ts`)

ビルド時に connpass のイベント一覧(hCalendar形式)をスクレイプし、トップの告知ピルと /events の「次回」「開催実績」を生成する。

- 取得失敗時は `src/data/events-fallback.json` へフォールバック。開催前/開催済みはビルド時刻で仕分け直すため、古い「申込受付中」は出ない
- **実測(2026-08-01): Cloudflare Pages のビルド環境からは connpass に到達できず(データセンターIP遮断とみられる)、本番は常時フォールバック**。ローカルビルドではライブ取得が動く。したがって**フォールバック JSON が実質の正データ** — 新イベント公開時と月1程度で bot リポジトリの `update-events-fallback.py` を実行して commit + push する
- どちらが使われたかは /events の HTML 末尾の隠しマーカー `data-events-source="connpass-live|fallback"` で判別できる
- connpass はデフォルトUAのHTTPクライアントに空応答(HTTP 202)を返すため、ブラウザ相当のUAヘッダで取得している。ローカルスクリプト側は TLS 指紋でも判定されるため curl サブプロセスを使う(httpx/requests は同ヘッダでも 202)

### 統計(`src/data/stats.json`)

トップの「数字で見る Funabashi.dev」の元データ。Discord メンバー数・チャンネル数・connpass メンバー数を bot リポジトリの `update-stats.py` で実測更新する(月1目安)。イベント回数はビルド時に connpass データから数えるので stats.json には持たない。

### 鮮度の担保(日次再ビルド)

connpass の情報はビルド時点のスナップショットのため、CF Pages の Deploy Hook を bot 側の OS cron が毎朝叩いて1日1回再ビルドする(仕組みは funadev-site スキルの `daily-rebuild.sh`)。

## デプロイ(Cloudflare Pages)

GitHub リポジトリ連携で main への push が本番反映される(現行設定は変更済み・稼働中)。

| 設定 | 値 |
|---|---|
| Build command | `bun run build` |
| Build output directory | `dist` |
| Node バージョン | 26系(`.node-version`。CFデフォルトの Node 18.17 は Astro 5 が拒否するため指定必須) |

- 依存導入は bun.lock により自動で bun。`package.json` の `packageManager` フィールドで bun を指定する方式は CF の corepack 非対応でビルドが失敗するため revert 済み(環境変数 `BUN_VERSION` 方式は未検証)
- 2026-08-01 にビルド設定の不整合で本番が一時 VitePress 誤ビルドになった事故あり(経緯は bot リポジトリ docs/ops/ のセッション日誌)。**ビルド設定を変えたら必ず本番の実配信を確認すること**
- pages.dev のブランチプレビューURLは Cloudflare Access 保護付きで閲覧可(Bulk Redirect の Include subdomains を OFF にして復活済み)
