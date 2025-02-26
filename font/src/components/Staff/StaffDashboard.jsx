import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, fetchCurrentUser } from "../../Redux/User/Action"
import { getAllCompetitions, addCompetition, updateCompetition, deleteCompetition, searchCompetitions } from "../../Redux/Competition/Action"
import { getAllSubmissions } from "../../Redux/Submissions/Action"
import { getToken } from "../../utils/tokenManager"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Card, CardContent, Grid, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Pagination, Avatar } from "@mui/material"
import { Pagination as MuiPagination } from "@mui/material";
import { addEvaluation, updateEvaluation, getAllEvaluations } from "../../Redux/Evaluation/Action";

const StaffDashboard = () => {
  const { users, currentUser } = useSelector((state) => state.users)
  const { competitions, competitionsTotal } = useSelector((state) => state.competitions)
  const submissions = useSelector((state) => state.submissions.submissions)
  const evaluations = useSelector(state => state.evaluations.evaluations);
  const dispatch = useDispatch()
  const token = getToken()
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState(null)
  const [competitionData, setCompetitionData] = useState({ title: '', startDate: '', endDate: '', description: '', awardsDescription: '', rules: '', image: null })
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(3)
  const [errors, setErrors] = useState({})
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false)
  const [subPage, setSubPage] = useState(1);
  const subPageSize = 3;
  const [openEvalDialog, setOpenEvalDialog] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [evaluationScore, setEvaluationScore] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
      dispatch(getAllCompetitions(page, pageSize))
      dispatch(getAllSubmissions())
      dispatch(getAllEvaluations(1, 10))
    } else {
      navigate("/login")
    }
    dispatch(fetchUsers())
  }, [token, dispatch, page, pageSize])

  useEffect(() => {
    if (currentUser && currentUser.role !== "STAFF") {
      navigate("/")
    }
  }, [currentUser])

  const validateDates = () => {
    const now = new Date()
    const startDate = new Date(competitionData.startDate)
    const endDate = new Date(competitionData.endDate)
    let tempErrors = {}

    if (startDate < now) {
      tempErrors.startDate = "Start date cannot be in the past."
    }
    if (endDate < startDate) {
      tempErrors.endDate = "End date cannot be before start date."
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleAddCompetition = () => {
    if (validateDates()) {
      const formData = new FormData()
      formData.append('title', competitionData.title)
      formData.append('startDate', competitionData.startDate)
      formData.append('endDate', competitionData.endDate)
      formData.append('description', competitionData.description)
      formData.append('awardsDescription', competitionData.awardsDescription)
      formData.append('rules', competitionData.rules)
      formData.append('status', 'Close')
      formData.append('createdBy', currentUser.userId)
      if (competitionData.image) {
        formData.append('image', competitionData.image)
      }

      dispatch(addCompetition(formData))
      setOpenDialog(false)
      setCompetitionData({ title: '', startDate: '', endDate: '', description: '', awardsDescription: '', rules: '', image: null })
    }
  }

  const handleEditCompetition = (competition) => {
    setSelectedCompetition(competition)
    setCompetitionData({
      ...competition,
      startDate: competition.startDate.split('T')[0],
      endDate: competition.endDate.split('T')[0],
      image: competition.image ? `${imageLink}/${competition.image}` : null
    })
    setOpenDialog(true)
  }

  const handleUpdateCompetition = () => {
    if (validateDates()) {
      const formData = new FormData()
      formData.append('title', competitionData.title)
      formData.append('startDate', competitionData.startDate)
      formData.append('endDate', competitionData.endDate)
      formData.append('description', competitionData.description)
      formData.append('awardsDescription', competitionData.awardsDescription)
      formData.append('rules', competitionData.rules)
      formData.append('status', 'Close')
      formData.append('createdBy', currentUser.userId)
      if (competitionData.image && typeof competitionData.image !== 'string') {
        formData.append('image', competitionData.image)
      }

      dispatch(updateCompetition(selectedCompetition.competitionId, formData))
      setOpenDialog(false)
      setSelectedCompetition(null)
      setCompetitionData({ title: '', startDate: '', endDate: '', description: '', awardsDescription: '', rules: '', image: null })
    }
  }

  const handleDeleteCompetition = (competitionId) => {
    if (window.confirm("Are you sure you want to delete this competition?")) {
      dispatch(deleteCompetition(competitionId))
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchCompetitions(searchTerm, page, pageSize))
    } else {
      dispatch(getAllCompetitions(page, pageSize))
    }
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleViewSubmissions = (competitionId) => {
    setSelectedCompetition(competitionId)
    setSubPage(1);
    setOpenSubmissionsDialog(true)
  }

  const handleAddEvaluation = (submission) => {
    setCurrentSubmission(submission);
    setEvaluationScore("");
    setOpenEvalDialog(true);
  };

  const handleSubmitEvaluation = () => {
    const evaluationData = {
      submissionId: currentSubmission.submissionId,
      staffId: currentUser.userId,
      score: parseInt(evaluationScore) || 0,
      remarks: "string",
      evaluationDate: new Date().toISOString(),
      status: "Reviewed"
    };
    const existingEval = (evaluations || []).find(ev => ev.submissionId === currentSubmission.submissionId);
    if (existingEval) {
      dispatch(updateEvaluation(existingEval.evaluationId, evaluationData));
    } else {
      dispatch(addEvaluation(evaluationData));
    }
    setOpenEvalDialog(false);
  };

  const filteredSubmissions = submissions.filter(sub => sub.competitionId === selectedCompetition);
  const pagedSubmissions = filteredSubmissions.slice((subPage - 1) * subPageSize, subPage * subPageSize);

  const handleSubPageChange = (event, value) => {
    setSubPage(value);
  }

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH

  const existingEval = currentSubmission ? (evaluations || []).find(ev => ev.submissionId === currentSubmission.submissionId) : null;
  const evaluationDialogTitle = existingEval ? "Edit Evaluation" : "Add Evaluation";

  return (
    <Container style={{ marginTop: "2rem", marginLeft: "8rem" }}>
      <Typography variant="h4" color="black" gutterBottom>
        My Competitions
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
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Competition
        </Button>
      </div>
      {competitions.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {competitions.map((comp) => (
              <Grid item xs={12} sm={6} md={4} key={comp.competitionId}>
                <Card style={{ marginBottom: "1rem", cursor: "pointer" }}>
                  <CardContent>
                    <img
                      src={`${imageLink}/${comp.image || 'placeholder.jpg'}`}
                      alt="Competition Image"
                      style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {comp.title || 'Competition Title'}
                    </Typography>
                    <Typography variant="body2">
                      Start Date: {comp.startDate || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      End Date: {comp.endDate || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Description: {comp.description || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Awards: {comp.awardsDescription || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Rules: {comp.rules || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Status: {comp.status || 'N/A'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditCompetition(comp)}
                      style={{ marginTop: '1rem' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteCompetition(comp.competitionId)}
                      style={{ marginTop: '1rem', marginLeft: '10px' }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleViewSubmissions(comp.competitionId)}
                      style={{ marginTop: '1rem', marginLeft: '10px' }}
                    >
                      View Submissions
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(competitionsTotal / pageSize)}
            page={page}
            onChange={handlePageChange}
            style={{ marginTop: '1rem' }}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", margin: "1rem auto", maxWidth: "50%" }}>
          <Alert severity="info">
            You haven't created any competitions.
          </Alert>
          {page > 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(page - 1)}
              style={{ marginTop: "1rem" }}
            >
              Back
            </Button>
          )}
        </div>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedCompetition ? "Edit Competition" : "Add Competition"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={competitionData.title}
            onChange={(e) => setCompetitionData({ ...competitionData, title: e.target.value })}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={competitionData.startDate}
            onChange={(e) => setCompetitionData({ ...competitionData, startDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.startDate}
            helperText={errors.startDate}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={competitionData.endDate}
            onChange={(e) => setCompetitionData({ ...competitionData, endDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.endDate}
            helperText={errors.endDate}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Description"
            fullWidth
            value={competitionData.description}
            onChange={(e) => setCompetitionData({ ...competitionData, description: e.target.value })}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Awards Description"
            fullWidth
            value={competitionData.awardsDescription}
            onChange={(e) => setCompetitionData({ ...competitionData, awardsDescription: e.target.value })}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Rules"
            fullWidth
            value={competitionData.rules}
            onChange={(e) => setCompetitionData({ ...competitionData, rules: e.target.value })}
            style={{ marginBottom: '1rem' }}
          />
          <input
            type="file"
            onChange={(e) => setCompetitionData({ ...competitionData, image: e.target.files[0] })}
            style={{ marginBottom: '1rem' }}
          />
          {competitionData.image && typeof competitionData.image === 'string' && (
            <Avatar
              src={competitionData.image}
              alt="Competition Image"
              style={{ width: '100px', height: '100px', marginBottom: '1rem' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={selectedCompetition ? handleUpdateCompetition : handleAddCompetition} color="primary">
            {selectedCompetition ? "Update" : "Add"}
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openSubmissionsDialog} onClose={() => setOpenSubmissionsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submissions</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {pagedSubmissions.map((submission) => (
              <Grid item xs={12} sm={6} md={4} key={submission.submissionId}>
                <Card style={{ marginBottom: "1rem" }}>
                  <CardContent>
                    {submission.filePath && (
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE_PATH}/${submission.filePath}`}
                        alt="Submission"
                        style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem' }}
                      />
                    )}
                    <Typography variant="h6" gutterBottom>
                      {submission.title || 'Submission Title'}
                    </Typography>
                    <Typography variant="body2">
                      Description: {submission.description || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Status: {submission.status || 'N/A'}
                    </Typography>
                    <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'red' }}>
                      Score: {(evaluations || []).find(ev => ev.submissionId === submission.submissionId)?.score ?? "N/A"}
                    </Typography>
                    {(evaluations || []).find(ev => ev.submissionId === submission.submissionId)
                      ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            const existingEval = (evaluations || []).find(ev => ev.submissionId === submission.submissionId);
                            setCurrentSubmission(submission);
                            setEvaluationScore(existingEval.score);
                            setOpenEvalDialog(true);
                          }}
                          style={{ marginTop: '0.5rem' }}
                        >
                          Edit Evaluation
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddEvaluation(submission)}
                          style={{ marginTop: '0.5rem' }}
                        >
                          Add Evaluation
                        </Button>
                      )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {filteredSubmissions.length > subPageSize && (
            <MuiPagination
              count={Math.ceil(filteredSubmissions.length / subPageSize)}
              page={subPage}
              onChange={handleSubPageChange}
              style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmissionsDialog(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {openEvalDialog && (
        <Dialog open={openEvalDialog} onClose={() => setOpenEvalDialog(false)}>
          <DialogTitle>{evaluationDialogTitle}</DialogTitle>
          <DialogContent>
            <Typography>
              Evaluating submission: {currentSubmission?.title}
            </Typography>
            <TextField
              label="Score"
              type="number"
              fullWidth
              value={evaluationScore}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  setEvaluationScore(value);
                } else if (e.target.value === "") {
                  setEvaluationScore("");
                }
              }}
              inputProps={{ min: 0, max: 100 }}
              style={{ marginTop: '1rem' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitEvaluation} color="primary">Submit Evaluation</Button>
            <Button onClick={() => setOpenEvalDialog(false)} color="secondary">Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  )
}

export default StaffDashboard
