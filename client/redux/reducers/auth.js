import axios from 'axios'
import { history } from '../index'

const initialState = {
  email: '',
  password: '',
  token: '',
  user: {}
}

const SET_EMAIL = 'SET_EMAIL'
const SET_PASSWORD = 'SET_PASSWORD'
const SET_TOKEN = 'SET_TOKEN'
const SYSTEM_WELCOME = 'SYSTEM_WELCOME'

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.email }
    case SET_PASSWORD:
      return { ...state, password: action.password }
    case SET_TOKEN:
      return { ...state, token: action.token, user: action.user, password: '' }
    case SYSTEM_WELCOME:
      return { ...state, token: action.token, user: action.user, password: '' }
    default:
      return state
  }
}

export const setEmail = (email) => {
  return { type: SET_EMAIL, email }
}

export const setPassword = (password) => {
  return { type: SET_PASSWORD, password }
}

export const signIn = () => {
  return (dispatch, getState) => {
    const { email, password } = getState().auth
    console.log(email, password)
    axios
      .post('/api/v1/login', { email, password })
      .then(({ data }) => dispatch({ type: SET_TOKEN, token: data.token, user: data.user }))
    // eslint-disable-next-line no-restricted-globals
    history.push('/dashboard')
  }
}

export const trySignIn = () => {
  return (dispatch) => {
    axios('/api/v1/login').then(({ data }) =>
      dispatch({ type: SYSTEM_WELCOME, token: data.token, user: data.user }))
  }
}
