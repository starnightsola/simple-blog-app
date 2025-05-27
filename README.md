# Simple Blog App

## 概要
React（フロントエンド）× Express + SQLite（バックエンド）のシンプルなブログ投稿アプリケーションです。記事の作成・編集・削除・閲覧が可能で、ページ遷移アニメーションやスケルトンローディングも搭載しています。

## 機能概要

- 記事の一覧表示（ページネーション対応）
- 記事の詳細閲覧
- 記事の新規作成
- 記事の編集・削除
- APIサーバーとの接続（CORS回避のプロキシ設定済）
- スケルトンローディング表示
- フェードイン・アウトのページ遷移アニメーション（Framer Motion 使用）

## 使用技術

- Frontend: React + TypeScript + Chakra UI
- Backend: Node.js + Express
- Database: SQLite
- Animation: Framer Motion
- 開発補助: Vite, nodemon, Postman

## ディレクトリ構成
├── backend               # Express + SQLite の API サーバー
│   └── src/
├── public/               # 静的ファイル（画像など）
├── src/                  # React のフロントエンドコード
│   ├── pages/
│   ├── components/
│   └── ...
├── vite.config.ts        # Vite の設定ファイル（プロキシなど）
├── tsconfig.json         # TypeScript の設定
├── package.json          # フロントエンドの依存関係


##  セットアップ手順

###  1. バックエンドの起動

cd backend
npm install
npm run dev

###  2.フロントエンドの起動

npm install
npm run dev