#!/usr/bin/env node
const { hideBin } = require('yargs/helpers')
let yargs = require('yargs/yargs')(hideBin(process.argv))

let date = new Date(), newdate = false

const mw = argv => {
  let err = false
  if(argv._.length > 1) err = 'Слишком много команд: ['+ argv._ + ']\n\n'

  let l = Object.entries(argv).length
  if(argv._) {
    switch (argv._[0]) {
      case 'current':
        if(l > 4) err = 'Недопустимое количество опций для команды current\n'
        argv.opts = (l == 2) ? false : true
      break

      case 'add':
      case 'sub':      
        if(l == 2) err = 'Не указана дополнительная опция'
        else {
          let num = Object.values(argv)[1]
          if(isNaN(num) || num < 1) err = 'Опция [' + Object.keys(argv)[1] +  '] должна быть положительным числом'
          else argv.trueval = (argv._[0] == 'sub') ? -num : num
        }
        
      break

      default:
        err = argv._[0] ? 'Неизвестная команда: ['+ argv._[0] + ']\n\n' : 'Недостаточно аргументов и опций'
    }
  } else err = 'Недостаточно аргументов и опций'
  if(err) {
    console.error(err)
    yargs.showHelp().exit()
  }
}
const getRequestedDate = argv => {
  if(argv.trueval) {
    if(argv.y) newdate = new Date(date.setFullYear(date.getFullYear() + argv.trueval))
    if(argv.m) newdate = new Date(date.setMonth(date.getMonth() + argv.trueval))
    if(argv.d) newdate = new Date(date.setDate(date.getDate() + argv.trueval))   

  }
  else if (argv.opts) {
    if(argv.y) newdate = date.getFullYear()
    if(argv.m) newdate = date.getMonth() + 1
    if(argv.d) newdate = date.getDate()
  } else console.log(date)

  if(newdate) console.log(newdate)
  else if(argv.opts || argv.trueval) console.error('Неизвестная опция: ' + Object.keys(argv)[1])
}
const opts = {
  'year': {
    alias: 'y',
    number: true,
    requiresArg: true
  },
  'month': {
    alias: 'm',
    number: true,
    requiresArg: true
  },
  'date': {
    alias: 'd',
    number: true,
    requiresArg: true
  }
}

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
  .command(
    'current',
    'Выводит текущую дату в формате ISO',
    {
      'year': {
        alias: 'y',
        describe: 'Выводит текущий год',
        boolean: true
      },
      'month': {
        alias: 'm',
        describe: 'Выводит текущий месяц',
        boolean: true
      },
      'date': {
        alias: 'd',
        describe: 'Выводит текущий календарный день',
        boolean: true
      }
    },
    getRequestedDate
  )
  .example('$0 current -y', 'Выводит текущий год')
  .command('add', 'Выводит будущую дату в формате ISO', opts, getRequestedDate)
  .example('$0 add -m 2', 'Выводит дату на два месяца вперед')
  .command('sub', 'Выводит прошедшую дату в формате ISO', opts, getRequestedDate)
  .example('$0 sub -y 5', 'Выводит дату на пять лет назад')
  .help('h')
  .middleware([mw])

  yargs.argv
