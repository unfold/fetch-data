import retry from 'retry'

import {
  createAsyncActionTypes,
  createRequest,
  decodeResponseBody,
  getActionRequestOptions,
} from './utils'

const UNAUTHORIZED_STATUS = 403

const nowAsString = date => (date || new Date()).toISOString()

const createFetchMiddleware = () => () => next => async action => {
  const options = getActionRequestOptions(action)

  if (!options) {
    return next(action)
  }

  const { requestType, successType, failureType, retryType } = createAsyncActionTypes(action.type)
  const request = createRequest(options)
  const operation = retry.operation(options.retry || { retries: 0 })

  next({ ...action, type: requestType })

  const promise = new Promise((resolve, reject) => {
    operation.attempt(async retries => {
      try {
        const response = await fetch(request)
        const { status } = response
        const data = await decodeResponseBody(response)
        const error = response.ok ? null : data || new Error(response.statusText)
        const completedAt = nowAsString()

        // Success
        if (!error) {
          resolve({ ...action, type: successType, completedAt, status, data })
          return
        }

        // Unrecoverable error
        if (status === UNAUTHORIZED_STATUS) {
          reject({ ...action, type: failureType, completedAt, status, error })
          return
        }

        // Retry
        if (operation.retry(error)) {
          next({ ...action, type: retryType, retries, status, error })
          return
        }

        // Failure
        reject({ ...action, type: failureType, completedAt, retries, status, error })
      } catch (error) {
        // Network error
        reject({ ...action, type: failureType, completedAt: nowAsString(), error })
      }
    })
  })

  return promise
    .then(next, next)
}

export default createFetchMiddleware
