const {time} = require('./helpers')
const FunGen = require('./FunGen')

time(() => {
  const factorial = x => {
    return FunGen.range(2, x + 1)
      .reduce((product, x) => product * x, 1)
  }

  return factorial(100)
})
