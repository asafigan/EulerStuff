const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {primes} = FunGen

const Immutable = require('immutable')

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 10 ////////////////////////////

Find the sum of all the primes below two million.
`
})

r.add(() => {
  return primes().until(x => x > 2000000)
    .reduce((sum, x) => sum + x, 0)
})

const getPrimes = function * () {
  yield 2
  let n = 3
  while (true) {
    if (primes.isPrime(n)) yield n
    n += 2
  }
}

r.add(() => {
  return Immutable.Seq(getPrimes())
    .takeUntil(x => x > 2000000)
    .reduce((sum, x) => sum + x, 0)
})
