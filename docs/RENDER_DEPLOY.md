# Render で Next.js アプリをデプロイする手順

このプロジェクトは **API ルート**（`/api/prefectures`, `/api/population`）を使っているため、**Static サイトではなく Web サービス** でデプロイしてください。

---

## 1. GitHub にコードをプッシュする

Render は GitHub リポジトリと連携します。まだの場合は以下でプッシュしてください。

```bash
cd /Users/apple/Next/last-boss_new_api
git add .
git commit -m "Add Render config"
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

---

## 2. Render で Web サービスを作成

1. **Render ダッシュボード**にログイン  
   https://dashboard.render.com/

2. **「New +」→「Web Service」** をクリック  
   （**Static Site** ではなく **Web Service** を選んでください）

3. **GitHub と接続**（初回のみ）

   - 「Connect a repository」で GitHub を選び、対象リポジトリを選択
   - リポジトリが一覧にない場合は「Configure account」で権限を付与

4. **リポジトリを選択**

   - このプロジェクトのリポジトリ（例: `last-boss_new_api`）を選ぶ

5. **設定を入力**

   | 項目              | 入力値                          |
   | ----------------- | ------------------------------- |
   | **Name**          | 任意（例: `last-boss-new-api`） |
   | **Region**        | お好み（例: Singapore）         |
   | **Branch**        | `main`                          |
   | **Runtime**       | `Node`                          |
   | **Build Command** | `npm install && npm run build`  |
   | **Start Command** | `npm start`                     |
   | **Instance Type** | Free（無料プラン）              |

6. **Environment（環境変数）の入力箇所**  
   画面を**下にスクロール**すると次のようなブロックがあります。
   - **「Advanced」** をクリックして展開する
   - その中に **「Environment Variables」** または **「Add Environment Variable」** というボタン／セクションがある
   - **「Add Environment Variable」** または **「+ Add」** をクリック
   - **Key** と **Value** を1つずつ入力して追加（下記の表を参照）
   - 複数ある場合は、同じ手順で何度でも追加できる

   | Key            | Value            | 説明                                                                        |
   | -------------- | ---------------- | --------------------------------------------------------------------------- |
   | `MLIT_API_KEY` | あなたのAPIキー  | 国土交通省DPF（都道府県一覧）用。未設定ならフォールバックの47都道府県を使用 |
   | `ESTAT_APP_ID` | あなたのアプリID | e-Stat（人口データ）用。未設定ならフォールバックの人口データを使用          |
   | `NODE_VERSION` | `20`             | （任意）Node のバージョン指定                                               |

   **すでに Web サービスを作成済みの場合**  
   - Render ダッシュボードで該当の **Web サービス名** をクリック
   - 左メニューまたは上部タブで **「Environment」** をクリック
   - **「Add Environment Variable」** で Key / Value を追加し、**「Save Changes」** で保存（必要に応じて再デプロイされます）

7. **「Create Web Service」** をクリック

---

## 3. デプロイの完了を待つ

- 初回はビルドに 2〜5 分ほどかかることがあります
- ログで `Build successful` や `Your service is live at https://...` と出れば成功です
- 表示された URL（例: `https://last-boss-new-api.onrender.com`）でアプリにアクセスできます

---

## 4. よくある注意点

- **無料プラン**: しばらくアクセスがないとスリープし、次のアクセスで数十秒かかることがあります
- **環境変数**: `.env.local` は Git に含まれないため、Render の「Environment」で上記のキーを設定してください
- **ビルドエラー**: ログの「Build」タブで `npm run build` のエラーを確認できます。Node のバージョンは 18 以上を推奨します

---

## 参考リンク

- [Render - Deploy Next.js](https://render.com/docs/deploy-nextjs-app)
- [Render ダッシュボード](https://dashboard.render.com/)
