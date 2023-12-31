const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const express = require('express');
const router = express.Router();
const uploadMulter = require("../config/multer");

const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

const Product = require("../models/product");
const Category = require("../models/category");

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

router.post("/add", checkToken, uploadMulter.array("files"), async (req, res) => {
  console.log(req.body)

  let { title, currentPrice, colors, sizes, description, categories, stock } = req.body;

  sizes = sizes.split(',').map(size => parseInt(size));
  colors = colors.split(',');

  try {
    let product = new Product({
      title,
      currentPrice,
      colors,
      sizes,
      description,
      categories,
      stock: JSON.parse(stock),
      images: [],
      prices: [],
    });

    const uploadPromises = req.files.map(async (file, index) => {
      const name = Date.now() + "-" + file.originalname;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file.buffer);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);

              product.images.push({
                src: downloadURL,
                color: JSON.parse(req.body.photosColors)[index].color
              });

              resolve();
            } catch (err) {
              console.log(err)

              reject(err);
            }
          }
        );
      });
    });

    await Promise.all(uploadPromises);

    await product.save();

    console.log(product)

    product.categories.forEach(async (categoryId) => {
      let category = await Category.findById(categoryId);
      category.products.push(product._id);
      await category.save();

      console.log(category)
    });

    res.status(200).json({ product });
  } catch (err) {
    console.log(err)

    res.status(422).json(err);
  }
});

router.put("/:id/edit", uploadMulter.array("files"), async (req, res) => {
  console.log(req.body);

  let { title, currentPrice, colors, sizes, description, categories, stock } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    // Remova imagens antigas se necessário
    // product.images = [];

    const uploadPromises = req.files.map(async (file, index) => {
      const name = Date.now() + "-" + file.originalname;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file.buffer);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);

              product.images.push({
                src: downloadURL,
                color: JSON.parse(req.body.photosColors)[index].color
              });

              resolve();
            } catch (err) {
              console.log(err);
              reject(err);
            }
          }
        );
      });
    });

    await Promise.all(uploadPromises);

    // Atualize as outras propriedades
    product.title = title;
    product.currentPrice = currentPrice;
    product.colors = colors.split(",");
    product.sizes = sizes.split(",").map((size) => parseInt(size));
    product.description = description;
    product.categories = categories;
    product.stock = JSON.parse(stock);

    // Salve as alterações
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(422).json(err);
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndRemove(req.params.id)
    res.status(200).json(product);
  } catch (err) {
    res.status(422).json(err);
  }
})

module.exports = router;