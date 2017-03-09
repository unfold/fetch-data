let promises
let resolving = false

export const registerRequestPromise = createRequestPromise => {
  if (resolving) {
    const promise = createRequestPromise()

    if (promise) {
      promises.push(promise)
    }
  }
}

const performIteration = async (resolver, iterations, maxIterations) => {
  promises = []
  let result = resolver()

  if (iterations < maxIterations && promises.length > 0) {
    await Promise.all(promises)

    result = performIteration(resolver, iterations + 1, maxIterations)
  }

  return result
}

export const resolveRequestPromises = async (resolver, { maxIterations = 1 } = {}) => {
  resolving = true
  const result = await performIteration(resolver, 0, maxIterations)
  resolving = false

  return result
}
