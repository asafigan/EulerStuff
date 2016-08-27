const Immutable = require('immutable')

const run = fn => {
  const start = Date.now()
  const answer = fn()
  const time = Date.now() - start
  return {answer, time}
}

const time = fn => {
  console.log('timing:', fn.toString())

  const {answer, time} = run(fn)

  console.log('Time:', time)
  if (answer !== undefined) console.log('Answer:', answer)
  console.log('')
}

const ifDefined = fn => n => {
  if (n !== undefined) fn(n)
}

class Runner {
  constructor (options) {
    this.setOptions(options)
    this.tests = []
    this.hasRun = false
    process.on('beforeExit', () => {
      if (!this.hasRun) this.run()
    })
  }

  setOptions ({
    start = 0,
    end,
    logAfter,
    logBefore,
    logAfterEach,
    logBeforeEach,
    logFunctionBody = true,
    logAnswer = true,
    logTime = true,
    logIfNoAnswer,
    log = (...args) => {
      console.log(...args)
    }
  }) {
    this.options = {
      start,
      end,
      logAfter,
      logBefore,
      logAfterEach,
      logBeforeEach,
      logFunctionBody,
      logAnswer,
      logIfNoAnswer,
      logTime,
      log
    }
  }

  changeOptions ({
    start,
    end,
    logAfter,
    logBefore,
    logAfterEach,
    logBeforeEach,
    logFunctionBody,
    logAnswer,
    logIfNoAnswer,
    logTime,
    log
  }) {
    const inputs = {
      start,
      end,
      logAfter,
      logBefore,
      logAfterEach,
      logBeforeEach,
      logFunctionBody,
      logAnswer,
      logIfNoAnswer,
      logTime,
      log
    }

    // get rid of undefined properties
    let options = {}
    for (const prop in inputs) {
      if (inputs[prop] !== undefined) options[prop] = inputs[prop]
    }

    Object.assign(this.options, options)
  }

  setCommandLineArguments () {
    const args = process.argv.slice(2)

    const options = args.reduce((options, x) => {
      if (x === '-a') {
        return Object.assign(
          {
            logTime: false,
            logFunctionBody: false
          },
          options,
          { logAnswer: true }
        )
      }

      if (x === '-d') {
        return Object.assign(
          options,
          {
            logAfterEach: ''
          }
        )
      }

      if (x === '-s') {
        return Object.assign(
          options,
          {
            logFunctionBody: false,
            logAfterEach: ''
          }
        )
      }

      if (x === '-f') {
        return Object.assign(options, {end: 1})
      }

      if (x === '-t') {
        return Object.assign(
          {
            logFunctionBody: false,
            logAnswer: false
          },
          options,
          {
            logTime: true
          }
        )
      }
    }, {})

    if (Object.keys(options).length) this.setOptions(options)
  }

  add (test) {
    if (test[Symbol.iterator]) {
      for (const t of test) {
        this.add(t)
      }
    }

    if (!(test instanceof Function)) throw new Error('Can only run Functions')

    this.tests.push(test)
  }

  run () {
    this.hasRun = true
    this.setCommandLineArguments()

    const {
      start,
      end,
      logAfter,
      logBefore,
      logAfterEach,
      logBeforeEach,
      logFunctionBody,
      logAnswer,
      logTime,
      logIfNoAnswer,
      log
    } = this.options

    const logIfDefined = ifDefined(log)

    logIfDefined(logBefore)
    this.tests.slice(start, end).forEach(t => {
      logIfDefined(logBeforeEach)

      if (logFunctionBody) log('running:', t.toString())

      const {answer, time} = run(t)

      if (logTime) log('Time:', time)
      if (logAnswer) {
        if (answer !== undefined) log('Answer:', answer)
        else logIfDefined(logIfNoAnswer)
      }

      logIfDefined(logAfterEach)
    })
    logIfDefined(logAfter)
  }
}

Runner.Default = {
  logAfterEach: ''
}

const isPrime = n => {
  const isDivisibleBy = x => n !== x && n % x === 0

  if (isDivisibleBy(2)) return false

  for (let x = 3; x <= n / x; x += 2) {
    if (isDivisibleBy(x)) return false
  }
  return true
}

const primes = () => {
  return Immutable.Seq(function * () {
    yield 2
    let n = 3
    while (true) {
      if (isPrime(n)) yield n
      n += 2
    }
  }())
}

const fibonacci = () => Immutable.Seq(function * () {
  let [a, b] = [1, 1]
  yield a
  yield b

  while (true) {
    let [a, b] = [b, b + a]
    yield b
  }
})

const Count = (start, by) => Immutable.Range(start, Infinity, by)

const Seq = (first, ...rest) => {
  if (first instanceof Function) first = first()
  return Immutable.Seq(first, ...rest)
}

module.exports = {
  time,
  run,
  Runner,
  primes,
  isPrime,
  fibonacci,
  Immutable,
  Seq,
  Range: Immutable.Range,
  Count
}
