require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const config = require('../config/config')
const { findOrCreateStock } = require('../repositories/stock')
const {
  listNotifications,
  findNotification,
  createNotification,
  deleteNotification
} = require('../repositories/notification')
const {
  findDailyNotification,
  createDailyNotification,
  deleteDailyNotification
} = require('../repositories/dailynotification')

const bot = new TelegramBot(process.env.TELEGRAM_HAST, {polling: true});

const helpText = `
  *Lista de comandos*
  - /help - Listar comandos
  - /price - Precio actual de la acción

  *Notificaciones*
  - /listnotifications - Listar notificaciones
  - /createnotification - Crear notificación
  - /deletenotification - Eliminar noticación

  *Notificación Diaria*
  - /viewdailynotification - Ver la hora de notificación diaria
  - /setdailynotification [0-23] - Activar notificación diaria
  - /unsetdailynotification - Desactivar la notifación diaria
`

function validAmount(chatId, amount) {
  if (Number.isNaN(amount)) {
    bot.sendMessage(chatId, 'Introduce un valor numérico (en USD). Te llegará una notificación cuando la acción llegue a ese precio.')
    return false
  }

  return true
}

function helpCommand(chatId) {
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
}

async function priceCommand(chatId) {
  const stock = await findOrCreateStock({ symbol: config.symbol })
  const price = stock.price
  bot.sendMessage(chatId, `Precio de la acción ${config.symbol}: $${price} USD`)
}

async function listNotificationsCommand(chatId) {
  const notifications = await listNotifications({ chatId })
  console.log('notifications: ', notifications)
  const notificationsList = notifications.map(notification => {
    return `- $${notification.amount}`
  }).join('\n')
  console.log('notificationsList: ', notificationsList)
  
  if (notificationsList) {
    bot.sendMessage(chatId, `Te notificaremos cuando la acción llegue a los siguientes montos (USD):\n${notificationsList}`)
  } else {
    bot.sendMessage(chatId, 'No has creado notificaciones.')
  }
}

async function createNotificationCommand(chatId, amountInput) {
  const amount = Number(amountInput)
  
  if (!validAmount(chatId, amount)) {
    return
  }

  const stock = await findOrCreateStock({ symbol: config.symbol })
  const price = stock.price

  /*
  if(amount < price) {
    bot.sendMessage(chatId, `La cantidad ($${amount} USD) debe ser mayor al precio actual (${price}) de la acción`)
    return
  }
  */

  try {
    let notification = await findNotification({
      chatId,
      amount
    })
  
    if (notification) {
      bot.sendMessage(chatId, `Ya tienes una notificación con el monto de $${amount} USD`)
    } else {
      notification = await createNotification(chatId, amount)
      bot.sendMessage(chatId, `Notificación creada correctamenta. Te avisaremos cuando la acción llegue a $${notification.amount} USD`)
    }
  } catch (error) {
    console.log('error: ', error)
    bot.sendMessage(chatId, 'Hubo un error al crear la notifiación')
  }
  
}

async function deleteNotificationCommand(chatId, amountInput) {
  const amount = Number(amountInput)
  if (!validAmount(chatId, amount)) {
    return
  }

  try {
    const notification = await findNotification({
      chatId,
      amount
    })
    if (notification) {
      await deleteNotification(chatId, amount)
      bot.sendMessage(chatId, `La notificación con monto $${amount} se eliminó exitosamente.`)
    } else {
      bot.sendMessage(chatId, `No existe una notificación con el monto de $${amount}.`)
    }
  } catch (error) {
    console.log('error: ', error)
    bot.sendMessage(chatId, 'Hubo un error al eliminar la notifiación')
  }

}

async function viewDailyNotificationCommand(chatId) {
  const dailyNotification = await findDailyNotification({ chatId })
  if (dailyNotification) {
    bot.sendMessage(chatId, `La hora de notificación diaria es a a las ${dailyNotification.hour}.`)
  } else {
    bot.sendMessage(chatId, 'No tiene configurada notificación diaria.')
  }
}

async function setDailyNotificationCommand(chatId, hourInput) {
  const hour = parseInt(Number(hourInput))
  console.log('hour: ', hour)
  if(Number.isNaN(hour) || !(hour>=0 && hour<=23)) {
    bot.sendMessage(chatId, 'Introduce la hora (valor entero entre 0 y 23)')
    return
  }

  let dailyNotification = await findDailyNotification({ chatId })
  if(dailyNotification) {
    dailyNotification.hour = hour
    dailyNotification.save()
  } else {
    dailyNotification = await createDailyNotification(chatId, hour)
  }
  bot.sendMessage(chatId, `Notificación diara configurada correctamente a las ${hour}hrs.`)
}

async function unsetDailyNotificationCommand(chatId) {
  const dailyNotification = await findDailyNotification({ chatId })
  console.log('unsetDailyNotificationCommand -> dailyNotification: ', dailyNotification)
  if (dailyNotification) {
    await deleteDailyNotification(chatId)
    bot.sendMessage(chatId, `Se ha eliminado la notifiación diaria`)
  } else {
    bot.sendMessage(chatId, 'No tiene configurada notificación diaria.')
  }
}

module.exports = {
  bot,
  helpCommand,
  priceCommand,
  listNotificationsCommand,
  createNotificationCommand,
  deleteNotificationCommand,
  viewDailyNotificationCommand,
  setDailyNotificationCommand,
  unsetDailyNotificationCommand
}