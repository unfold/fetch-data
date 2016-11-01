import { createAsyncActionTypes } from './utils'

const defaultMapActionToEntities = (action, mapEntityToId) => {
  const data = [].concat(action.data)

  return data.reduce((entities, entity) => ({
    ...entities,
    [mapEntityToId(entity)]: entity,
  }), {})
}

const defaultMapTypeToSuccessTypes = type => {
  const types = Array.isArray(type) ? type : [type]

  return types.map(requestType => {
    const { successType } = createAsyncActionTypes(requestType)

    return successType
  })
}

const defaultMapEntityToId = ({ id }) => id

const createEntityReducer = (
  type,
  mapActionToEntities = defaultMapActionToEntities,
  mapTypeToSuccessTypes = defaultMapTypeToSuccessTypes,
  mapEntityToId = defaultMapEntityToId,
) => {
  const successTypes = mapTypeToSuccessTypes(type)

  return (state = {}, action) => {
    if (!successTypes.includes(action.type)) {
      return state
    }

    const entities = mapActionToEntities(action, mapEntityToId)

    return {
      ...state,
      ...entities,
    }
  }
}

export default createEntityReducer
