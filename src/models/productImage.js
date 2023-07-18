const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProductImage', productImageSchema);