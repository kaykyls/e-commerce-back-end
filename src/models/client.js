const mongoose = require("mongoose")

const clientSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: Date, default: Date.now },
    // addresses: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Address"
    // }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]
})

module.exports = mongoose.model("Client", clientSchema)