const mongoose = require("mongoose");

const featuredProductSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

module.exports = mongoose.model("FeaturedProduct", featuredProductSchema);