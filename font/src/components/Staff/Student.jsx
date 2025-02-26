import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser, fetchUsers, searchUser } from '../../Redux/User/Action'
import { getToken } from '../../utils/tokenManager'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const Student = () => {
  const dispatch = useDispatch()
  const { users, currentUser } = useSelector(state => state.users)
  const token = getToken()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
    } else {
      navigate('/login')
    }
    dispatch(fetchUsers())
  }, [token, dispatch])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchUser(searchTerm))
    } else {
      dispatch(fetchUsers())
    }
  }

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'image', headerName: 'Image', width: 150, renderCell: (params) => (
        params.value
          ? <img src={`${imageLink}${params.value}`} alt="User" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          : "No Image"
      )
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: (params) => (
        <span>{params.value}</span>
      )
    }
  ]

  const rows = users
    .filter(user => user.role === 'STUDENT')
    .map(user => ({
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profileImage
    }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '12rem', marginTop: '2rem' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Students</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
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
        />
      </Box>
    </div>
  )
}

export default Student