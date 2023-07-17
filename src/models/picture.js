const mongoose = require("mongoose")

const pictureSchema = mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    color: { type: String, required: true }
})

module.exports = mongoose.model("Picture", pictureSchema)