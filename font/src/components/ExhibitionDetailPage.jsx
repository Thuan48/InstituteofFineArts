import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllExhibitionSubmissions } from '../Redux/ExhibitionSubmission/Action';
import { createOrder } from '../Redux/Order/Action';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Pagination,
  Button
} from "@mui/material";
import HomeAppBar from './HomeAppBar';
import { fetchCurrentUser } from '../Redux/User/Action';
import { getToken } from '../utils/tokenManager';

const ExhibitionDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const exhibitionSubmissions = useSelector(state => state.exhibitionSubmissions.exhibitionSubmissions || []);
  const user = useSelector(state => state.auth.user);
  const { currentUser } = useSelector((state) => state.users)
  const order = useSelector(state => state.orders.order);
  const [submissionPage, setSubmissionPage] = useState(1);
  const [submissionPageSize] = useState(10);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    dispatch(getAllExhibitionSubmissions(submissionPage, submissionPageSize));
    dispatch(fetchCurrentUser(getToken()));
  }, [dispatch, submissionPage, submissionPageSize]);

  useEffect(() => {
    if (order && order.paymentUrl) {
      window.location.href = order.paymentUrl;
    }
  }, [order]);

  const handleSubmissionPageChange = (event, value) => {
    setSubmissionPage(value);
  };

  const selectedExhibitionSubmissions = exhibitionSubmissions.filter(
    es => es.exhibitionId === parseInt(id, 10)
  );

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  const exhibitionName = selectedExhibitionSubmissions.length > 0
    ? selectedExhibitionSubmissions[0].exhibition.name
    : "Exhibition Submissions";
  const exhibitionDescription = selectedExhibitionSubmissions.length > 0
    ? selectedExhibitionSubmissions[0].exhibition.description
    : "No description available.";
  const exhibitionDate = selectedExhibitionSubmissions.length > 0
    ? selectedExhibitionSubmissions[0].exhibition.date
    : null;

  const handleBuy = async (exhibitionSubmissionId, soldPrice) => {
    if (!currentUser || !currentUser.email) {
      alert("You need to be logged in to buy an artwork.");
      navigate("/login");
      return;
    }
    setIsOrdering(true);
    const orderData = {
      ExhibitionSubmissionId: exhibitionSubmissionId,
      Buyer: currentUser.email,
      OrderDescription: `Order for ${currentUser.email}`,
      PaymentStatus: "Pending",
      SoldPrice: soldPrice
    };
    await dispatch(createOrder(orderData));
    setIsOrdering(false);
  };

  const handleView = (exhibitionSubmissionId) => {
    navigate(`/submission/${exhibitionSubmissionId}`);
  };

  return (
    <>
      <HomeAppBar />
      <Container style={{ marginTop: "5rem" }}>
        <Typography variant="h4" color="black" gutterBottom>
          {exhibitionName}
        </Typography>
        <Typography variant="h6" color="black" gutterBottom>
          Description: {exhibitionDescription}
        </Typography>
        {exhibitionDate && (
          <Typography variant="subtitle1" color="black" gutterBottom>
            Date: {new Date(exhibitionDate).toLocaleDateString()}
          </Typography>
        )}
        {selectedExhibitionSubmissions.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {selectedExhibitionSubmissions
                .slice((submissionPage - 1) * submissionPageSize, submissionPage * submissionPageSize)
                .map((submission) => (
                  <Grid item xs={12} sm={6} md={4} key={submission.exhibitionSubmissionId}>
                    <Card style={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <img
                          src={`${imageLink}/${submission.submission.filePath || "placeholder.jpg"}`}
                          alt="Submission"
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            marginBottom: "1rem",
                          }}
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
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: submission.averageRating ? "bold" : "normal",
                            color: submission.averageRating ? "text.primary" : "grey.500",
                            mt: 1
                          }}
                        >
                          {typeof submission.averageRating === 'number'
                            ? `Rating: ${submission.averageRating.toFixed(1)} / 5`
                            : "No rating yet"}

                        </Typography>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleView(submission.exhibitionSubmissionId)}
                          style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
                        >
                          View
                        </Button>
                        {submission.status !== "sold" && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleBuy(submission.exhibitionSubmissionId, submission.price)} 
                            style={{ marginTop: "0.5rem" }}
                          >
                            Buy
                          </Button>
                        )}
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
          <Alert
            severity="info"
            style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}
          >
            No submissions found for this exhibition.
          </Alert>
        )}
        <Button variant="contained" color="primary" href="/exhibition" style={{ marginTop: "1rem" }}>
          Back to Exhibitions
        </Button>
      </Container>
    </>
  );
};

export default ExhibitionDetailPage;
