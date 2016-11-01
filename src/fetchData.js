import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getActionRequestOptions, getRequestState } from './utils'

const defaultMapStateToProps = () => ({ })
const defaultGetRequestId = ({ requests }, id) => requests[id]
const defaultSkipFetch = () => false
const defaultForceFetch = () => false

const fetchData = ({
  mapStateToProps = defaultMapStateToProps,
  mapPropsToAction,
  mapPropsToDispatch,
  mapPropsToRequest,
  skipFetch = defaultSkipFetch,
  forceFetch = defaultForceFetch,
  getRequestById = defaultGetRequestId,
}) => WrappedComponent => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  class FetchData extends Component {
    static displayName = `FetchData(${displayName})`

    static contextTypes = {
      registerDependency: PropTypes.func,
    }

    static propTypes = {
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
    const request = getRequestById(state, options.id)

    return request
  }

  const mapStateToRequestProps = (state, props) => {
    const request = getRequest(state, props)
    const { error, loading } = getRequestState(request)

    return {
      request,
      error,
      loading,
      ...mapStateToProps(state, props),
    }
  }

  return connect(mapStateToRequestProps, mapPropsToDispatch)(FetchData)
}

export default fetchData
