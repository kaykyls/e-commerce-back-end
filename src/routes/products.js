const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("../firebase");

const express = require('express');
const router = express.Router();
const uploadMulter = require("../config/multer");

const Picture = require("../models/productImage");
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

router.post("/add", uploadMulter.single("file"), async (req, res) => {
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
    const storage = getStorage();
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, req.file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {

      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );

    const url = await getDownloadURL(uploadTask.snapshot.ref);

    let picture = await Picture.create({
      productId: product._id,
      src: url
      // color: 
    });

    res.status(200).json({ product, picture });
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

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