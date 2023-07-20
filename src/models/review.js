const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Review", reviewSchema);