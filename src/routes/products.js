const express = require('express');
const router = express.Router();

const Picture = require("../models/productImage");
const Product = require("../models/product");
const upload = require("../config/multer");

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

router.post("/add", upload.single("file"), async (req, res) => {
  console.log(req.body, req.file);

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

    const name = title + Date.now();
    const file = req.file;
    const picture = new Picture({
      name,
      src: file.path,
    });
  
    await picture.save();
      res.status(200).json({ product, picture });
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