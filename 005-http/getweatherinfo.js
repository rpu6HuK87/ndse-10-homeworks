#!/usr/bin/env node
const { hideBin } = require('yargs/helpers')
let yargs = require('yargs/yargs')(hideBin(process.argv))
const http = require('http')
require('dotenv').config()

yargs
  .parserConfiguration({
      "short-option-groups": false,
      "camel-case-expansion": true,
      "dot-notation": true,
      "parse-numbers": true,
      "boolean-negation": true,
      "deep-merge-config": false
  })
  .usage('Использование: $0 <команда> [опции]')
  .example('$0 -g Ханты-Мансийск', 'Получить погодные данные по городу Ханты-Мансийск')
  .alias('g', 'gorod')
  .nargs('g', 1)
  .describe('g', 'Название города')
  .demandOption(['g'])  
  .help('h')
  .argv
  
console.log(process.env.API_KEY)
const url = 'http://api.weatherstack.com/current?access_key=' + process.env.API_KEY + '&query=' + yargs.argv.g

http.get(url, (res) => {
  const statusCode = res.statusCode
  if (statusCode !== 200) {
    console.error(`Ошибка: ${statusCode}`)
    return
  }
  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => rawData += chunk)
  res.on('end', () => {
    let parsedData = JSON.parse(rawData)
    console.log(parsedData)
  })
}).on('error', (e) => {
  console.error(`Ошибка: ${e.message}`)
})