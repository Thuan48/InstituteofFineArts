import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser, changePassword, updateUser } from "../../Redux/User/Action"
import { getToken } from "../../utils/tokenManager"
import HomeAppBar from "../HomeAppBar"
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Key,
  Eye,
  EyeOff,
  Save,
  X,
  Edit,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react"
import "../../styles/proflie.css"

const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.users)
  const [loading, setLoading] = useState(true)
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [error, setError] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [uploadImage, setUploadImage] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (token) {
      dispatch(fetchCurrentUser(token)).then(() => setLoading(false))
    }
  }, [dispatch])

  const handleChangePassword = async () => {
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match")
      setIsSubmitting(false)
      return
    }

    if (oldPassword !== currentUser.password) {
      setError("Old password is incorrect")
      setIsSubmitting(false)
      return
    }

    try {
      await dispatch(changePassword(currentUser.userId, newPassword))
      setSuccessMessage("Password updated successfully!")
      setTimeout(() => {
        setShowChangePasswordForm(false)
        setOldPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        setError("")
        setSuccessMessage("")
      }, 2000)
    } catch (err) {
      setError("Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      await dispatch(updateUser(currentUser.userId, { name, email, uploadImage }))
      setSuccessMessage("User updated successfully!")
      setTimeout(() => {
        setShowUpdateUserForm(false)
        setError("")
        setSuccessMessage("")
      }, 2000)
    } catch (err) {
      setError("Failed to update user")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-indigo-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700">No user data available</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <HomeAppBar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-body">
            <div className="profile-image-section">
              <div className="image-container">
                {currentUser.profileImage ? (
                  <div className="image-wrapper">
                    <div className="profile-image">
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE_PATH}${currentUser.profileImage}`}
                        alt="Profile"
                      />
                    </div>
                    <div className="edit-icon">
                      <Edit />
                    </div>
                  </div>
                ) : (
                  <div className="default-image">
                    <span className="default-initial">
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <div className="edit-icon">
                      <Edit />
                    </div>
                  </div>
                )}
              </div>

              <h2 className="profile-name">{currentUser.name}</h2>
              <p className="profile-email">{currentUser.email}</p>
            </div>

            <div className="profile-details-section">
              <h2 className="details-title">Account Information</h2>
              <div className="details-grid">
                <div className="details-item">
                  <div className="item-icon">
                    <Mail />
                  </div>
                  <div className="item-content">
                    <p className="item-label">Email Address</p>
                    <p className="item-value">{currentUser.email}</p>
                  </div>
                </div>

                <div className="details-item">
                  <div className="item-icon">
                    <Shield />
                  </div>
                  <div className="item-content">
                    <p className="item-label">Role</p>
                    <div className="item-role">
                      <span>{currentUser.role}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                  className="change-password-button"
                >
                  <Key />
                  {showChangePasswordForm ? "Cancel" : "Change Password"}
                </button>

                <button
                  onClick={() => setShowUpdateUserForm(!showUpdateUserForm)}
                  className="change-password-button"
                >
                  <Edit />
                  {showUpdateUserForm ? "Cancel" : "Update User"}
                </button>
              </div>

            </div>
          </div>

          {showChangePasswordForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-header">
                  <h2 className="form-title">
                    <Key />
                    Change Password
                  </h2>
                  <button
                    onClick={() => setShowChangePasswordForm(false)}
                    className="close-button"
                  >
                    <X />
                  </button>
                </div>

                {error && (
                  <div className="form-error">
                    <AlertCircle />
                    <p>{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="form-success">
                    <Check />
                    <p>{successMessage}</p>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleChangePassword()
                  }}
                  className="form-body"
                >
                  <div className="form-group">
                    <label className="form-label">
                      <Key />
                      Current Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="toggle-password"
                      >
                        {showOldPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Key />
                      New Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="toggle-password"
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Key />
                      Confirm New Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="toggle-password"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`submit-button ${isSubmitting ? "submitting" : ""}`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="submit-icon" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="submit-icon" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showUpdateUserForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-header">
                  <h2 className="form-title">
                    <Edit />
                    Update User
                  </h2>
                  <button
                    onClick={() => setShowUpdateUserForm(false)}
                    className="close-button"
                  >
                    <X />
                  </button>
                </div>

                {error && (
                  <div className="form-error">
                    <AlertCircle />
                    <p>{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="form-success">
                    <Check />
                    <p>{successMessage}</p>
                  </div>
                )}

                <form
                  onSubmit={handleUpdateUser}
                  className="form-body"
                >
                  <div className="form-group">
                    <label className="form-label">
                      <Mail />
                      Email Address
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Enter your email"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User />
                      Name
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Edit />
                      Profile Image
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="file"
                        onChange={(e) => setUploadImage(e.target.files[0])}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`submit-button ${isSubmitting ? "submitting" : ""}`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="submit-icon" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="submit-icon" />
                          Update User
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile