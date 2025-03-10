import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, fetchUsers } from "../../Redux/User/Action";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(true);
  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordStatus = useSelector((state) => state.users?.forgotPasswordStatus);
  const users = useSelector((state) => state.users?.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userExists = users.some(user => user.email === email);
    if (!userExists) {
      setEmailExists(false);
      return;
    }
    setEmailExists(true);
    dispatch(forgotPassword(email));
    setShowCheckEmailMessage(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-gray-600">Enter your email to reset your password</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          {forgotPasswordStatus && (
            <div className={`mb-4 ${forgotPasswordStatus.success ? "text-green-500" : "text-red-500"}`}>
              {forgotPasswordStatus.message}
            </div>
          )}
          {!emailExists && (
            <div className="mb-4 text-red-500">
              Email does not exist.
            </div>
          )}
          {showCheckEmailMessage && (
            <div className="mb-4 text-green-500">
              Please check your email for further instructions.
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

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Submit
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
