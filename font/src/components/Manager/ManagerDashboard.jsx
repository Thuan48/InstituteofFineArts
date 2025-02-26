import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, fetchCurrentUser, fetchUserById, addUser, updateUser, deleteUser, updateRole, searchUser, importExcel } from "../../Redux/User/Action"
import { getToken } from "../../utils/tokenManager"
import { useNavigate } from "react-router-dom"
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import UserDetail from "../User/UserDetail"

const ManagerDashboard = () => {
  const { users, currentUser, user } = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const token = getToken()
  const navigate = useNavigate()
  const [openDetail, setOpenDetail] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showUpdateUserDialog, setShowUpdateUserDialog] = useState(false)
  const [showUpdateRoleDialog, setShowUpdateRoleDialog] = useState(false)
  const [showMultiRoleDialog, setShowMultiRoleDialog] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'STAFF', password: '' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState("")
  const [multiRole, setMultiRole] = useState("")
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [errors, setErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImportFileName, setSelectedImportFileName] = useState("")

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
    }
    else {
      navigate("/login")
    }
    dispatch(fetchUsers())
  }, [token, dispatch])

  useEffect(() => {
    if (currentUser && currentUser.role !== "MANAGER") {
      navigate("/")
    }
  }, [currentUser])

  const handleViewUser = (id) => {
    dispatch(fetchUserById(id))
    setOpenDetail(true)
  }

  const handleAddUser = () => {
    if (validate()) {
      dispatch(addUser(newUser))
      setNewUser({ name: '', email: '', role: 'STAFF', password: '' })
      setShowAddUserDialog(false)
    }
  }

  const handleUpdateUser = () => {
    if (validateUpdate()) {
      const updateId = selectedUser.id
      dispatch(updateUser(updateId, selectedUser))
      setSelectedUser(null)
      setShowUpdateUserDialog(false)
    }
  }

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
    }
  }

  const handleUpdateRole = () => {
    dispatch(updateRole(selectedUser.id, newRole))
    setSelectedUser(null)
    setShowUpdateRoleDialog(false)
  }

  const handleMultiUpdateRole = () => {
    selectedRowIds.forEach(id => {
      dispatch(updateRole(id, multiRole))
    })
    setSelectedRowIds([])
    setMultiRole("")
    setShowMultiRoleDialog(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target
    setSelectedUser({ ...selectedUser, [name]: value })
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchUser(searchTerm))
    } else {
      dispatch(fetchUsers())
    }
  }

  const handleImportExcel = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        alert("Only Excel (.xlsx) files are accepted.")
        setSelectedImportFileName("")
        return
      }
      setSelectedImportFileName(file.name)
      if (window.confirm("Are you sure you want to import the selected file?")) {
        dispatch(importExcel(file))
      } else {
        setSelectedImportFileName("")
      }
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validate = () => {
    let tempErrors = {}
    tempErrors.name = newUser.name ? "" : "Name is required."
    tempErrors.email = newUser.email ? (validateEmail(newUser.email) ? "" : "Email is not valid.") : "Email is required."
    tempErrors.role = newUser.role ? "" : "Role is required."
    tempErrors.password = newUser.password ? "" : "Password is required."
    setErrors(tempErrors)
    return Object.values(tempErrors).every(x => x === "")
  }

  const validateUpdate = () => {
    let tempErrors = {}
    tempErrors.name = selectedUser?.name ? "" : "Name is required."
    tempErrors.email = selectedUser?.email
      ? (validateEmail(selectedUser.email) ? "" : "Email is not valid.")
      : "Email is required."
    setErrors(tempErrors)
    return Object.values(tempErrors).every(x => x === "")
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'image', headerName: 'Image', width: 150, renderCell: (params) => (
        params.value
          ? <img src={params.value} alt="User" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          : "No Image"
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewUser(params.row.id)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedUser(params.row)
              setShowUpdateUserDialog(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelectedUser(params.row)
              setNewRole(params.row.role)
              setShowUpdateRoleDialog(true)
            }}
          >
            Role
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const rows = users
    .filter(user => user.role === 'STAFF' || user.role === 'STUDENT')
    .map(user => ({
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profileImage ? `${import.meta.env.VITE_API_IMAGE_PATH}${user.profileImage}` : null,
    }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '12rem', marginTop: '2rem' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="contained" color="primary" onClick={() => setShowAddUserDialog(true)}>
            Add User
          </Button>
          {selectedRowIds.length > 0 && (
            <Button variant="contained" color="secondary" onClick={() => setShowMultiRoleDialog(true)}>
              Update Role Selected
            </Button>
          )}
          <Button variant="contained" color="info" onClick={() => document.getElementById('import-file-input').click()}>
            Import Excel
          </Button>
          <input
            id="import-file-input"
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleImportExcel}
          />
          {selectedImportFileName && (
            <div>
              <span style={{ color: 'blue' }}>Selected file: {selectedImportFileName}</span>
              <p style={{ fontStyle: 'italic', color: 'gray' }}>
                File data: Name, Email, Password
              </p>
            </div>
          )}
        </div>
      </div>
      <Box sx={{ height: '100%', width: '100%', marginTop: '1rem' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onRowSelectionModelChange={(selection) => setSelectedRowIds(selection)}
          rowSelectionModel={selectedRowIds}
        />
      </Box>
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <UserDetail user={user} />
        </DialogContent>
      </Dialog>
      <Dialog open={showAddUserDialog} onClose={() => setShowAddUserDialog(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <TextField
              fullWidth
              margin="normal"
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              select
              error={!!errors.role}
              helperText={errors.role}
              sx={{ flex: 1 }}
            >
              <MenuItem value="STAFF">STAFF</MenuItem>
              <MenuItem value="STUDENT">STUDENT</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ flex: 1 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUser} color="primary">
            Add User
          </Button>
          <Button onClick={() => setShowAddUserDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showUpdateUserDialog} onClose={() => setShowUpdateUserDialog(false)}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <Avatar
              src={selectedUser?.uploadImage ? URL.createObjectURL(selectedUser.uploadImage) : `${import.meta.env.VITE_API_IMAGE_PATH}${selectedUser?.image}`}
              alt="User Image"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={selectedUser?.name || ''}
            onChange={handleUpdateInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={selectedUser?.email || ''}
            onChange={handleUpdateInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
            <input
              type="file"
              name="uploadImage"
              onChange={(e) => setSelectedUser({ ...selectedUser, uploadImage: e.target.files[0] })}
            />
          </div>
          {selectedUser?.uploadImage && (
            <div style={{ marginTop: '10px' }}>
              <strong>Selected file:</strong> {selectedUser.uploadImage.name}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateUser} color="primary">
            Update User
          </Button>
          <Button onClick={() => setShowUpdateUserDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showUpdateRoleDialog} onClose={() => setShowUpdateRoleDialog(false)}>
        <DialogTitle>Update Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Role"
            select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="STAFF">STAFF</MenuItem>
            <MenuItem value="STUDENT">STUDENT</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateRole} color="primary">Update Role</Button>
          <Button onClick={() => setShowUpdateRoleDialog(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showMultiRoleDialog} onClose={() => setShowMultiRoleDialog(false)}>
        <DialogTitle>Update Role for Selected Users</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="New Role"
            select
            value={multiRole}
            onChange={(e) => setMultiRole(e.target.value)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="STAFF">STAFF</MenuItem>
            <MenuItem value="STUDENT">STUDENT</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMultiUpdateRole} color="primary">
            Update Role
          </Button>
          <Button onClick={() => setShowMultiRoleDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default ManagerDashboard
