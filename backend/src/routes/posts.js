// Express を読み込みます（ルーティング機能を使うため）
const express = require('express')

//db.js で定義した SQLite の接続オブジェクト を読み込む
const db = require('../db')

// 小さなルーター（ミニアプリ）を作成します
// 小さな専用ルーティングのかたまりを作る道具です。
const router = express.Router()

// 記事一覧取得API（GET /api/posts）
router.get('/',(req,res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if(err){
      return res.status(500).json({ error: 'DBエラー'})
    }
    res.json(rows)
  })
})

// 個別記事取得
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM posts WHERE id = ?', [postID], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'DBエラー'})// ← SQL実行失敗
    }
    if (!row) {
      return res.status(404).json({ error: '記事が見つかりません'})// ← データなし
    }
    res.json(row)// ← 成功したら JSONで記事データを返す
  })
})
// このファイルの外に router を渡す（export する）
module.exports = router