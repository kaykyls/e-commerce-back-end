const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    previousPrice: { type: Number },
    currentPrice: { type: Number, required: true },
    rating: { type: Number },
    isOnSale: { type: Boolean, default: false },
    colors: [{
        type: String,
        required: true
    }],
    sizes: [{
        type: Number,
        required: true
    }],
    stock: [{
        color: { type: String, required: true },
        size: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 0 }
    }],
    // prices: [{
    //     color: { type: String, required: true },
    //     price: { type: Number, required: true }
    // }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductImage"
    }],
    description: { type: String, required: true },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],
    // reviews: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Review"
    // }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
