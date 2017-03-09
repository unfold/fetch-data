import 'isomorphic-fetch'

export const FETCH = Symbol('fetch')

export connectFetchData from './connectFetchData'
export createEntityReducer from './createEntityReducer'
export createFetchAction from './createFetchAction'
export createFetchMiddleware from './createFetchMiddleware'
export createRequestsReducer from './createRequestsReducer'
export { getActionRequestOptions, getRequestState } from './utils'
export { resolveRequestPromises } from './resolver'

export default from './fetchData'
