const express = require('express')
const postsRouter = require('./routes/posts')
const app = express()

app.use(express.json())
app.use('/api/posts', postsRouter)

app.listen(3000, () => {
  console.log('🚀 サーバー起動中 http://localhost:3000')
})