const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const {range} = FunGen

const r = new Runner(Runner.Default)

r.changeOptions({
  logBefore: `///////////////////////// Problem 14 ////////////////////////////

  The following iterative sequence is defined for the set of positive integers:

  n → n/2 (n is even)
  n → 3n + 1 (n is odd)

  Using the rule above and starting with 13, we generate the following sequence:

  13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
  It can be seen that this sequence (starting at 13 and finishing at 1)
  contains 10 terms. Although it has not been proved yet (Collatz Problem),
  it is thought that all starting numbers finish at 1.

  Which starting number, under one million, produces the longest chain?

  NOTE: Once the chain starts the terms are allowed to go above one mil
`
})

const isEven = n => {
  return n % 2 === 0
}

const sequence = n => {
  let i = 1

  while (n > 1) {
    if (isEven(n)) n /= 2
    else n = 3 * n + 1
    i++
  }

  return i
}

r.add(() => {
  return range(1000000, 1, -1)
    .map(x => [x, sequence(x)])
    .reduce((max, arr) => max[1] > arr[1] ? max : arr, [0, 0])[0]
})
