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
  let { title, previousPrice, currentPrice, rating, description, stock } = req.body;
  
  try {
    let product = await Product.create({
      title,
      previousPrice,
      currentPrice,
      rating,
      description,
      stock
    });
      res.status(200).json(product);
    } catch (err) {
      res.status(422).json(err);
    }
})

router.put("/edit/:id", async (req, res) => {
  let { title, previousPrice, currentPrice, rating, description, stock } = req.body;

  try {
    let product = await Product.findByIdAndUpdate(req.params.id, {
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