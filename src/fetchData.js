import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getActionRequestOptions, getRequestState } from './utils'

const defaultGetRequestId = ({ requests }, id) => requests[id]

const fetchData = (
  mapPropsToAction,
  mapPropsToRequest,
  getRequestById = defaultGetRequestId,
) => WrappedComponent => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const getRequest = (state, props) => {
    if (mapPropsToRequest) {
      return mapPropsToRequest(state, props)
    }

    const action = mapPropsToAction(props)
    const options = getActionRequestOptions(action)
    const request = getRequestById(state, options.id)

    return request
  }

  class FetchData extends Component {
    static displayName = `FetchData(${displayName})`

    static contextTypes = {
      registerDependency: PropTypes.func,
    }

    static propTypes = {
      dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
      request: PropTypes.object,
    }

    componentWillMount() {
      const { registerDependency } = this.context

      if (registerDependency) {
        registerDependency(this.dispatchIfNeeded(this.props))
      }
    }

    componentDidMount() {
      this.dispatchIfNeeded(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.dispatchIfNeeded(nextProps)
    }

    dispatchIfNeeded(props) {
      const { request } = props

      return !request ? this.refetch(props) : null
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

  return connect(
    (state, props) => {
      const request = getRequest(state, props)
      const { error, loading } = getRequestState(request)

      return {
        request,
        error,
        loading,
      }
    }
  )(FetchData)
}

export default fetchData
