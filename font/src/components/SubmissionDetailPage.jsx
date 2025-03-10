import {
  Alert,
  Box,
  Button,
  Container,
  Rating,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllExhibitionSubmissions, updateExhibitionSubmission } from '../Redux/ExhibitionSubmission/Action';
import HomeAppBar from './HomeAppBar';

const SubmissionDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // id là exhibitionSubmissionId
  const exhibitionSubmissions = useSelector(state => state.exhibitionSubmissions.exhibitionSubmissions || []);

  // State cho người dùng đánh giá
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getAllExhibitionSubmissions());
  }, [dispatch]);

  // Tìm submission được chọn dựa trên route parameter id
  const selectedSubmission = exhibitionSubmissions.find(
    es => es.exhibitionSubmissionId === parseInt(id, 10)
  );

  if (!selectedSubmission) {
    return (
      <>
        <HomeAppBar />
        <Container sx={{ mt: 8 }}>
          <Alert severity="info">Submission not found.</Alert>
        </Container>
      </>
    );
  }

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  // Hàm xử lý gửi đánh giá
  const handleSubmitRating = async () => {
    const updatedData = {
      Rating: userRating  // Giả sử API nhận trường "Rating"
    };
    await dispatch(updateExhibitionSubmission(selectedSubmission.exhibitionSubmissionId, updatedData));
    setRatingSubmitted(true);
  };

  return (
    <>
      <HomeAppBar />
      <Container
        sx={{
          mt: 8,
          mb: 8,
          maxWidth: 'md',
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} align="center">
          {selectedSubmission.submission.title || "Submission Title"}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3 }}>
          Submitted by: {selectedSubmission.submission.user?.name || `User ${selectedSubmission.submission.userId}`}
        </Typography>
        <Box
          component="img"
          src={`${imageLink}/${selectedSubmission.submission.filePath || "placeholder.jpg"}`}
          alt="Submission"
          sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', mb: 3, borderRadius: 2 }}
        />
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Price:</strong> ${selectedSubmission.price}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Status:</strong> {selectedSubmission.status}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Current Rating:</strong> {selectedSubmission.averageRating
            ? selectedSubmission.averageRating.toFixed(1)
            : "No rating yet"}
        </Typography>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Rate this submission:
          </Typography>
          <Rating
            name="user-rating"
            value={userRating}
            precision={0.5}
            size="large"
            onChange={(event, newValue) => {
              setUserRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitRating}
            sx={{ mt: -2, ml: 10 }}
          >
            Submit Rating
          </Button>
          {ratingSubmitted && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your rating has been submitted.
            </Alert>
          )}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SubmissionDetailPage;
