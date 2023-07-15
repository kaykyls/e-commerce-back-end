const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    created: { type: Date, default: Date.now },
    status: { type: String, required: true, default: "pending" },
    total: { type: Number, required: true },
    payment: { type: String, required: true },
    address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
})

module.exports = mongoose.model("Order", orderSchema)