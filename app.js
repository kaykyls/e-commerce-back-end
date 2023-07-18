const express = require('express')
const productsRouter = require('./src/routes/products')
const categoryRouter = require('./src/routes/categories')
const app = express()
const port = 3333
require('./db')

app.use(express.json())

app.use("/products", productsRouter)

app.use("/categories", categoryRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})