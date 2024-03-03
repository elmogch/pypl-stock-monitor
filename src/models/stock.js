const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Stock = mongoose.model('Stock', stockSchema)
module.exports = Stock