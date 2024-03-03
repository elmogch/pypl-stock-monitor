require('dotenv').config()
const fetch = require('node-fetch')
const { connect, disconnect } = require('./src/lib/db')
const { createOrUpdateStock } = require('./src/repositories/stock')
const { listNotifications, deleteNotification } = require('./src/repositories/notification')
const { listDailyNotifications } = require('./src/repositories/dailynotification')
const config = require('./src/config/config')

connect().then(async () => {
	console.log('Mongoose Conected from stock-notification!')
	const telegramHash = process.env.TELEGRAM_HASH
	console.log('telegramHash: ', telegramHash)
	const telegramApiUrl = `${config.telegramApi.url}/bot${telegramHash}/sendMessage`
	
	// Actualizar precio del Stock
	const stock = await createOrUpdateStock({ symbol: config.symbol })

	// Verificar notificaciones y enviar mensajes
	const notifications = await listNotifications({ amount: {$lt: stock.price} })
	const notificationsPromises = []
	notifications.forEach(async (notification) => {
		const body = {
			chat_id: notification.chatId,
			text: `El precio de la acción ha superado los $${notification.amount} USD. Precio actual es $${stock.price}`
		}
		notificationsPromises.push(fetch(telegramApiUrl, {
			method: 'post',
			body: JSON.stringify(body),
			headers: {'Content-Type': 'application/json'}
		}))
		notificationsPromises.push(deleteNotification(notification.chatId, notification.amount))
	});

	// Verificar notificaciones diarias y enviar mensajes
	const date = new Date()
	const hour = date.getHours()
	const dailyNotifications = await listDailyNotifications({ hour })
	console.log(dailyNotifications)

	dailyNotifications.forEach(dailyNotification => {
		const body = {
			chat_id: dailyNotification.chatId,
			text: `El precio actual de la acción es $${stock.price}`
		}
		notificationsPromises.push(fetch(telegramApiUrl, {
			method: 'post',
			body: JSON.stringify(body),
			headers: {'Content-Type': 'application/json'}
		}))
	})

	Promise.all(notificationsPromises).then(() => {
		disconnect()
	})
})