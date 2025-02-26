import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCompetitions, searchCompetitions } from '../../Redux/Competition/Action'
import { getAllAwards } from '../../Redux/Award/ACtion'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Card, CardContent, Grid, Button, Alert, TextField, MenuItem } from "@mui/material"
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const ListCompetition = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { competitions } = useSelector((state) => state.competitions)
  const awards = useSelector((state) => (state.awards && state.awards.awards) || [])
  const [competitionPage, setCompetitionPage] = useState(1)
  const [competitionSearch, setCompetitionSearch] = useState("")
  const [competitionSortOrder, setCompetitionSortOrder] = useState("asc")
  const [statusFilter, setStatusFilter] = useState("")
  const competitionsPerPage = 6

  useEffect(() => {
    dispatch(getAllAwards())
    if (competitionSearch) {
      dispatch(searchCompetitions(competitionSearch, competitionPage, 10))
    } else {
      dispatch(getAllCompetitions(competitionPage, 10))
    }
  }, [dispatch, competitionPage, competitionSearch])

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH

  const filteredCompetitions = competitions.filter(comp =>
    comp.title?.toLowerCase().includes(competitionSearch.toLowerCase()) &&
    (statusFilter ? comp.status === statusFilter : true)
  )

  const sortedCompetitions = filteredCompetitions.slice().sort((a, b) => {
    const aEnd = new Date(a.endDate)
    const bEnd = new Date(b.endDate)
    return competitionSortOrder === "asc" ? aEnd - bEnd : bEnd - aEnd
  })

  const paginatedCompetitions = sortedCompetitions.slice(
    (competitionPage - 1) * competitionsPerPage,
    competitionPage * competitionsPerPage
  )

  return (
    <Container style={{ marginTop: "2rem", marginLeft: "8rem" }}>
      <div style={{ display: "flex", gap: "3rem", marginLeft: '5rem', marginBottom: "0.5rem", alignItems: "center" }}>
        <div style={{ margin: "1rem 0" }}>
          <TextField
            label="Search Competitions"
            variant="outlined"
            size="small"
            value={competitionSearch}
            onChange={(e) => {
              setCompetitionSearch(e.target.value)
              setCompetitionPage(1)
            }}
            fullWidth
          />
        </div>
        <div >
          <TextField
            label="Status"
            variant="outlined"
            size="small"
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: '120px', width: 'auto', minWidth: '85px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Close">Close</MenuItem>
          </TextField>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setCompetitionSortOrder(prev => prev === "asc" ? "desc" : "asc")
            setCompetitionPage(1)
          }}
        >
          Date {competitionSortOrder === "asc" ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
        </Button>

      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
        <Button
          onClick={() => setCompetitionPage(prev => Math.max(prev - 1, 1))}
          disabled={competitionPage === 1}
          style={{ marginRight: "1rem" }}
        >
          <FaArrowLeft size={20} />
        </Button>
        {filteredCompetitions.length > 0 ? (
          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {paginatedCompetitions.map((comp) => {
                const compAwards = awards.filter(
                  award => parseInt(award.competitionId, 10) === parseInt(comp.competitionId, 10)
                )

                const sortedAwards = compAwards.length > 0
                  ? [...compAwards].sort((a, b) => b.prizeMoney - a.prizeMoney)
                  : []
                const highestAward = sortedAwards.length > 0 ? sortedAwards[0] : undefined

                return (
                  <Grid item xs={12} sm={6} md={4} key={comp.competitionId}>
                    <Card
                      onClick={() => navigate(`/manager/competitions/${comp.competitionId}/submissions`)}
                      style={{ marginBottom: "1rem", cursor: "pointer" }}
                    >
                      <CardContent>
                        {comp.image && (
                          <img src={`${imageLink}/${comp.image}`} alt="Competition" style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '1rem' }} />
                        )}
                        <Typography variant="h6">
                          {comp.title || "Competition Title"}
                        </Typography>
                        <Typography variant="body2">
                          Description: {comp.description || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Created By: {comp.createdBy || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Start Date: {comp.startDate || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          End Date: {comp.endDate || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Awards Description: {comp.awardsDescription || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Rules: {comp.rules || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Status: {comp.status || "N/A"}
                        </Typography>
                        {highestAward ? (
                          <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
                            Top Award Recipient: {highestAward.user?.name || `User ${highestAward.userId}`} - ${highestAward.prizeMoney}
                          </Typography>
                        ) : (
                          <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
                            No awards available for this competition.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </div>
        ) : (
          <Alert severity="info" style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}>
            No competitions found.
          </Alert>
        )}
        <Button
          onClick={() => setCompetitionPage(prev => prev + 1)}
          style={{ marginLeft: "1rem" }}
          disabled={competitionPage !== 1}
        >
          <FaArrowRight size={20} />
        </Button>
      </div>
    </Container>
  )
}

export default ListCompetition
