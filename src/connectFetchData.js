import { compose } from 'redux'
import { connect } from 'react-redux'
import fetchData from './fetchData'

const connectFetchData = ({
  mapStateToProps,
  mapDispatchToProps,
  mapPropsToAction,
  mapPropsToRequest,
  mergeProps,
  options = {},
} = {}) => {
  const { skipFetch, forceFetch, ...connectOptions } = options
  const withConnect = connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)

  if (mapPropsToAction) {
    const withFetchData = fetchData({ mapPropsToAction, mapPropsToRequest, skipFetch, forceFetch })

    return compose(withFetchData, withConnect)
  }

  return withConnect
}

export default connectFetchData
