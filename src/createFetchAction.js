import { createUrl, FETCH } from './'

const defaultCreateRequestId = (action, options) => createUrl(options)

const createFetchAction = (
  type,
  options,
  action,
  createRequestId = defaultCreateRequestId
) => ({
  type,
  [FETCH]: {
    id: createRequestId(action, options),
    ...options,
  },
  ...action,
})

export default createFetchAction
