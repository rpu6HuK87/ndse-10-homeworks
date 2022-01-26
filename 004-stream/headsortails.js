#!/usr/bin/env node
const { hideBin } = require('yargs/helpers')
let yargs = require('yargs/yargs')(hideBin(process.argv))
const fs = require('fs')
const path = require('path')

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
  .command('play', 'Играть в "Орел и решка"')
  .example('$0 play -l log.txt', 'Логирование результатов игры в лог-файл')
  .alias('l', 'logfile')
  .nargs('l', 1)
  .describe('l', 'Имя лог-файла')
  .demandOption(['l'])
  .alias('a', 'append')
  .describe('a', 'Добавлять записи в существующий лог-файл')
  .command('parselog', 'Анализатор игровых логов')
  .example('$0 parselog -l log.txt', 'Анализ результатов игры из лог-файла')
  .alias('l', 'logfile')
  .nargs('l', 1)
  .describe('l', 'Имя лог-файла')
  .demandOption(['l'])
  .help('h')
  .argv

const logfile = path.join(__dirname, yargs.argv.l)
let logdata = []

if(fs.existsSync(logfile)) {
  logdata = fs.readFileSync(logfile, 'utf-8')
  try {logdata = JSON.parse(logdata)} catch {logdata = []}
}

switch(yargs.argv._[0]) {
  case 'parselog':
    //тут анализатор 
    if(!fs.existsSync(logfile)) {
      console.log('Лог-файл "'+ logfile +'" не найден')
      yargs.exit()
    }
    if(logdata.length) {
      let wins = logdata.filter(game => game === 1).length
      let loses = logdata.filter(game => game === 0).length
      let rounds = wins + loses
      let winperc = wins / rounds * 100
      console.log('Статистика:')
      console.log('------------------------------')
      console.log('Всего сыграно раундов - ' + rounds)
      console.log('Выиграно раундов - ' + wins + ' (' + winperc.toFixed(2) + '%)')
      console.log('Проиграно раундов - ' + loses + ' (' + (100-winperc).toFixed(2) + '%)')
      if(rounds != logdata.length) console.log('\nВНИМАНИЕ!!! Лог-файл содержит невалидные данные')
    } else console.log('Лог файл пуст или содержит неподлежащие анализу данные')

  break
  case 'play':
    //тут игра
    console.log('Добро пожаловать в игру "Орел или решка". Комбинация CTRL+C завершит партию')
    let currentlogdata = []
    logdata = yargs.argv.a ? logdata : []    
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const ask = (question) => {
      return new Promise((resolve, reject) => {
        rl.question(question, (input) => resolve(input))
      })
    }

    (async () => {      
      while(true) {
        const guessedNum = Math.ceil(Math.random() * 2)  
        let num = await ask('Орел(1) или решка(2)? ')
        if(num == 1 || num == 2) {
          
          if(guessedNum == num) {
            currentlogdata.push(1)
            console.log('Угадал!)\n')
          } else {
            currentlogdata.push(0)
            console.log('Не угадал(\n')
          }
          
          //console.clear()
        } else console.log('Принимается только 1 или 2')
      }  
      rl.close()
    })() 
      
    rl.on('close', () => {      
      console.log('\nИгра завершена')
      if(currentlogdata.length) {
        console.log('\nЗапись результатов игры в лог-файл "'+ yargs.argv.l +'"')
        console.log('\nДля просмотра результатов введите "' + yargs.argv.$0 + ' parselog -l '+yargs.argv.l+'"')
        fs.writeFileSync(logfile, JSON.stringify(logdata.concat(currentlogdata)))
      } console.log('\nНет данных для логирования')
    })

  break
  default:
    yargs.showHelp().exit()
}
