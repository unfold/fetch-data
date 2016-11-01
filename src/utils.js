import { stringify } from 'qs'
import { FETCH } from './index'

const ACCEPT_HEADER = 'Accept'
const AUTHORIZATION_HEADER = 'Authorization'
const CONTENT_TYPE_HEADER = 'Content-Type'
const JSON_TYPE = 'application/json'

export const encodeRequestBody = (data, contentType) => {
  if (typeof data === 'undefined') {
    return null
  }

  if (contentType.includes(JSON_TYPE)) {
    return JSON.stringify(data)
  }

  return data
}

export const decodeResponseBody = async response => {
  const contentType = response.headers.get(CONTENT_TYPE_HEADER)

  if (contentType.includes(JSON_TYPE)) {
    return response.json()
  }

  return response.text()
}

export const createAsyncActionTypes = type => ({
  requestType: `${type}`,
  successType: `${type}_SUCCESS`,
  failureType: `${type}_FAILURE`,
  retryType: `${type}_RETRY`,
})

export const createUrl = ({ url, query }) => (
  query ? `${url}?${stringify(query)}` : url
)

export const createRequest = ({ url, query, data, bearerToken, ...options }) => {
  const headers = new Headers({ [ACCEPT_HEADER]: JSON_TYPE, ...options.headers })
  const contentType = headers.get(CONTENT_TYPE_HEADER) || JSON_TYPE
  const body = options.body || encodeRequestBody(data, contentType)

  if (body) {
    headers.set(CONTENT_TYPE_HEADER, contentType)
  }

  if (bearerToken) {
    headers.set(AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
  }

  return new Request(createUrl({ url, query }), {
    ...options,
    headers,
    body,
  })
}

export const getActionRequestOptions = action => action[FETCH]

export const getRequestState = ({ error, completedAt } = { error: null, completedAt: null }) => ({
  error: error || null,
  completed: completedAt != null,
  loading: !completedAt,
})
