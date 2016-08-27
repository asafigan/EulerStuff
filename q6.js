const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {range} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 6 ////////////////////////////

  The sum of the squares of the first ten natural numbers is,

  1^2 + 2^2 + ... + 10^2 = 385
  The square of the sum of the first ten natural numbers is,

  (1 + 2 + ... + 10)^2 = 552 = 3025
  Hence the difference between the sum of the squares of
  the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.

  Find the difference between the sum of the squares of
  the first one hundred natural numbers and the square of the sum.
`
})

r.add(() => {
  const sum = range(1, 101)
    .reduce((sum, x) => sum + x, 0)

  const sumOfSquares = range(1, 101)
    .map(x => x * x)
    .reduce((sum, x) => sum + x, 0)

  return sum * sum - sumOfSquares
})
