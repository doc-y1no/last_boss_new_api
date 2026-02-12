# 超ラスボス課題 - 都道府県別人口推移グラフ

Next.js で構築した SPA です。都道府県を選択すると、選択した都道府県の人口構成（総人口・年少人口・生産年齢人口・老年人口）を年別の折れ線グラフで表示します。

## 利用している API

- **都道府県一覧**: [国土交通省データプラットフォーム（DPF）](https://www.mlit-data.jp/) のコード情報 API（GraphQL）
  - RESAS API 終了に伴い、[国土交通省 DPF](https://data-platform.mlit.go.jp/#/Page?id=landing) に移行しています。
  - 参考: [RESAS APIが終了している！ならば国土交通省DPFだ！](https://qiita.com/kisayama/items/207b3f228c3e784e62a7)
- **人口データ**: 国土交通省 DPF には人口構成 API が存在しないため、現在はアプリ内のフォールバックデータで表示しています。本番利用時は [e-Stat API](https://www.e-stat.go.jp/api/) 等への差し替えを推奨します。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数

プロジェクトルートに `.env.local` を作成し、国土交通省 DPF の API キーを設定してください。

```bash
# 国土交通省データプラットフォームの API キー（都道府県一覧取得に使用）
# 取得: https://www.mlit-data.jp/ でアカウント作成・API キー発行
MLIT_API_KEY=your_mlit_api_key_here

# e-Stat（政府統計の総合窓口）アプリケーションID（人口データ取得に使用）
# 取得: https://www.e-stat.go.jp/api/ で利用登録・アプリケーションID発行
# 設定時は総人口を e-Stat から取得します（未設定の場合はフォールバックデータ）
ESTAT_APP_ID=your_estat_app_id
```

API キー・アプリケーションIDはサーバー側でのみ使用され、クライアントに露出しません。

### 3. 開発サーバー

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で表示されます。

### 4. ビルド・本番起動

```bash
npm run build
npm start
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **グラフ**: Recharts
- **スタイル**: SCSS Modules, CSS
- **リンター**: ESLint / Prettier

## クレジット表示

本サービスは、国土交通データプラットフォームの API 機能を使用していますが、最新のデータを保証するものではありません。（アプリ内フッターにも表示）

## 参考リンク

- [国土交通省データプラットフォーム](https://data-platform.mlit.go.jp/#/Page?id=landing)
- [国土交通DPF 利用者API ドキュメント](https://www.mlit-data.jp/api_docs/)
- [e-Stat API](https://www.e-stat.go.jp/api/)
