const mongoose = require('mongoose')

function connect() {
    return module.exports = mongoose.connect('mongodb://localhost:27017/pypl_stock_monitor')
}

function disconnect() {
    mongoose.disconnect()
}

module.exports = {
    connect,
    disconnect
}
