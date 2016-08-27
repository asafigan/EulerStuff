const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const bigInt = require('big-integer')
const {range} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 25 ////////////////////////////

What is the index of the first term in the Fibonacci sequence to contain 1000 digits?
`
})

const fibonacciNumbers = new FunGen(function * () {
  let [a, b] = [bigInt(1), bigInt(1)]
  yield a
  yield b

  while (true) {
    [a, b] = [b, b.add(a)]
    yield b
  }
})

r.add(() => {
  let i = 0

  fibonacciNumbers
    .map(x => x.toString())
    .until(s => s.length === 1000)
    .forEach(() => i++)

  return i + 1
})
