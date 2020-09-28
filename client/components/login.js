import React from 'react'
import { useDispatch } from 'react-redux'
// eslint-disable-next-line import/named
import { setEmail, setPassword, signIn } from '../redux/reducers/auth'

const Login = () => {
  const dispatch = useDispatch()
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              onChange={(e) => dispatch(setEmail(e.target.value))}
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                dispatch(signIn())
              }}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
