const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {primes} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 7 ////////////////////////////

  What is the 10 001st prime number?
`
})

r.add(() => primes().get(10001))
