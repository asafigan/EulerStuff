const {Runner} = require('./helpers')
const FunGen = require('./FunGen')

const {range} = FunGen

const r = new Runner({
  logBefore: '////////////////////////// Euler #4 ////////////////////////////',
  logAfterEach: ''
})

const isPalindrome = x => {
  const asString = x.toString()
  for (let i = 0; i < asString.length / 2; i++) {
    if (asString[i] !== asString[asString.length - 1 - i]) return false
  }
  return true
}

const isProductOfTwoThreeDigitNumbers = n => {
  return range(999, 100, -1)
    .map(x => n / x)
    .filter(x => Number.isInteger(x))
    .find(x => x / 100 >= 1 && x / 999 <= 1)
}
// faster
const alt_isProductOfTwoThreeDigitNumbers = n => {
  for (const x of range(999, 100, -1)) {
    const i = n / x
    if (Number.isInteger(i) && i / 100 >= 1 && i / 999 <= 1) return true
  }
  return false
}

// generator found online
const palindromes = new FunGen(function * () {
  for (let a = 9; a >= 1; a--) {
    for (let b = 9; b >= 0; b--) {
      for (let c = 9; c >= 0; c--) {
        yield 11 * (9091 * a + 910 * b + 100 * c)
      }
    }
  }
})

r.add(() => {
  return range(999 * 999, 100 * 100, -1)
    .filter(isPalindrome)
    .find(isProductOfTwoThreeDigitNumbers)
})

r.add(() => {
  return range(999 * 999, 100 * 100, -1)
    .filter(isPalindrome)
    .find(alt_isProductOfTwoThreeDigitNumbers)
})

// my fastest solution
r.add(() => {
  return range(999 * 999, 100 * 100, -1)
    .find(x => isPalindrome(x) && alt_isProductOfTwoThreeDigitNumbers(x))
})

r.add(() => {
  for (const x of range(999 * 999, 100 * 100, -1)) {
    if (isPalindrome(x) && alt_isProductOfTwoThreeDigitNumbers(x)) return x
  }
})

// solution found online
r.add(() => {
  const searchSpace = range(999, 100, -1)

  let max = 0

  for (const x of searchSpace) {
    for (const y of searchSpace) {
      if (isPalindrome(x * y)) max = Math.max(max, x * y)
    }
  }

  return max
})

// solution found online
r.add(() => {
  const r1 = range(999, 100, -1)
  const r2 = range(990, 100, -11)

  let max = 0

  for (const x of r1) {
    for (const y of r2) {
      if (isPalindrome(x * y)) max = Math.max(max, x * y)
    }
  }

  return max
})

// solution found online
r.add(() => {
  return palindromes.find(alt_isProductOfTwoThreeDigitNumbers)
})

// fastest example online
r.add(() => {
  for (let a = 9; a >= 1; a--) {
    for (let b = 9; b >= 0; b--) {
      for (let c = 9; c >= 0; c--) {
        // these are all the palindromes with 11 factored out
        const num = 9091 * a + 910 * b + 100 * c
        // this checks if it is multiple of two three digit numbers
        for (let divider = 90; divider >= 10; divider--) {
          // look for divider that can divide
          // and also doesn't make n > 999
          if ((num % divider) === 0 && (num / divider) <= 999) return num * 11 // Found it!
        }
      }
    }
  }
})

// inefficient
// it is the fastest solution but isPalindrome is checked last
r.add(() => {
  return range(999 * 999, 100 * 100, -1)
    .find(x => alt_isProductOfTwoThreeDigitNumbers(x) && isPalindrome(x))
})
