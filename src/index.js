export createEntityReducer from './createEntityReducer'
export createFetchAction from './createFetchAction'
export createFetchMiddleware from './createFetchMiddleware'
export createRequestsReducer from './createRequestsReducer'

export {
  getActionRequestOptions,
  getRequestState,
 } from './utils'

// FIXME: Redux DevTools extension needs to be configured using serializedAction
// for symbols to show up in actions as JSON.stringify strips symbols
export const FETCH = 'fetch' // Symbol('fetch')

export default from './fetchData'
