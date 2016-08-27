const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {range, primes} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 5 ////////////////////////////

What is the smallest positive number that
is evenly divisible by all of the numbers from 1 to 20?
`
})

const primeFactorsOf = n => {
  return [
    ...primes().until(x => n / x < 1)
      .filter(x => n % x === 0)
  ]
}

const toFactors = n => {
  const factors = []
  while (n > 1) {
    const factor = range(2, n + 1)
      .find(x => n % x === 0)

    factors.push(factor)
    n = n / factor
  }
  return factors
}

r.add(() => {
  return range(1, 21)
    .map(toFactors)
    // merge factors
    .reduce((allFactors, factors) => {
      const arr = []
      while (allFactors.length > 0) {
        let n = allFactors.pop()
        let i = factors.indexOf(n)
        if (i > -1) factors.splice(i, 1)
        arr.push(n)
      }
      return arr.concat(factors)
    }, [])
    .reduce((result, x) => result * x, 1)
})
