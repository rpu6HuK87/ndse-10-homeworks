#!/usr/bin/env node
const readline = require('readline')
const plural = require('plural-ru')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const guessedNum = Math.floor(Math.random() * 100)
let count = 0
let begin = Date.now()

const ask = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (input) => resolve(input))
  })
}
const processAnswer = (answer) => {  
  if(isNaN(answer) || !Number.isInteger(answer)) return 'Веедите целое число от 0 до 100: '

  return answer > guessedNum ? 'Меньше\n' : 
          answer < guessedNum ? 'Больше\n' : answer
}
async function start(answer) {
  if(!answer) console.log('Угадайте число от 0 до 100! ' /* + guessedNum */)
  if(typeof answer === 'number') {
    let sec = Math.floor((Date.now() - begin)/1000)
    console.log('Ура! Вы угадали загаданное число ' + answer + ' с ' + count + ' попытки за ' + plural(sec, '%d секунду', '%d секунды', '%d секунд'))
    rl.close()
    return
  }
  count++
  let num = await ask(answer ? answer : 'Введите число: ')
  start(processAnswer(+num))
} 
start()