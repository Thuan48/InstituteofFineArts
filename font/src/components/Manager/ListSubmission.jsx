import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllSubmissions } from '../../Redux/Submissions/Action';
import { getCompetitionById } from '../../Redux/Competition/Action';
import { getAllExhibitionSubmissions, addExhibitionSubmission, deleteExhibitionSubmission } from '../../Redux/ExhibitionSubmission/Action';
import { getAllExhibitions } from '../../Redux/Exhibition/Action';
import { Container, Typography, Card, CardContent, Grid, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material";

const ListSubmission = () => {
  const dispatch = useDispatch();
  const { competitionId } = useParams();

  const { submissions } = useSelector((state) => state.submissions);
  const { competition } = useSelector((state) => state.competitions);
  const { exhibitionSubmissions } = useSelector((state) => state.exhibitionSubmissions);
  const { exhibitions } = useSelector((state) => state.exhibitions);

  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [price, setPrice] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState("");

  // NEW: State để lưu thông báo lỗi cho từng trường
  const [exhibitionError, setExhibitionError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    dispatch(getAllSubmissions());
    dispatch(getCompetitionById(competitionId));
    dispatch(getAllExhibitionSubmissions());
    dispatch(getAllExhibitions());
  }, [dispatch, competitionId]);

  const competitionSubmissions = submissions.filter(sub => sub.competitionId === parseInt(competitionId, 10));
  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  const handleSelectSubmission = (submissionId) => {
    setSelectedSubmissions(prev => {
      if (prev.includes(submissionId)) {
        return prev.filter(id => id !== submissionId);
      } else {
        return [...prev, submissionId];
      }
    });
  };

  // Hàm validate form và hiển thị lỗi nếu chưa nhập đủ dữ liệu
  const validateForm = () => {
    let valid = true;
    if (!selectedExhibition) {
      setExhibitionError("Please select an exhibition");
      valid = false;
    } else {
      setExhibitionError("");
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceError("Please enter a valid price");
      valid = false;
    } else {
      setPriceError("");
    }

    return valid;
  };

  const handleAddToExhibition = () => {
    // Nếu form không hợp lệ, dừng xử lý và hiển thị lỗi
    if (!validateForm()) return;

    selectedSubmissions.forEach(submissionId => {
      dispatch(addExhibitionSubmission({
        ExhibitionId: selectedExhibition,
        SubmissionId: submissionId,
        Price: parseFloat(price),
        Status: "Available"
      }));
    });
    // Reset lại các state sau khi thêm thành công
    setSelectedSubmissions([]);
    setPrice("");
    setSelectedExhibition("");
    setOpenDialog(false);
  };

  const handleDeleteFromExhibition = (submissionId) => {
    const exhibitionSubmission = exhibitionSubmissions.find(
      es => es.SubmissionId === submissionId && es.ExhibitionId === parseInt(competitionId, 10)
    );
    if (exhibitionSubmission) {
      dispatch(deleteExhibitionSubmission(exhibitionSubmission.ExhibitionSubmissionId));
    }
  };

  const isInExhibition = (submissionId) => {
    return exhibitionSubmissions.some(
      es => es.SubmissionId === submissionId && es.ExhibitionId === parseInt(competitionId, 10)
    );
  };

  return (
    <Container style={{ marginTop: "2rem", marginLeft: "8rem" }}>
      <Typography variant="h4" color='black' gutterBottom>
        Submissions for {competition?.title || "Competition"}
      </Typography>
      {competitionSubmissions.length > 0 ? (
        <Grid container spacing={2}>
          {competitionSubmissions.map((sub) => (
            <Grid item xs={12} sm={6} md={4} key={sub.submissionId}>
              <Card
                style={{
                  marginBottom: "1rem",
                  cursor: "pointer",
                  border: selectedSubmissions.includes(sub.submissionId) ? '2px solid blue' : 'none'
                }}
                onClick={() => handleSelectSubmission(sub.submissionId)}
              >
                <CardContent>
                  <img
                    src={`${imageLink}/${sub.filePath || "placeholder.jpg"}`}
                    alt="Submission Image"
                    style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "1rem" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {sub.title || "Submission Title"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Submitted by:</strong> {sub.user?.name || `User ${sub.userId}`}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Evaluation:</strong> {sub.evaluation || "No evaluation available"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Comments:</strong> {sub.instructorComment || "No comments available"}
                  </Typography>
                  {isInExhibition(sub.submissionId) && (
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteFromExhibition(sub.submissionId)} style={{ marginTop: "1rem" }}>
                      Remove from Exhibition
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" style={{ margin: "1rem auto", textAlign: "center", maxWidth: "50%" }}>
          No submissions found for this competition.
        </Alert>
      )}
      {selectedSubmissions.length > 0 && (
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} style={{ marginTop: "1rem" }}>
          Add to Exhibition
        </Button>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Selected Submissions to Exhibition</DialogTitle>
        <DialogContent>
          <TextField
            label="Select Exhibition"
            fullWidth
            select
            value={selectedExhibition}
            onChange={(e) => setSelectedExhibition(e.target.value)}
            style={{ marginBottom: "1rem" }}
            error={Boolean(exhibitionError)}
            helperText={exhibitionError}
          >
            {exhibitions.map((exhibition) => (
              <MenuItem key={exhibition.exhibitionId} value={exhibition.exhibitionId}>
                {exhibition.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={Boolean(priceError)}
            helperText={priceError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToExhibition} color="primary">
            Add
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListSubmission;
