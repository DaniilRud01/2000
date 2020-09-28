import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import auth from './auth'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth
  })

export default createRootReducer
