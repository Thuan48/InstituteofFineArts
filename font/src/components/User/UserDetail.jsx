import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const UserDetail = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={user.profileImage ? `${import.meta.env.VITE_API_IMAGE_PATH}${user.profileImage}` : null}
            alt="User Image"
            sx={{ width: 150, height: 150, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Email: {user.email}
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Role: {user.role}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Created At: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Updated At: {new Date(user.updatedAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserDetail