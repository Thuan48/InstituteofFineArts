import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Button from "@mui/material/Button"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Menu, MenuItem } from '@mui/material'
import { logout } from "../Redux/Auth/Action"
import { getToken } from "../utils/tokenManager"
import { fetchCurrentUser } from "../Redux/User/Action"
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const HomeAppBar = () => {
  const { currentUser } = useSelector((state) => state.users)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const token = getToken()

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token));
      const interval = setInterval(() => {
        dispatch(fetchCurrentUser(token));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  const handleUserClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const toggleMenu = () => {
    if (currentUser?.role === "ADMIN") navigate("/admin/dashboard")
    else if (currentUser?.role === "STUDENT") navigate("/student/dashboard")
    else if (currentUser?.role === "MANAGER") navigate("/manager/dashboard")
    else if (currentUser?.role === "STAFF") navigate("/staff/dashboard")
  }

  const handleLogout = () => {
    handleMenuClose()
    dispatch(logout())
    navigate("/login")
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  return (
    <AppBar position="fixed" sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }} className="home-appbar">
      <Toolbar>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          <IconButton onClick={toggleMenu} className="menu-button" sx={{ color: darkMode ? '#fff' : '#000' }}>
            <MenuIcon />
          </IconButton>
        </motion.div>
        <Button color="inherit" sx={{ mr: 2 }} onClick={() => navigate("/")}>Home</Button>
        <Button color="inherit" onClick={() => navigate("/exhibition")}>Exhibitions</Button>
        <Button color="inherit" onClick={() => navigate("/aboutus")}>About Us</Button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {token ? (
            <>
              <Typography variant="h6" className="app-title" onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                {currentUser?.name || "Home"}
              </Typography>
              {currentUser?.profileImage ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Avatar alt={currentUser.name} src={`${imageLink}${currentUser.profileImage}`} className="user-avatar" />
                </motion.div>
              ) : (
                <Avatar>{currentUser?.name?.[0] || "U"}</Avatar>
              )}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default HomeAppBar