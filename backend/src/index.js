const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})