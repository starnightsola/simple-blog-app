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
  const postId = req.params.id
  db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'DBエラー'})// ← SQL実行失敗
    }
    if (!row) {
      return res.status(404).json({ error: '記事が見つかりません'})// ← データなし
    }
    res.json(row)// ← 成功したら JSONで記事データを返す
  })
})

// 新しい記事を追加するAPI（POST /api/posts）
// /api/posts` に対する **POSTリクエスト**（記事追加）を処理するルート定義。
router.post('/',(req, res) => {
  const { title, content } = req.body

  // 入力チェック
  // どちらかが空だったらエラー（`400 Bad Request`）を返す。
  if(!title || !content) {
    return res.status(400).json({ error: 'タイトルと本文は必須です'})// ← 
  }

  // new Date():JavaScriptで現在の日付と時刻を取得します。
  // 例：2025-05-22T18:23:45.123Z（これは ISO 8601形式）
  // .toISOString():その日付を「文字列」に変換します（ISOフォーマット）
  const createdAt = new Date().toISOString()

  // 新しい記事を作るときには、作成日時（createdAt）＝今の時刻
  // 更新日時（updatedAt）＝最初は同じ（あとで編集されたら更新される）
  const updatedAt = createdAt

  // INSERT INTO は データベースに新しい記事を追加する命令
  // posts テーブルに新しい行（レコード）を追加
  // createdAt と updatedAt を同時に保存
  const sql = 'INSERT INTO posts (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)'

  const params = [title, content, createdAt, updatedAt]

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー'})
    }
    // 成功時は、追加された記事のIDなどを返す
    res.status(201).json({
      message: '記事が作成されました',
      post: {
        id: this.lastID,
        title,
        content,
        createdAt,
        updatedAt
      }
    })
  })
})

// 記事を更新するAPI（PUT /api/posts/:id）
router.put('/:id', (req, res) => {
  const postId = req.params.id
  const { title, content } = req.body
  if(!title || !content ) {
    return res.status(400).json({ error: 'タイトルと本文は必須です'})
  }

  const updatedAt = new Date().toISOString()
  // UPDATE は 既にある記事の内容を上書き（更新）する命令
  // WHERE id = ? で「どの記事を更新するか」を指定
  // updatedAt だけ変更（createdAt はそのまま）
  const sql = 'UPDATE posts SET title = ?, content = ?, updatedAt = ? WHERE id = ?'

  const params = [title, content, updatedAt, postId]

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー' })
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '記事が見つかりません' })
    }
    res.status(200).json({
      message: '記事が更新されました',
      post: {
        id: Number(postId),
        title,
        content,
        updatedAt
      }
    })
  })
})

// 記事削除API（DELETE /api/posts/:id）
router.delete('/:id', (req, res) => {
  const postId = req.params.id
  const sql = 'DELETE FROM posts WHERE id = ?'

  db.run(sql, [postId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー' })
    }
    // 削除対象がなかった場合
    if (this.changes === 0){
      return res.status(404).json({ error: '記事が見つかりません' })
    }
    // 成功（204: No Content）
    res.status(204).send()
  })
})

// このファイルの外に router を渡す（export する）
module.exports = router