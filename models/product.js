const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name must be provided.']
    },
    price: {
        type: Number,
        required: [true, 'Product price name must be provided.']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating:{
        type: Number,
        default: 4.5,
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'caressa', 'liddy', 'marcos'],
            message: '{VALUE} is not supported.'
        }
        // enum: ['ikea', 'caressa', 'liddy', 'marcos']
    }
}, {timestamps})

module.exports = mongoose.model('Product', productSchema)