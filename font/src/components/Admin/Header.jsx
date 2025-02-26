import { Button, Input } from "@mui/material"
import { Search, Bell, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { getToken } from "../../utils/tokenManager"
import { fetchCurrentUser, fetchUsers } from "../../Redux/User/Action"
import { useEffect } from "react"
import '../../styles/admin.css'

const Header = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.users)
  const token = getToken()

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
    }
    dispatch(fetchUsers())
  }, [token, dispatch])

  return (
    <header className="admin-header">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="search" placeholder="Search..." className="search-input" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button className="notification-button">
          <Bell className="h-5 w-5" />
          <span className="notification-badge" />
        </Button>
        <Button className="flex items-center gap-2 text-gray-700">
          <User className="h-5 w-5" />
          <span>{currentUser?.name}</span>
        </Button>
      </div>
    </header>
  )
}

export default Header

