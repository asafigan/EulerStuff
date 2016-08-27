const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {range} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 9 ////////////////////////////

A Pythagorean triplet is a set of three natural numbers, a < b < c, for which,

a^2 + b^2 = c^2
For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2.

There exists exactly one Pythagorean triplet for which a + b + c = 1000.
Find the product abc.
`
})

r.add(() => {
  for (const a of range(1, 999)) {
    for (const b of range(1, 999 - a)) {
      const c = 1000 - a - b
      if (a * a + b * b === c * c) return a * b * c
    }
  }
})
