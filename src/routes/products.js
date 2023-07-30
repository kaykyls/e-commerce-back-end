const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const express = require('express');
const router = express.Router();
const uploadMulter = require("../config/multer");

const Picture = require("../models/productImage");
const Product = require("../models/product");

const firebaseConfig = {
  apiKey: "AIzaSyCNAyf5WkIDShSKFtQ1u-KjnolbQcT96Ho",
  authDomain: "e-commerce-images-52905.firebaseapp.com",
  projectId: "e-commerce-images-52905",
  storageBucket: "e-commerce-images-52905.appspot.com",
  messagingSenderId: "517910904608",
  appId: "1:517910904608:web:577bf3e8d049f396fee145",
  measurementId: "G-20WMGQ591V"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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
    let product = new Product({
      title,
      previousPrice,
      currentPrice,
      rating,
      colors,
      sizes,
      description,
      stock,
      // categories,
      images: null
    });

    const name = Date.now() + ".png";
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, req.file.buffer);

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
        console.log(error);
        res.status(422).json(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          let picture = new Picture({
            productId: "product._id",
            src: downloadURL
            // color: 
          });

          product.images = picture._id;

          await product.save();
          await picture.save();

          res.status(200).json({ product, picture });
        } catch (err) {
          console.error(err);
          res.status(422).json(err);
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

router.put("/:id/edit", async (req, res) => {
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
