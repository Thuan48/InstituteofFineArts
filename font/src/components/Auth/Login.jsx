import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../Redux/Auth/Action"
import { useNavigate } from "react-router-dom"
import "../../styles/login.css"
import Cookies from "js-cookie"

const Login = () => {
  const [email, setEmail] = useState(Cookies.get("email") || "")
  const [password, setPassword] = useState(Cookies.get("password") || "")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loginError = useSelector((state) => state.auth.loginError)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }, rememberMe)).then((result) => {
      if (result.success) {
        navigate("/");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          {loginError && (
            <div className="mb-4 text-red-500">
              {loginError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

