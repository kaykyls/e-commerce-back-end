const express = require('express');
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    let products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(422).json(err);
  }
})

router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(422).json(err);
  }
})

router.post("/add", async (req, res) => {
  let { title, previousPrice, currentPrice, rating, colors, sizes, description, stock, categories } = req.body;
  
  try {
    let product = await Product.create({
      title,
      previousPrice,
      currentPrice,
      rating,
      colors,
      sizes,
      description,
      stock,
      categories
    });
      res.status(200).json(product);
    } catch (err) {
      res.status(422).json(err);
    }
})

router.put("/:id/edit", async (req, res) => {
  let { title, previousPrice, currentPrice, rating, description, stock } = req.body;
  let product = await Product.findById(req.params.id);
  try {
    await product.update({
      title,
      previousPrice,
      currentPrice,
      rating,
      description,
      stock
    }, { new: true });
    res.status(200).json(product);
  } catch (err) {
    res.status(422).json(err);
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndRemove(req.params.id)
    res.status(200).json(product);
  } catch (err) {
    res.status(422).json(err);
  }
})

module.exports = router;