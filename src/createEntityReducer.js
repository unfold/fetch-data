import { createAsyncActionTypes } from './utils'

const defaultMapActionToEntities = action => {
  const data = [].concat(action.data)

  return data.reduce((entities, entity) => ({
    ...entities,
    [entity.id]: entity,
  }), {})
}

const defaultMapTypeToSuccessTypes = type => {
  const types = Array.isArray(type) ? type : [type]

  return types.map(requestType => {
    const { successType } = createAsyncActionTypes(requestType)

    return successType
  })
}

const createEntityReducer = (
  type,
  mapActionToEntities = defaultMapActionToEntities,
  mapTypeToSuccessTypes = defaultMapTypeToSuccessTypes
) => {
  const successTypes = mapTypeToSuccessTypes(type)

  return (state = {}, action) => {
    if (!successTypes.includes(action.type)) {
      return state
    }

    const entities = mapActionToEntities(action)

    return {
      ...state,
      ...entities,
    }
  }
}

export default createEntityReducer
