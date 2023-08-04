const express = require('express')
const cors = require('cors')
const productsRouter = require('./src/routes/products')
const categoryRouter = require('./src/routes/categories')
const settingsRouter = require('./src/routes/settings')
const app = express()
const port = 3333
require('./db')

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-admin-flame.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Access denied by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.use(express.json())

app.use("/products", productsRouter)

app.use("/categories", categoryRouter)

app.use("/settings", settingsRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})