import { getActionRequestOptions } from './utils'

const defaultMapRequestOptionsToId = ({ url }) => url
const defaultMapActionToRequest = action => {
  const request = { ...action }
  delete request.type

  return request
}

const createRequestsReducer = (
  mapRequestOptionsToId = defaultMapRequestOptionsToId,
  mapActionToRequest = defaultMapActionToRequest,
) => (state = {}, action) => {
  const options = getActionRequestOptions(action)

  if (!options) {
    return state
  }

  const id = mapRequestOptionsToId(options)
  const request = mapActionToRequest(action)

  return {
    ...state,
    [id]: request,
  }
}

export default createRequestsReducer
