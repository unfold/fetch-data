import retry from 'retry'

import {
  createAsyncActionTypes,
  createRequest,
  decodeResponseBody,
  getActionRequestOptions,
} from './utils'

const UNAUTHORIZED_STATUS = 403

const middleware = () => next => async action => {
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

        // Success
        if (!error) {
          resolve({ ...action, type: successType, completed: true, status, data })
          return
        }

        // Unrecoverable error
        if (status === UNAUTHORIZED_STATUS) {
          reject({ ...action, type: failureType, completed: true, status, error })
          return
        }

        // Retry
        if (operation.retry(error)) {
          next({ ...action, type: retryType, retries, status, error })
          return
        }

        // Failure
        reject({ ...action, type: failureType, retries, completed: true, status, error })
      } catch (error) {
        // Network error
        reject({ ...action, type: failureType, completed: true, error })
      }
    })
  })

  return promise
    .then(next, next)
}

export default middleware
