const express = require('express')
const cors = require('cors')
const postsRouter = require('./routes/posts')

const app = express()


// ✅ 特定のオリジンだけ許可（本番と開発）
const allowedOrigins = [
  'https://simple-blog-app-beta.vercel.app',
  'http://localhost:5173'
]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))



// ⭐️ この1行を追加！リクエストの JSON をパースできるようにする
app.use(express.json())

// ルーティング
app.use('/api/posts', postsRouter)

// Renderで必要なPORT環境変数を使用
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー起動中 http://localhost:${PORT}`);
});