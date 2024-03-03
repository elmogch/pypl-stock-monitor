const mongoose = require('mongoose')

const dailyNotificationSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    hour: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        default: 12
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const DailyNotification = mongoose.model('DailyNotification', dailyNotificationSchema)
module.exports = DailyNotification