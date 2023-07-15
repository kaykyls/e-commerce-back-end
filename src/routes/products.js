const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET PRODUCTS");
})

router.get("/:id", (req, res) => {
    console.log(req.params.id);
    res.send("GET PRODUCTS BY ID");
})

router.post("/add", (req, res) => {
    res.status(200).send("POST PRODUCTS");
})

module.exports = router;