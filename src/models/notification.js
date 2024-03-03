const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification