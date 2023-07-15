const express = require('express');
const router = express.Router();

const Product = require("../models/product");

router.get("/", (req, res) => {
    res.send("GET PRODUCTS");
})

router.get("/:id", (req, res) => {
    console.log(req.params.id);
    res.send("GET PRODUCTS BY ID");
})

router.post("/add", async (req, res) => {
    console.log(req.body);

    let { title, previousPrice, currentPrice, rating, description } = req.body;
  
    try {
      let product = await Product.create({
        title,
        previousPrice,
        currentPrice,
        rating,
        description
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(422).json(err);
    }
  });
  

module.exports = router;