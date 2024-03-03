const { connect } = require('./src/lib/db')
const {
  bot,
  helpCommand,
  priceCommand,
  listNotificationsCommand,
  createNotificationCommand,
  deleteNotificationCommand,
  viewDailyNotificationCommand,
  setDailyNotificationCommand,
  unsetDailyNotificationCommand
} = require('./src/lib/telegram-bot')

connect().then(() => {
  console.log('Mongoose Conected!')
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const inputText = msg.text

    // /createnotification 100
    const inputCommand = inputText.split(' ')
    const command = inputCommand[0]

    console.log('inputText', inputText)
    console.log('command', command)
  
    switch(command) {
      case '/price':
        await priceCommand(chatId)
        break
      case '/listnotifications':
        await listNotificationsCommand(chatId)
        break;
      case '/createnotification':
        await createNotificationCommand(chatId, inputCommand[1])
        break;
      case '/deletenotification':
        await deleteNotificationCommand(chatId, inputCommand[1])
        break;
      case '/viewdailynotification':
        await viewDailyNotificationCommand(chatId)
        break;
      case '/setdailynotification':
        await setDailyNotificationCommand(chatId, inputCommand[1])
        break;
      case '/unsetdailynotification':
        await unsetDailyNotificationCommand(chatId)
        break;
      case '/help':
      default:
        helpCommand(chatId)
        break
    }
  });
}).catch(err => console.log('Mongoose err: ', err))
