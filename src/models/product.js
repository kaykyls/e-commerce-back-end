const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    previousPrice: { type: Number },
    currentPrice: { type: Number, required: true },
    rating: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isMostSold: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    colors: [{
        type: String,
        required: true
    }],
    sizes: [{
        type: Number,
        required: true
    }],
    prices: [{
        color: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductImage"
    }],
    description: { type: String, required: true },
    stock: { type: Number, required: true },
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