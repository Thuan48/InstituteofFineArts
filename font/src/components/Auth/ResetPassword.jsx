import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../Redux/User/Action";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/login.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetPasswordStatus = useSelector((state) => state.users?.resetPasswordStatus);
  const [userId, setUserId] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const userIdFromParams = searchParams.get("userid");
    const codeFromParams = searchParams.get("code");
    setUserId(userIdFromParams);
    setCode(codeFromParams);
    console.log("userId:", userIdFromParams, "code:", codeFromParams);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordTooShort(true);
      return;
    }
    setPasswordTooShort(false);
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    dispatch(resetPassword(userId, code, newPassword)).then(() => {
      alert("Password reset successfully!");
      navigate("/login");
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">Enter your new password</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          {resetPasswordStatus && (
            <div className={`mb-4 ${resetPasswordStatus.success ? "text-green-500" : "text-red-500"}`}>
              {resetPasswordStatus.message}
            </div>
          )}
          {!passwordMatch && (
            <div className="mb-4 text-red-500">
              Passwords do not match.
            </div>
          )}
          {passwordTooShort && (
            <div className="mb-4 text-red-500">
              Password must be at least 6 characters long.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password:
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Confirm your new password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
