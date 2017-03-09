import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { registerRequestPromise } from './resolver'
import { getActionRequestOptions, getRequestState } from './utils'

const defaultSkipFetch = () => false
const defaultForceFetch = () => false

const fetchData = ({
  mapPropsToAction,
  mapPropsToRequest,
  skipFetch = defaultSkipFetch,
  forceFetch = defaultForceFetch,
}) => WrappedComponent => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  class FetchData extends Component {
    static displayName = `FetchData(${displayName})`

    static propTypes = {
      request: PropTypes.object,
    }

    componentWillMount() {
      registerRequestPromise(() => this.dispatchIfNeeded(this.props))
    }

    componentDidMount() {
      this.dispatchIfNeeded(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.dispatchIfNeeded(nextProps)
    }

    dispatchIfNeeded(props) {
      const { request } = props

      if (forceFetch(props) || (!skipFetch(props) && !request)) {
        return this.refetch(props)
      }

      return null
    }

    refetch = (props = this.props) => (
      props.dispatch(mapPropsToAction(props))
    )

    render() {
      return (
        <WrappedComponent refetch={this.refetch} {...this.props} />
      )
    }
  }

  const getRequest = (state, props) => {
    if (mapPropsToRequest) {
      return mapPropsToRequest(state, props)
    }

    const action = mapPropsToAction(props)
    const options = getActionRequestOptions(action)
    const request = state.requests[options.id]

    return request
  }

  const mapStateToProps = (state, props) => {
    const request = getRequest(state, props)
    const { error, loading } = getRequestState(request)

    return {
      request,
      error,
      loading,
    }
  }

  return connect(mapStateToProps)(FetchData)
}

export default fetchData
