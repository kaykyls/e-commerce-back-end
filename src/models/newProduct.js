const mongoose = require("mongoose");

const newProductSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

module.exports = mongoose.model("NewProduct", newProductSchema);