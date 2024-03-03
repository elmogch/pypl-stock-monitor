require('dotenv').config()
const fetch = require('node-fetch')
const Stock = require('../models/stock')
const config = require('../config/config')
// const stockData = require('../../output-sample/stock.json')

async function getStockPrice() {
  const stockApiKey = process.env.STOCK_HASH
  const stockApiUrl = `${config.stockApi.url}?function=GLOBAL_QUOTE&symbol=${config.symbol}&apikey=${stockApiKey}`
  const response = await fetch(stockApiUrl)
  const data = await response.json()

  // Simula asincronía del api del precio del stock para no terminar llamadas gratuitas mientras hacemos pruebas
  /*
  const data = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(stockData)
    }, 500)
  })
  */
  const price = Number(data['Global Quote']['05. price'])
  return price
}

async function findStock(filters) {
  return await Stock.findOne(filters)
}

async function findOrCreateStock(filters) {
  const stock = await findStock(filters)
  if(stock) {
    return stock
  }

  const price = await getStockPrice()
  return await Stock.create({
    symbol: config.symbol,
    price
  })
}

async function createOrUpdateStock(filters) {
  const stock = await findStock(filters)
  const price = await getStockPrice()
  
  if (stock) {
    stock.price = price
    return await stock.save()
  } else {
    return await Stock.create({
      symbol: config.symbol,
      price
    })
  }
}

module.exports = {
  findStock,
  findOrCreateStock,
  createOrUpdateStock,
}