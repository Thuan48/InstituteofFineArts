import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from '../../Redux/User/Action'
import { getAllExhibitions } from '../../Redux/Exhibition/Action'
import { getAllExhibitionSubmissions } from '../../Redux/ExhibitionSubmission/Action'
import { getToken } from '../../utils/tokenManager'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Card, CardContent, Grid, Alert, Dialog, DialogContent, Pagination } from '@mui/material'

const Exhibition = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = getToken()
  const [exhibitionPage, setExhibitionPage] = useState(1)
  const [exhibitionPageSize] = useState(6)
  const [submissionPage, setSubmissionPage] = useState(1)
  const [submissionPageSize] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedExhibitionSubmissions, setSelectedExhibitionSubmissions] = useState([])

  const { currentUser } = useSelector((state) => state.users)
  const exhibitions = useSelector((state) => state.exhibitions.exhibitions)
  const exhibitionSubmissions = useSelector((state) => state.exhibitionSubmissions.exhibitionSubmissions)

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
      dispatch(getAllExhibitions(exhibitionPage, exhibitionPageSize))
      dispatch(getAllExhibitionSubmissions(submissionPage, submissionPageSize))
    } else {
      navigate('/login')
    }
  }, [token, dispatch, navigate, exhibitionPage, exhibitionPageSize, submissionPage, submissionPageSize])

  if (currentUser && currentUser.role !== 'STUDENT') {
    return (
      <Container style={{ marginTop: '2rem' }}>
        <Typography variant="h6">This page is for students only.</Typography>
      </Container>
    )
  }

  const userExhibitionSubmissions = exhibitionSubmissions.filter(
    (sub) => sub.submission.userId === currentUser?.userId
  )

  const userExhibitionIds = new Set(
    userExhibitionSubmissions.map((sub) => sub.exhibitionId)
  )

  const userExhibitions = exhibitions.filter((exhibition) =>
    userExhibitionIds.has(exhibition.exhibitionId)
  )

  const handleExhibitionClick = (exhibitionId) => {
    const submissions = exhibitionSubmissions.filter(
      (sub) => sub.exhibitionId === exhibitionId && sub.submission.userId === currentUser?.userId
    )
    setSelectedExhibitionSubmissions(submissions)
    setOpenDialog(true)
  }

  const handleExhibitionPageChange = (event, value) => {
    setExhibitionPage(value)
  }

  const handleSubmissionPageChange = (event, value) => {
    setSubmissionPage(value)
  }

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH

  return (
    <Container style={{ marginTop: '2rem', marginLeft: '8rem' }}>
      <Typography variant="h4" color="black" gutterBottom>
        My Exhibitions
      </Typography>
      {userExhibitions.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {userExhibitions.slice((exhibitionPage - 1) * exhibitionPageSize, exhibitionPage * exhibitionPageSize).map((exhibition) => (
              <Grid item xs={12} md={8} key={exhibition.exhibitionId}>
                <Card style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => handleExhibitionClick(exhibition.exhibitionId)}>
                  <CardContent>
                    <img
                      src={`${imageLink}/${exhibition.image || '10.png'}`}
                      alt="Exhibition Image"
                      style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {exhibition.name || 'Exhibition Name'}
                    </Typography>
                    <Typography variant="body2">
                      Date: {exhibition.date || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Description: {exhibition.description || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Status: {exhibition.status || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(userExhibitions.length / exhibitionPageSize)}
            page={exhibitionPage}
            onChange={handleExhibitionPageChange}
            style={{ marginTop: '1rem' }}
          />
        </>
      ) : (
        <Alert severity="info" style={{ margin: '1rem auto', textAlign: 'center', maxWidth: '50%' }}>
          You haven't participated in any exhibitions.
        </Alert>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h5" color="black" gutterBottom>
            My Submissions
          </Typography>
          {selectedExhibitionSubmissions.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {selectedExhibitionSubmissions.slice((submissionPage - 1) * submissionPageSize, submissionPage * submissionPageSize).map((submission) => (
                  <Grid item xs={12} md={8} key={submission.exhibitionSubmissionId}>
                    <Card style={{ marginBottom: '1rem' }}>
                      <CardContent>
                        <img
                          src={`${imageLink}/${submission.submission.filePath || '10.png'}`}
                          alt="Submission Image"
                          style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {submission.submission.title || 'Submission Title'}
                        </Typography>
                        <Typography variant="body2">
                          Price: ${submission.price}
                        </Typography>
                        <Typography variant="body2">
                          Status: {submission.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(selectedExhibitionSubmissions.length / submissionPageSize)}
                page={submissionPage}
                onChange={handleSubmissionPageChange}
                style={{ marginTop: '1rem' }}
              />
            </>
          ) : (
            <Alert severity="info" style={{ margin: '1rem auto', textAlign: 'center', maxWidth: '50%' }}>
              No submissions found for this exhibition.
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default Exhibition