import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../Redux/User/Action";
import { getAllSubmissions, searchSubmissions } from "../../Redux/Submissions/Action";
import { getAllCompetitions, searchCompetitions } from "../../Redux/Competition/Action";
import { getAllAwards } from "../../Redux/Award/Action";
import { getToken } from "../../utils/tokenManager";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardContent, Divider, Grid, Button, Alert, TextField } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const [competitionPage, setCompetitionPage] = useState(1);
  const [submissionPage, setSubmissionPage] = useState(1);
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [competitionSortOrder, setCompetitionSortOrder] = useState("asc");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [submissionSortOrder, setSubmissionSortOrder] = useState("asc");
  const submissionsPerPage = 6;
  const competitionsPerPage = 6;

  const { currentUser } = useSelector((state) => state.users);
  const submissions = useSelector((state) => state.submissions.submissions);
  const competitions = useSelector((state) => state.competitions?.competitions || []);
  const awards = useSelector((state) => (state.awards && state.awards.awards) || []);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token));
      dispatch(getAllSubmissions());
      dispatch(getAllAwards());
      if (competitionSearch) {
        dispatch(searchCompetitions(competitionSearch, competitionPage, 10));
      } else {
        dispatch(getAllCompetitions(competitionPage, 10));
      }
      if (submissionSearch) {
        dispatch(searchSubmissions(submissionSearch, submissionPage, submissionsPerPage));
      }
    } else {
      navigate("/login");
    }
  }, [token, dispatch, navigate, competitionPage, competitionSearch, submissionPage, submissionSearch]);

  if (currentUser && currentUser.role !== "STUDENT") {
    return (
      <Container style={{ marginTop: "2rem" }}>
        <Typography variant="h6">This page is for students only.</Typography>
      </Container>
    );
  }

  const studentSubmissions = submissions.filter(
    (sub) => sub.userId === currentUser?.userId
  );

  const participatedCompetitionIds = new Set(
    studentSubmissions.map(sub => sub.competitionId).filter(id => id)
  );
  const userCompetitions = competitions.filter(comp =>
    participatedCompetitionIds.has(comp.competitionId)
  );

  const submissionsWithCompetitionTitle = studentSubmissions.map(sub => {
    if (!sub.competitionTitle) {
      const comp = userCompetitions.find(c => c.competitionId === sub.competitionId);
      return { ...sub, competitionTitle: comp ? comp.title : "Competition Title" };
    }
    return sub;
  });

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  const filteredCompetitions = userCompetitions.filter(comp =>
    comp.title?.toLowerCase().includes(competitionSearch.toLowerCase())
  );

  const sortedCompetitions = filteredCompetitions.slice().sort((a, b) => {
    const aEnd = new Date(a.endDate);
    const bEnd = new Date(b.endDate);
    return competitionSortOrder === "asc" ? aEnd - bEnd : bEnd - aEnd;
  });

  const filteredSubmissions = submissionsWithCompetitionTitle.filter(sub =>
    sub.competitionTitle.toLowerCase().includes(submissionSearch.toLowerCase())
  );

  const sortedSubmissions = filteredSubmissions.slice().sort((a, b) => {
    const getPrize = (sub) => {
      const subAwards = awards.filter(
        award => parseInt(award.competitionId, 10) === parseInt(sub.competitionId, 10)
      );
      return subAwards.length > 0 ? Math.max(...subAwards.map(aw => aw.prizeMoney)) : 0;
    };
    return submissionSortOrder === "asc"
      ? getPrize(a) - getPrize(b)
      : getPrize(b) - getPrize(a);
  });

  const paginatedSubmissions = sortedSubmissions.slice(
    (submissionPage - 1) * submissionsPerPage,
    submissionPage * submissionsPerPage
  );
  const paginatedCompetitions = sortedCompetitions.slice(
    (competitionPage - 1) * competitionsPerPage,
    competitionPage * competitionsPerPage
  );

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
              setCompetitionSearch(e.target.value);
              setCompetitionPage(1);
            }}
            fullWidth
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setCompetitionSortOrder(prev => prev === "asc" ? "desc" : "asc");
            setCompetitionPage(1);
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
          <>

            <div style={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {paginatedCompetitions.map((comp) => {
                  const compAwards = awards.filter(
                    award => parseInt(award.competitionId, 10) === parseInt(comp.competitionId, 10)
                  );

                  const sortedAwards = compAwards.length > 0
                    ? [...compAwards].sort((a, b) => b.prizeMoney - a.prizeMoney)
                    : [];
                  const highestAward = sortedAwards.length > 0 ? sortedAwards[0] : undefined;

                  return (
                    <Grid item xs={12} md={8} key={comp.competitionId}>
                      <Card
                        onClick={() => navigate(`/competition/${comp.competitionId}`)}
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
                            Start Date: {comp.startDate || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            End Date: {comp.endDate || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            Award: {comp.awardsDescription || "Not available"}
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
                  );
                })}
              </Grid>
            </div>
          </>
        ) : (
          <Alert severity="info" style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}>
            You haven't participated in any competitions.
          </Alert>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <Button
            onClick={() => setCompetitionPage(prev => prev + 1)}
            style={{ marginLeft: "1rem" }}
            disabled={competitionPage !== 1}
          >
            <FaArrowRight size={20} />
          </Button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "3rem", marginLeft: '5rem', marginBottom: "0.5rem", alignItems: "center" }}>
        <div style={{ margin: "1rem 0" }}>
          <TextField
            label="Search Submissions"
            variant="outlined"
            size="small"
            value={submissionSearch}
            onChange={(e) => {
              setSubmissionSearch(e.target.value);
              setSubmissionPage(1);
            }}
            fullWidth
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setSubmissionSortOrder(prev => prev === "asc" ? "desc" : "asc");
            setSubmissionPage(1);
          }}
        >
          Money {submissionSortOrder === "asc" ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
        </Button>
      </div>

      {paginatedSubmissions.length > 0 ? (
        <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
          <Button
            onClick={() => setSubmissionPage(prev => Math.max(prev - 1, 1))}
            disabled={submissionPage === 1}
            style={{ marginRight: "1rem" }}

          >
            <FaArrowLeft size={20} />
          </Button>
          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {paginatedSubmissions.map((sub) => {
                const subAwards = awards.filter(
                  award => parseInt(award.competitionId, 10) === parseInt(sub.competitionId, 10)
                );
                const sortedSubAwards = subAwards.length > 0
                  ? [...subAwards].sort((a, b) => b.prizeMoney - a.prizeMoney)
                  : [];
                const awardForSubmission = sortedSubAwards.length > 0 ? sortedSubAwards[0] : undefined;

                return (
                  <Grid item xs={12} sm={6} md={3} key={sub.submissionId}>
                    <Card style={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <img
                          src={`${imageLink}/${sub.filePath || "placeholder.jpg"}`}
                          alt="Submission Image"
                          style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "1rem" }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {sub.competitionTitle}
                        </Typography>
                        {awardForSubmission ? (
                          <>
                            <Typography variant="body2">
                              <strong>Award Title:</strong> {awardForSubmission.awardTitle || "No Title"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Prize Money:</strong> ${awardForSubmission.prizeMoney.toLocaleString()}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2">
                            <strong>Prize Money:</strong> Not awarded
                          </Typography>
                        )}
                        <Divider style={{ margin: "0.5rem 0" }} />
                        <Typography variant="body2">
                          <strong>Instructor's Evaluation:</strong> {sub.evaluation || "No evaluation available"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Comments:</strong> {sub.instructorComment || "No comments available"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>

          <Button
            style={{ marginLeft: "1rem" }}
            onClick={() => setSubmissionPage(prev => prev + 1)}
          >
            <FaArrowRight size={20} />
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => setSubmissionPage(prev => Math.max(prev - 1, 1))}
              disabled={submissionPage === 1}
              style={{ marginRight: "1rem" }}

            >
              <FaArrowLeft size={20} />
            </Button>
            <Alert severity="info" style={{ marginBottom: "1rem" }}>
              You haven't participated in any submission.
            </Alert>
            <Button
              onClick={() => setSubmissionPage(prev => prev + 1)}
              disabled={submissionPage * submissionsPerPage >= sortedSubmissions.length}
              style={{ marginLeft: "1rem" }}
            >
              <FaArrowRight size={20} />
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default StudentDashboard;
