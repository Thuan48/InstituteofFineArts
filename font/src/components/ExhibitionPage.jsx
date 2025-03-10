import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExhibitionSubmissions } from "../Redux/ExhibitionSubmission/Action";
import { Container, Typography, Card, CardContent, Grid, Alert, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import HomeAppBar from "./HomeAppBar";
import "../styles/exhibitionPage.css";

const ExhibitionPage = () => {
  const dispatch = useDispatch();
  const { exhibitionSubmissions = [], totalRecords } = useSelector(
    (state) => state.exhibitionSubmissions
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(getAllExhibitionSubmissions(page, pageSize));
  }, [dispatch, page, pageSize]);

  // Group submissions by exhibition (unique exhibition object per id)
  const grouped = exhibitionSubmissions.reduce((acc, cur) => {
    const exhId = cur.exhibition.exhibitionId;
    if (!acc[exhId]) {
      acc[exhId] = cur.exhibition;
    }
    return acc;
  }, {});

  const totalPages = totalRecords ? Math.ceil(totalRecords / pageSize) : 1;
  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;
  return (
    <>
      <HomeAppBar />
      <Container style={{ marginTop: "0rem" }}>
      <img src={`${imageLink}/background.jpg`} alt="logo" style={{ width: '100%', height: '500px' }} />
      <h1 style={{ textAlign: 'center' }}>List Exhibition</h1>
        {Object.keys(grouped).length === 0 ? (
          <Alert severity="info">No exhibitions available.</Alert>
        ) : (
          <Grid container spacing={2}>
            {Object.values(grouped).map((exhibition) => (
              <Grid item xs={12} sm={6} md={4} key={exhibition.exhibitionId}>
                <Link
                  to={`/exhibition/${exhibition.exhibitionId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className="exhibition-card">
                    <CardContent>
                      <Typography variant="h5" className="exhibition-title">
                        {exhibition.name}
                      </Typography>
                      <Typography variant="body2" className="exhibition-description">
                       Description: {exhibition.description}
                      </Typography>
                      <Typography variant="body2" className="exhibition-date">
                       Date: {new Date(exhibition.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          className="pagination"
          style={{ marginTop: "1rem" }}
        />
      </Container>
    </>
  );
};

export default ExhibitionPage;
