const mongoose = require("mongoose");

const popularProductSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

module.exports = mongoose.model("PopularProduct", popularProductSchema);