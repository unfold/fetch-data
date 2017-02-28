# Fetch Data

Declarative data fetching for Redux and React.

## Install

#### npm
`npm install --save-dev @unfold/fetch-data`

#### yarn
`yarn add --dev @unfold/fetch-data`

## Usage

### 1. Add middleware to Redux store
```javascript
import { createFetchMiddleware } from '@unfold/fetch-data'

const store = createStore(reducers, initialState, applyMiddleware(thunk, createFetchMiddleware()))
```

### 2. Create reducers for requests and entities
```javascript
import { createRequestsReducer, createEntityReducer } from '@unfold/fetch-data'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  requests: createRequestsReducer(),
  posts: createEntityReducer('LIST_POSTS')
})
```

### 3. Add declarative data requirements to your components
```javascript
import fetchData, { createFetchAction } from '@unfold/fetch-data'

const listPosts = () => createFetchAction({
  url: 'http://api.io/posts'
})

const ProfileContainer = fetchData({
  mapPropsToAction: () => listPosts()
}, {
  mapStateToProps: ({ posts }) => posts
})
```
