const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    previousPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    rating: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isMostSold: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    // colors: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Color"
    // }],
    // sizes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Size"
    // }],
    // images: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Image"
    // }],
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    // categories: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category"
    // }],
})

module.exports = mongoose.model("Product", productSchema)