const express = require("express");
const router = express.Router();

const NewProduct = require("../models/newProduct");
const PopularProduct = require("../models/popularProduct");
const FeaturedProduct = require("../models/featuredProduct");

router.get("/new-products", async (req, res) => {
    try {
        const newProducts = await NewProduct.find({});
        res.send(newProducts);
    } catch (err) {
        console.log(err);
    }
})

router.post("/new-products", async (req, res) => {
    const { productId } = req.body;

    try {
        const newProduct = await NewProduct.create({
             productId
        });
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(422).json(err);
    }
})

router.get("/popular-products", async (req, res) => {
    try {
        const popularProducts = await PopularProduct.find({});
        res.send(popularProducts);
    } catch (err) {
        console.log(err);
    }
})

router.post("/popular-products", async (req, res) => {
    const { productId } = req.body;

    try {
        const popularProduct = await PopularProduct.create({
            productId
        });
        res.status(200).json(popularProduct);
    } catch (err) {
        res.status(422).json(err);
    }
})


router.get("/featured-products", async (req, res) => {
    try {
        const featuredProducts = await FeaturedProduct.find({});
        res.send(featuredProducts);
    } catch (err) {
        console.log(err);
    }
})

router.post("/featured-products", async (req, res) => {
    const { productId } = req.body;

    try {
        const featuredProduct = await FeaturedProduct.create({
            productId
        });
        res.status(200).json(featuredProduct);
    } catch (err) {
        res.status(422).json(err);
    }
})

module.exports = router;