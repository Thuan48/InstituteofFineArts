import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllExhibitions, addExhibition, updateExhibition, deleteExhibition, searchExhibitions } from '../../Redux/Exhibition/Action'
import { getAllExhibitionSubmissions, deleteExhibitionSubmission } from '../../Redux/ExhibitionSubmission/Action'
import { Container, Typography, Card, CardContent, Grid, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Pagination } from "@mui/material"

const ListExhibition = () => {
  const dispatch = useDispatch()
  const exhibitions = useSelector(state => state.exhibitions.exhibitions)
  const exhibitionSubmissions = useSelector(state => state.exhibitionSubmissions.exhibitionSubmissions)
  const [openDialog, setOpenDialog] = useState(false)
  const [exhibitionName, setExhibitionName] = useState("")
  const [exhibitionDate, setExhibitionDate] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Upcoming")
  const [selectedExhibition, setSelectedExhibition] = useState(null)
  const [showSubmissions, setShowSubmissions] = useState(false)
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState(null)
  const [exhibitionToDelete, setExhibitionToDelete] = useState(null)
  const [exhibitionToEdit, setExhibitionToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortStatus, setSortStatus] = useState("")
  const [exhibitionPage, setExhibitionPage] = useState(1)
  const [submissionPage, setSubmissionPage] = useState(1)
  const [exhibitionPageSize] = useState(6)
  const [submissionPageSize] = useState(10)

  useEffect(() => {
    dispatch(getAllExhibitions(exhibitionPage, exhibitionPageSize))
    dispatch(getAllExhibitionSubmissions(submissionPage, submissionPageSize))
  }, [dispatch, exhibitionPage, submissionPage, exhibitionPageSize, submissionPageSize])

  const handleAddExhibition = async () => {
    const exhibitionData = {
      name: exhibitionName,
      date: exhibitionDate,
      description: description,
      status: status
    }

    await dispatch(addExhibition(exhibitionData))
    setOpenDialog(false)
    setExhibitionName("")
    setExhibitionDate("")
    setDescription("")
    setStatus("Upcoming")
    dispatch(getAllExhibitions(exhibitionPage, exhibitionPageSize))
  }

  const handleEditExhibition = (exhibition) => {
    setExhibitionToEdit(exhibition)
    setExhibitionName(exhibition.name)
    setExhibitionDate(exhibition.date)
    setDescription(exhibition.description)
    setStatus(exhibition.status)
    setOpenDialog(true)
  }

  const handleUpdateExhibition = async () => {
    const exhibitionData = {
      name: exhibitionName,
      date: exhibitionDate,
      description: description,
      status: status
    }

    await dispatch(updateExhibition(exhibitionToEdit.exhibitionId, exhibitionData))
    setOpenDialog(false)
    setExhibitionToEdit(null)
    setExhibitionName("")
    setExhibitionDate("")
    setDescription("")
    setStatus("Upcoming")
    dispatch(getAllExhibitions(exhibitionPage, exhibitionPageSize))
  }

  const handleSelectExhibition = (exhibitionId) => {
    setSelectedExhibition(exhibitionId)
    setShowSubmissions(true)
  }

  const handleDeleteFromExhibition = (exhibitionSubmissionId) => {
    setSubmissionToDelete(exhibitionSubmissionId)
    setConfirmDeleteDialog(true)
  }

  const confirmDeleteSubmission = async () => {
    await dispatch(deleteExhibitionSubmission(submissionToDelete))
    setConfirmDeleteDialog(false)
    setSubmissionToDelete(null)
    dispatch(getAllExhibitionSubmissions(submissionPage, submissionPageSize))
  }

  const handleDeleteExhibition = (exhibitionId) => {
    setExhibitionToDelete(exhibitionId)
    setConfirmDeleteDialog(true)
  }

  const confirmDeleteExhibition = async () => {
    await dispatch(deleteExhibition(exhibitionToDelete))
    setConfirmDeleteDialog(false)
    setExhibitionToDelete(null)
    dispatch(getAllExhibitions(exhibitionPage, exhibitionPageSize))
  }

  const handleSearch = () => {
    dispatch(searchExhibitions(searchTerm))
  }

  const handleSort = (e) => {
    setSortStatus(e.target.value)
  }

  const handleExhibitionPageChange = (event, value) => {
    setExhibitionPage(value)
  }

  const handleSubmissionPageChange = (event, value) => {
    setSubmissionPage(value)
  }

  const selectedExhibitionSubmissions = exhibitionSubmissions.filter(es => es.exhibitionId === selectedExhibition)

  const sortedExhibitions = exhibitions.sort((a, b) => {
    const statusOrder = ["Upcoming", "Ongoing", "Closed"]
    const sortOrder = sortStatus === "asc" ? 1 : -1
    return (statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)) * sortOrder
  })

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH

  return (
    <Container style={{ marginTop: "2rem", marginLeft: "8rem" }}>
      <Typography variant="h4" color='black' gutterBottom>
        Exhibitions
      </Typography>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <TextField
          label="Sort by Status"
          select
          value={sortStatus}
          onChange={handleSort}
          style={{ width: '200px' }}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Exhibition
        </Button>
      </div>
      {sortedExhibitions.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {sortedExhibitions.slice((exhibitionPage - 1) * exhibitionPageSize, exhibitionPage * exhibitionPageSize).map((exhibition) => (
              <Grid item xs={12} sm={6} md={4} key={exhibition.exhibitionId}>
                <Card
                  style={{ marginBottom: "1rem", cursor: "pointer" }}
                  onClick={() => handleSelectExhibition(exhibition.exhibitionId)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exhibition.name || "Exhibition Name"}
                    </Typography>
                    <Typography variant="body2">
                      Date: {exhibition.date || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Description: {exhibition.description || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Status: {exhibition.status || "N/A"}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteExhibition(exhibition.exhibitionId)
                      }}
                      style={{ marginTop: "1rem" }}
                    >
                      Delete Exhibition
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditExhibition(exhibition)
                      }}
                      style={{ marginTop: "1rem", marginLeft: "10px" }}
                    >
                      Edit Exhibition
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(sortedExhibitions.length / exhibitionPageSize)}
            page={exhibitionPage}
            onChange={handleExhibitionPageChange}
            style={{ marginTop: "1rem" }}
          />
        </>
      ) : (
        <Alert severity="info" style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}>
          No exhibitions found.
        </Alert>
      )}
      {showSubmissions && selectedExhibition && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="h5" color='black' gutterBottom>
            Submissions in Exhibition
          </Typography>
          {selectedExhibitionSubmissions.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {selectedExhibitionSubmissions.slice((submissionPage - 1) * submissionPageSize, submissionPage * submissionPageSize).map((submission) => (
                  <Grid item xs={12} sm={6} md={4} key={submission.exhibitionSubmissionId}>
                    <Card style={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <img
                          src={`${imageLink}/${submission.submission.filePath || "placeholder.jpg"}`}
                          alt="Submission Image"
                          style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "1rem" }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {submission.submission.title || "Submission Title"}
                        </Typography>
                        <Typography variant="body2">
                          Submitted by: {submission.submission.user?.name || `User ${submission.submission.userId}`}
                        </Typography>
                        <Typography variant="body2">
                          Price: ${submission.price}
                        </Typography>
                        <Typography variant="body2">
                          Status: {submission.status}
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteFromExhibition(submission.exhibitionSubmissionId)}
                          style={{ marginTop: "1rem" }}
                        >
                          Remove from Exhibition
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(selectedExhibitionSubmissions.length / submissionPageSize)}
                page={submissionPage}
                onChange={handleSubmissionPageChange}
                style={{ marginTop: "1rem" }}
              />
            </>
          ) : (
            <Alert severity="info" style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}>
              No submissions found for this exhibition.
            </Alert>
          )}
        </div>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{exhibitionToEdit ? "Edit Exhibition" : "Add New Exhibition"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Exhibition Name"
            fullWidth
            value={exhibitionName}
            onChange={(e) => setExhibitionName(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Exhibition Date"
            type="date"
            fullWidth
            value={exhibitionDate}
            onChange={(e) => setExhibitionDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Status"
            fullWidth
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginBottom: "1rem" }}
          >
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={exhibitionToEdit ? handleUpdateExhibition : handleAddExhibition} color="primary">
            {exhibitionToEdit ? "Update" : "Add"}
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            {submissionToDelete
              ? "Are you sure you want to remove this submission from the exhibition?"
              : "Are you sure you want to delete this exhibition?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={submissionToDelete ? confirmDeleteSubmission : confirmDeleteExhibition} color="primary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDeleteDialog(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ListExhibition