'use strict'

// this was a fun experiment for making functional generators
// but ImmutableJS Seq is the same thing and has greater proformance
class FunGen {
  constructor (x) {
    if (x instanceof Function) this.genFn = x
    else if (x[Symbol.iterator]) {
      this.genFn = function * () {
        for (const n of x) yield n
      }
    } else {
      this.genFn = function * () { yield x }
    }
  }

  toGenerator () {
    return this.genFn
  }

  *[Symbol.iterator] () {
    yield* this.genFn()
  }

  until (fn) {
    return new FunGen(function * (...args) {
      const gen = this.genFn(...args)
      let {value, done} = gen.next()
      while (!done && !fn(value)) {
        yield value
        const next = gen.next()
        ;[value, done] = [next.value, next.done]
      }
    }.bind(this))
  }

  filter (fn) {
    return new FunGen(function * (...args) {
      const gen = this.genFn(...args)
      let {value, done} = gen.next()
      while (!done) {
        if (fn(value)) yield value
        const next = gen.next()
        ;[value, done] = [next.value, next.done]
      }
    }.bind(this))
  }

  map (fn) {
    return new FunGen(function * (...args) {
      const gen = this.genFn(...args)
      let {value, done} = gen.next()
      while (!done) {
        yield fn(value)
        const next = gen.next()
        ;[value, done] = [next.value, next.done]
      }
    }.bind(this))
  }

  reduce (fn, startValue) {
    let reducedValue = startValue
    const gen = this.genFn()
    let {value, done} = gen.next()
    while (!done) {
      reducedValue = fn(reducedValue, value)
      const next = gen.next()
      ;[value, done] = [next.value, next.done]
    }
    return reducedValue
  }

  first (n) {
    return new FunGen(function * (...args) {
      const gen = this.genFn(...args)
      for (let i = 0; i < n; i++) yield gen.next().value
    }.bind(this))
  }

  seed (...args) {
    return new FunGen(function * () {
      yield* this.genFn(...args)
    }.bind(this))
  }

  then (next) {
    return new FunGen(function * (...args) {
      yield* this.genFn(...args)
      yield* new FunGen(next).genFn(...args)
    }.bind(this))
  }

  find (fn) {
    const gen = this.genFn()
    let {value, done} = gen.next()
    while (!done) {
      if (fn(value)) return value
      const next = gen.next()
      ;[value, done] = [next.value, next.done]
    }
    return null
  }

  skip (n) {
    return new FunGen(function * (...args) {
      const gen = this.genFn(...args)
      for (let i = 0; i < n; i++) gen.next()
      yield* gen
    }.bind(this))
  }

  get (n) {
    const gen = this.genFn()
    for (let i = 0; i < n - 1; i++) gen.next()
    return gen.next().value
  }

  forEach (fn) {
    for (const x of this) fn(x)
    return this
  }

  log () {
    for (const x of this) console.log(x)
  }
}

const isPrime = n => {
  const isDivisibleBy = x => n !== x && n % x === 0

  if (isDivisibleBy(2)) return false

  for (let x = 3; x <= n / x; x += 2) {
    if (isDivisibleBy(x)) return false
  }
  return true
}

FunGen.count = (from = 1, by = 1) => {
  return new FunGen(function * () {
    let x = from
    while (true) {
      yield x
      x += by
    }
  })
}

FunGen.range = (start, end, by = 1) => {
  const fn = by > 0 ? x => x >= end : x => x <= end
  return FunGen.count(start, by).until(fn)
}

FunGen.primes = () => {
  return new FunGen(function * () {
    yield 2
    let n = 3
    while (true) {
      if (isPrime(n)) yield n
      n += 2
    }
  })
}

FunGen.primes.isPrime = isPrime

FunGen.feedBack = fn => {
  return new FunGen(function * (seed) {
    let value = seed
    while (true) {
      yield value
      value = fn(value)
    }
  })
}

module.exports = FunGen
