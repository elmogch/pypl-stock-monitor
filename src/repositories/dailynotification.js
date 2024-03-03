const DailyNotification = require('../models/dailynotification')

async function listDailyNotifications(filters) {
  return await DailyNotification.find(filters)
}

async function findDailyNotification(filters) {
  return await DailyNotification.findOne(filters)
}

async function createDailyNotification(chatId, hour) {
  return await DailyNotification.create({
    chatId,
    hour
  })
}

async function deleteDailyNotification(chatId) {
  return await DailyNotification.deleteOne({
    chatId
  })
}

module.exports = {
  listDailyNotifications,
  findDailyNotification,
  createDailyNotification,
  deleteDailyNotification
}