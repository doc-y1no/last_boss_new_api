# 新規 GitHub リポジトリへプッシュする手順

## 1. 既存の Git 履歴をやめて新しく始める場合

プロジェクトフォルダで以下を実行してください。

```bash
cd /Users/apple/Next/last-boss_new_api

# 既存の .git を削除（履歴はすべて消えます）
rm -rf .git

# 新規に Git リポジトリを初期化
git init

# ブランチ名を main に
git branch -M main

# 全ファイルをステージ
git add .

# 初回コミット
git commit -m "Initial commit: 都道府県別人口グラフ（国土交通省DPF / e-Stat）"
```

## 2. GitHub で新しいリポジトリを作成

1. https://github.com/new を開く
2. **Repository name** を入力（例: `last-boss_new_api`）
3. **Public** を選択
4. **「Add a README file」などはチェックしない**（空のリポジトリにする）
5. **Create repository** をクリック

## 3. リモートを追加してプッシュ

GitHub に表示される「…or push an existing repository from the command line」のコマンドを使います。

**ユーザー名が `your-username`、リポジトリ名が `last-boss_new_api` の場合の例:**

```bash
git remote add origin https://github.com/your-username/last-boss_new_api.git
git push -u origin main
```

**SSH を使う場合の例:**

```bash
git remote add origin git@github.com:your-username/last-boss_new_api.git
git push -u origin main
```

`your-username` と `last-boss_new_api` は、実際の GitHub のユーザー名とリポジトリ名に置き換えてください。
