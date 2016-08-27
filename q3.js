'use strict'

const {Runner} = require('./helpers')
const FunGen = require('./FunGen')
const Immutable = require('immutable')

const r = new Runner({logAfterEach: ''})

const searchSpace = n => ({
  *[Symbol.iterator] () {
    yield 2
    for (let x = 3; x <= n / x; x += 2) {
      let isPrime = true
      for (let y = 3; y <= x / y; y += 2) {
        if (x !== y && x % y === 0) {
          isPrime = false
          break
        }
      }
      if (isPrime) yield x
    }
  }
})

r.add(() => {
  const n = 600851475143
  const largestPrimeFactor = FunGen.primes()
    .until(x => x > n / x)
    .filter(x => n % x === 0)
    .reduce((_, x) => x, n)

  return largestPrimeFactor
})

r.add(() => {
  const n = 600851475143
  const largestPrimeFactor = new FunGen(searchSpace(n)[Symbol.iterator])
    .filter(x => n % x === 0)
    .reduce((_, x) => x)

  return largestPrimeFactor
})

r.add(() => {
  const n = 600851475143
  const searchSpace = Immutable.Seq([2])
    .concat(Immutable.Range(3, Infinity, 2))

  // This is the source of the inefficiency
  // the until method creates a new FunGen object
  // new FunGen object creation is slow
  // resolving them is fast
  const primes = searchSpace.filter(x =>
    !searchSpace
      .takeUntil(y => y > x / y)
      .find(y => x % y === 0)
  )

  const largestPrimeFactor = primes
    .takeUntil(x => x > n / x)
    .filter(x => n % x === 0)
    .last()

  return largestPrimeFactor
})

// This implementation is inefficient
r.add(() => {
  const n = 600851475143
  const searchSpace = new FunGen(2)
    .then(FunGen.count(3, 2))

  // This is the source of the inefficiency
  // the until method creates a new FunGen object
  // new FunGen object creation is slow
  // resolving them is fast
  const primes = searchSpace.filter(x =>
    !searchSpace
      .until(y => y > x / y)
      .find(y => x % y === 0)
  )

  const largestPrimeFactor = primes
    .until(x => x > n / x)
    .filter(x => n % x === 0)
    .reduce((_, x) => x)

  return largestPrimeFactor
})

r.add(() => {
  const n = 600851475143
  const searchSpace = new FunGen(2)
    .then(FunGen.count(3, 2))

  const primes = searchSpace.filter(x =>
    FunGen.primes.isPrime(x)
  )

  const largestPrimeFactor = primes
    .until(x => x > n / x)
    .filter(x => n % x === 0)
    .reduce((_, x) => x)

  return largestPrimeFactor
})

r.add(() => {
  const n = 600851475143
  const searchSpace = new FunGen(2)
    .then(FunGen.count(3, 2))
    .until(x => x > n / x)

  const primes = searchSpace.filter(x =>
    FunGen.primes.isPrime(x)
  )

  const largestPrimeFactor = primes
    .filter(x => n % x === 0)
    .reduce((_, x) => x)

  return largestPrimeFactor
})

r.add(() => {
  const n = 600851475143
  let largestPrimeFactor = 1
  for (const x of searchSpace(n)) {
    if (n % x === 0) {
      largestPrimeFactor = x
    }
  }

  return largestPrimeFactor
})
