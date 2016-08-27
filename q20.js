const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const bigInt = require('big-integer')
const {range} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 20 ////////////////////////////

Find the sum of the digits in the number 100!
`
})

r.add(() => {
  const factorial = x => {
    return range(2, x + 1)
      .map(x => bigInt(x))
      .reduce((product, x) => product.times(x), bigInt(1))
  }

  return [...factorial(100).toString()]
    .map(x => Number(x))
    .reduce((sum, x) => sum + x, 0)
})
