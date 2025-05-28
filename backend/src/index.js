const express = require('express')
const cors = require('cors')
const postsRouter = require('./routes/posts')

const app = express()

// ✅ 特定のオリジンだけ許可（VercelのURL）
const allowedOrigins = ['https://simple-blog-app-beta.vercel.app']
app.use(cors({
  origin: allowedOrigins
}))


// ⭐️ この1行を追加！リクエストの JSON をパースできるようにする
app.use(express.json())

// ルーティング
app.use('/api/posts', postsRouter)

app.listen(3000, () => {
  console.log('🚀 サーバー起動中 http://localhost:3000')
})