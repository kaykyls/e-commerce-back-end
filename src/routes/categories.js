const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.get("/", async (req, res) => {
    try {
        let categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(422).json(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (err) {
        res.status(422).json(err);
    }
})

router.post("/add", async (req, res) => {
    let { title } = req.body;

    try {
        let category = await Category.create({
            title
        });
        res.status(200).json(category);
    } catch (err) {
        res.status(422).json(err);
    }
})

router.put("/:id/edit", async (req, res) => {
    let { title } = req.body;
    let category = await Category.findById(req.params.id);
    try {
        await category.update({
            title
        }, { new: true });
        res.status(200).json(category);
    } catch (err) {
        res.status(422).json(err);
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        let category = await Category.findByIdAndRemove(req.params.id)
        res.status(200).json(category);
    } catch (err) {
        res.status(422).json(err);
    }
})

module.exports = router;