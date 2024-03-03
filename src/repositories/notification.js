const Notification = require('../models/notification')

async function listNotifications(filters) {
  return await Notification.find(filters)
}

async function findNotification(filters) {
  return await Notification.findOne(filters)
}

async function createNotification(chatId, amount) {
  return await Notification.create({
    chatId,
    amount
  })
}

async function deleteNotification(chatId, amount) {
  return await Notification.deleteOne({
    chatId,
    amount
  })
}

module.exports = {
  listNotifications,
  findNotification,
  createNotification,
  deleteNotification
}