import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, fetchCurrentUser } from "../../Redux/User/Action"
import { getAllCompetitions, addCompetition, updateCompetition, deleteCompetition, searchCompetitions } from "../../Redux/Competition/Action"
import { getAllSubmissions } from "../../Redux/Submissions/Action"
import { getToken } from "../../utils/tokenManager"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Card, CardContent, Snackbar, Grid, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Pagination, Avatar } from "@mui/material"
import { Pagination as MuiPagination } from "@mui/material";
import { addEvaluation, updateEvaluation, getAllEvaluations } from "../../Redux/Evaluation/Action";
import { getAllAwards, addAward, updateAward, deleteAward } from "../../Redux/Award/Action";
import { PlusCircle } from "lucide-react";
import { CalendarDays, CalendarCheck } from "lucide-react";
import { Award, ScrollText, BadgeCheck, Info } from "lucide-react"; // Add Star icon

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const StaffDashboard = () => {
  const { users, currentUser } = useSelector((state) => state.users)
  const { competitions, competitionsTotal } = useSelector((state) => state.competitions)
  const submissions = useSelector((state) => state.submissions.submissions)
  const evaluations = useSelector(state => state.evaluations.evaluations);
  const awards = useSelector((state) => state.awards.awards);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openAddEvaluationSnackbar, setAddEvaluationSnackbar] = useState(false)
  const [openUpdateAwardSnackbar, setUpdateAwardSnackbar] = useState(false)
  const [openAwardSnackbar, setAwardSnackbar] = useState(false);
  const [openEvalSnackbar, setOpenEvalSnackbar] = useState(false);
  const [openDeleteAwardSnackbar, setDeleteAwardSnackbar] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openAddSnackbar, setOpenAddSnackbar] = useState(false);


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
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [openAwardsDialog, setOpenAwardsDialog] = useState(false);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [openAwardDialog, setOpenAwardDialog] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [openEditAwardDialog, setOpenEditAwardDialog] = useState(false);
  const [awardData, setAwardData] = useState({ awardId: '', awardTitle: '', awardDescription: '', prizeMoney: '', dateAwarded: '', userId: '', competitionId: '' });




  useEffect(() => {
    if (searchTerm) {
      dispatch(searchCompetitions(searchTerm, pageNumber, pageSize));
    } else {
      dispatch(getAllCompetitions(pageNumber, pageSize));
    }
    dispatch(getAllAwards());
  }, [dispatch, pageNumber, searchTerm]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
      dispatch(getAllCompetitions(page, pageSize))
      dispatch(getAllSubmissions())
      dispatch(getAllEvaluations(1, 10))
      dispatch(getAllAwards());
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
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00 để tránh lỗi so sánh

    const startDate = new Date(competitionData.startDate);
    const endDate = new Date(competitionData.endDate);
    let tempErrors = {};

    if (startDate < now) {
      tempErrors.startDate = "Start date cannot be in the past.";
    }
    if (endDate < startDate) {
      tempErrors.endDate = "End date cannot be before start date.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleAddCompetition = () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("title", competitionData.title);
      formData.append("startDate", competitionData.startDate);
      formData.append("endDate", competitionData.endDate);
      formData.append("description", competitionData.description);
      formData.append("awardsDescription", competitionData.awardsDescription);
      formData.append("rules", competitionData.rules);
      formData.append("status", "Close");
      formData.append("createdBy", currentUser.userId);
      if (competitionData.image) {
        formData.append("image", competitionData.image);
      }

      dispatch(addCompetition(formData)).then(() => {
        setOpenDialog(false);
        setCompetitionData({
          title: "",
          startDate: "",
          endDate: "",
          description: "",
          awardsDescription: "",
          rules: "",
          image: null,
        });

        // Hiển thị Snackbar
        setOpenAddSnackbar(true);
      });
    }
  };

  const handleEditCompetition = (competition) => {
    setSelectedCompetition(competition);
    setCompetitionData({
      ...competition,
      startDate: competition.startDate.split('T')[0],
      endDate: competition.endDate.split('T')[0],
      image: competition.image ? `${imageLink}/${competition.image}` : null
    });
    setOpenDialog(true);
  };

  const validateEvaluation = () => {
    let newErrors = {};

    // Kiểm tra điểm số (phải là số hợp lệ trong khoảng 0-100)
    if (evaluationScore === "" || isNaN(evaluationScore) || evaluationScore < 0 || evaluationScore > 100) {
      newErrors.evaluationScore = "Score must be a number between 0 and 100.";
    }

    // Kiểm tra Strength không được để trống
    if (!strengths.trim()) {
      newErrors.strengths = "Strengths cannot be empty.";
    }

    // Kiểm tra Improvement không được để trống
    if (!improvements.trim()) {
      newErrors.improvements = "Improvements cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về `true` nếu không có lỗi
  };



  const handleUpdateCompetition = () => {
    if (validateDates()) {
      const formData = new FormData();
      formData.append('title', competitionData.title);
      formData.append('startDate', competitionData.startDate);
      formData.append('endDate', competitionData.endDate);
      formData.append('description', competitionData.description);
      formData.append('awardsDescription', competitionData.awardsDescription);
      formData.append('rules', competitionData.rules);
      formData.append('status', 'Close');
      formData.append('createdBy', currentUser.userId);
      if (competitionData.image && typeof competitionData.image !== 'string') {
        formData.append('image', competitionData.image);
      }

      dispatch(updateCompetition(selectedCompetition.competitionId, formData))
        .then(() => {
          setSnackbarMessage('✅ Cập nhật thành công!');
          setOpenSnackbar(true);
        });

      setOpenDialog(false);
      setSelectedCompetition(null);
      setCompetitionData({ title: '', startDate: '', endDate: '', description: '', awardsDescription: '', rules: '', image: null });
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteCompetition = (competitionId) => {
    if (window.confirm("Are you sure you want to delete this competition?")) {
      dispatch(deleteCompetition(competitionId)).then(() => {
        // Hiển thị Snackbar khi xóa thành công
        setOpenDeleteSnackbar(true);
      });
    }
  };
  useEffect(() => {
    if (currentUser && currentUser.role !== "STAFF") {
      navigate("/");
    }
  }, [currentUser]);



  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleViewSubmissions = (competitionId) => {
    setSelectedCompetition(competitionId)
    setSubPage(1);
    setOpenSubmissionsDialog(true)
  }



  const handleAddEvaluation = (submission) => {
    const existingEval = (evaluations || []).find(ev => ev.submissionId === submission.submissionId);

    setCurrentSubmission(submission);
    setEvaluationScore(existingEval ? existingEval.score : "");

    // Nếu đã có Remarks, tách Strength và Improvement
    if (existingEval?.remarks) {
      const [strengthText, improvementText] = existingEval.remarks.split(", ");
      setStrengths(strengthText.replace("Strength: ", ""));
      setImprovements(improvementText.replace("Improvement: ", ""));
    } else {
      setStrengths("");
      setImprovements("");
    }
    setCurrentSubmission(submission);
    setEvaluationScore("");
    setStrengths("");
    setImprovements("");

    if (validateEvaluation()) {
      setOpenEvalDialog(true);
    }

    setEvaluationScore(existingEval ? "Edit Evaluation" : "Add Evaluation");
    setAddEvaluationSnackbar(true);
    setOpenEvalDialog(true);
  };







  const getStatus = (submission) => {
    const evalData = (evaluations || []).find(ev => ev.submissionId === submission.submissionId);
    const score = evalData?.score ?? null;

    if (score === null) return "Pending";
    if (score >= 90) return "Xuất sắc";
    if (score >= 75) return "Tốt";
    if (score >= 60) return "Khá";
    if (score >= 40) return "Trung bình";
    return "Loại";
  };

  const getStatusColor = (submission) => {
    const status = getStatus(submission);
    switch (status) {
      case "Xuất sắc": return "#4CAF50"; // Xanh lá
      case "Tốt": return "#2196F3"; // Xanh dương
      case "Khá": return "#FFC107"; // Vàng cam
      case "Trung bình": return "#FF9800"; // Cam
      case "Loại": return "#F44336"; // Đỏ
      default: return "gray"; // Mặc định nếu chưa có đánh giá
    }
  };


  const handleSaveEvaluation = () => {
    if (!validateEvaluation()) {
      return; // Nếu có lỗi, dừng hàm tại đây
    }

    let status = "Pending";
    if (evaluationScore >= 90) status = "Xuất sắc";
    else if (evaluationScore >= 80) status = "Tốt";
    else if (evaluationScore >= 70) status = "Khá";
    else if (evaluationScore >= 50) status = "Trung bình";
    else status = "Loại";

    // Đảm bảo không lưu undefined vào remarks
    const formattedStrength = strengths ? `Strength: ${strengths}` : "";
    const formattedImprovement = improvements ? `Improvement: ${improvements}` : "";
    const formattedRemarks = [formattedStrength, formattedImprovement].filter(Boolean).join(", ");

    const evaluationData = {
      submissionId: currentSubmission.submissionId,
      staffId: currentUser.userId,
      score: parseInt(evaluationScore) || 0,
      remarks: formattedRemarks,
      evaluationDate: new Date().toISOString(),
      status,
    };

    const existingEval = (evaluations || []).find(ev => ev.submissionId === currentSubmission.submissionId);
    if (existingEval) {
      dispatch(updateEvaluation(existingEval.evaluationId, evaluationData)).then(() => {
        setOpenEvalSnackbar(true); // Hiển thị Snackbar khi cập nhật thành công
      });
    } else {
      dispatch(addEvaluation(evaluationData)).then(() => {
        setOpenEvalSnackbar(true); // Hiển thị Snackbar khi thêm mới thành công
      });
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

  const handleViewAwards = (competitionId) => {
    const filtered = awards.filter(award => award.competitionId === competitionId);
    setFilteredAwards(filtered);
    setSelectedCompetitionId(competitionId);
    setOpenAwardsDialog(true);
  };

  const validateAwardDate = () => {
    const endDate = new Date(competitionData.endDate);
    const dateAwarded = new Date(awardData.dateAwarded);
    let tempErrors = {};

    if (dateAwarded < endDate) {
      tempErrors.dateAwarded = "Date Awarded cannot be before the competition's end date.";
    }
    if (!awardData.awardTitle.trim()) {
      tempErrors.awardTitle = "Award Title is required";
    }
    if (!awardData.awardDescription.trim()) {
      tempErrors.awardDescription = "Award Description is required";
    }
    if (!String(awardData.prizeMoney).trim()) {
      tempErrors.prizeMoney = "Prize Money is required";
    } else if (isNaN(awardData.prizeMoney) || Number(awardData.prizeMoney) < 0) {
      tempErrors.prizeMoney = "Prize Money must be a valid positive number";
    }
    if (!awardData.dateAwarded.trim()) {
      tempErrors.dateAwarded = "Date Awarded is required";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    toast.success("Award added successfully!", { position: "top-right", autoClose: 3000 });



    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  // const userSubmission = submissions.find(submission => submission.competitionId === selectedCompetition.competitionId && submission.userId === currentUser?.userId);
  const handleAddAward = (submission) => {

    setAwardData({
      filePath: submission?.filePath,
      awardId: '',
      username: submission.user?.name,
      useremail: submission.user?.email,
      awardTitle: '',
      awardDescription: '',
      prizeMoney: '',
      dateAwarded: '',
      userId: submission.userId,
      competitionId: submission.competitionId,
    });
    setOpenAwardDialog(true);
  };





  const handleSubmitAward = () => {
    if (validateAwardDate()) {
      if (awardData.awardId) {
        dispatch(updateAward(awardData.awardId, awardData));
      } else {
        dispatch(addAward(awardData));
      }
      setOpenAwardDialog(false);
      setAwardData({ awardTitle: '', awardDescription: '', prizeMoney: '', dateAwarded: '' });
      setAwardSnackbar(true);
    }
  };

  const handleEditAward = (award) => {

    setAwardData({
      awardId: award.awardId || '',
      awardTitle: award.awardTitle || '',
      awardDescription: award.awardDescription || '',
      prizeMoney: award.prizeMoney ? String(award.prizeMoney) : '',
      dateAwarded: award.dateAwarded ? award.dateAwarded.split('T')[0] : '',
      userId: award.userId || '',
      competitionId: award.competitionId || '',
    });
    setOpenEditAwardDialog(true);

  };

  const handleUpdateAward = () => {
    if (validateAwardDate()) {
      if (awardData.awardId) {
        dispatch(updateAward(awardData.awardId, awardData));
      } else {
        dispatch(addAward(awardData));
      }

      // Đóng dialog và reset form sau khi cập nhật

      setOpenEditAwardDialog(false);
      setAwardData({ awardTitle: "", awardDescription: "", prizeMoney: "", dateAwarded: "" });
      setUpdateAwardSnackbar(true);
      dispatch(getAllAwards());
    }
  };







  const handleDeleteAward = (awardId) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      dispatch(deleteAward(awardId))
        .then(() => {
          dispatch(fetchAwards()); // Load lại danh sách mà không cần refresh trang
          setOpenAwardsDialog(true);
        })
        .catch(() => {
          console.error("Failed to delete award.");
        });
      setDeleteAwardSnackbar(true)
    }
  };








  const validateForm = () => {
    let newErrors = {};

    if (!competitionData.title.trim()) newErrors.title = "Title is required";
    if (!competitionData.startDate) newErrors.startDate = "Start Date is required";
    if (!competitionData.endDate) newErrors.endDate = "End Date is required";
    if (competitionData.startDate && competitionData.endDate && competitionData.startDate > competitionData.endDate) {
      newErrors.endDate = "End Date must be after Start Date";
    }
    if (!competitionData.description) newErrors.description = "Description is required"
    if (!competitionData.awardsDescription.trim()) newErrors.awardsDescription = "Awards description is required";
    if (!competitionData.rules.trim()) newErrors.rules = "Rules are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container style={{ marginTop: "0rem", marginLeft: "8rem", marginBottom: "-2rem" }} className="card-containerssss">
      <Typography variant="h4" color="black" gutterBottom>
        My Competitions
      </Typography>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} startIcon={<PlusCircle size={20} />}>
          Add Competition
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

          InputLabelProps={{ style: { color: 'black' } }}
          InputProps={{ style: { color: 'black' } }}
        />


      </div>
      {competitions.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {competitions.map((comp) => (
              <Grid item xs={12} sm={6} md={4} key={comp.competitionId}>
                <div style={{ marginBottom: "1rem", cursor: "pointer" }}>
                  <CardContent className="cardContentt">
                    <img
                      src={`${imageLink}/${comp.image || 'placeholder.jpg'}`}
                      alt="Competition Image"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', marginBottom: '1rem' }}
                    />
                    <Typography variant="h5" style={{ fontWeight: "bold" }} gutterBottom>

                      {comp.title || 'Competition Title'}
                    </Typography>
                    <Typography variant="body2 flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 symbol " />
                      Start Date: {formatDate(comp.startDate) || 'N/A'}
                    </Typography>
                    <Typography variant="body2 flex items-center items">
                      <CalendarCheck className="w-5 h-5 mr-2 symbol text-red-500" /> {/* Ngày kết thúc */}
                      End Date: {comp.endDate || 'N/A'}
                    </Typography>
                    <Typography variant="body2 flex items-center items">
                      <Info className="w-5 h-5 mr-2 symbol" />
                      Description: {comp.description || 'N/A'}
                    </Typography>
                    <Typography variant="body2 flex items-center items">
                      <Award className="w-5 h-5 mr-2 symbol" />
                      Awards: {comp.awardsDescription || 'N/A'}
                    </Typography>
                    <Typography variant="body2 flex items-center items">
                      <ScrollText className="w-5 h-5 mr-2 symbol " />
                      Rules: {comp.rules || 'N/A'}
                    </Typography>
                    <Typography variant="body2 flex items-center items">
                      <BadgeCheck className="w-5 h-5 mr-2 symbol" />
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
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleViewAwards(comp.competitionId)}
                      style={{ marginTop: '1rem', marginLeft: '10px' }}
                    >
                      Awards
                    </Button>
                  </CardContent>
                </div>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(competitionsTotal / pageSize)}
            page={page}
            onChange={handlePageChange}
            style={{ marginTop: '1rem' }}
          />
          <Snackbar
            open={openDeleteAwardSnackbar}
            autoHideDuration={4000}
            onClose={() => setDeleteAwardSnackbar(false)}
          >
            <Alert onClose={() => setDeleteAwardSnackbar(false)} severity="success">
              🗑 Phần thưởng đã bị xóa thành công!
            </Alert>
          </Snackbar>
        </>
      ) : (
        <div style={{ textAlign: "center", margin: "1rem auto", maxWidth: "50%" }}>
          <Alert severity="info">
            You havent created any competitions.
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
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={competitionData.startDate}
            onChange={(e) => setCompetitionData({ ...competitionData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '1rem' }}
            error={!!errors.startDate}
            helperText={errors.startDate}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={competitionData.endDate}
            onChange={(e) => setCompetitionData({ ...competitionData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '1rem' }}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
          <TextField
            label="Description"
            fullWidth
            value={competitionData.description}
            onChange={(e) => setCompetitionData({ ...competitionData, description: e.target.value })}
            style={{ marginBottom: '1rem' }}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Awards Description"
            fullWidth
            value={competitionData.awardsDescription}
            onChange={(e) => setCompetitionData({ ...competitionData, awardsDescription: e.target.value })}
            error={!!errors.awardsDescription}
            helperText={errors.awardsDescription}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Rules"
            fullWidth
            value={competitionData.rules}
            onChange={(e) => setCompetitionData({ ...competitionData, rules: e.target.value })}
            style={{ marginBottom: '1rem' }}
            error={!!errors.rules}
            helperText={errors.rules}
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
      {/* AddCompetition */}
      <Snackbar
        open={openAddSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenAddSnackbar(false)}
      >
        <Alert onClose={() => setOpenAddSnackbar(false)} severity="success">
          ✅ Cuộc thi đã được thêm thành công!
        </Alert>
      </Snackbar>
      {/* UpdateCompetition */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>Cập nhật cuộc thi thành công!</Alert>
      </Snackbar>

      {/* DeleteCompetition */}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenDeleteSnackbar(false)}
      >
        <Alert onClose={() => setOpenDeleteSnackbar(false)} severity="success">
          🗑 Xóa Cuộc thi  thành công!
        </Alert>
      </Snackbar>



      <Dialog open={openSubmissionsDialog} onClose={() => setOpenSubmissionsDialog(false)} maxWidth="lg" fullWidth sx={{ "& .MuiDialog-paper": { height: "200vh" } }} >
        <DialogTitle>All Student Papers Submitted</DialogTitle>
        <DialogContent>
          <div>
            <div >
              <Grid container spacing={2}>
                {pagedSubmissions.map((submission) => (
                  <Grid item xs={12} sm={6} md={4} key={submission.submissionId}>
                    <div style={{ width: "300px", padding: "1rem" }} className="card-containerssss" >
                      <CardContent className="cardContent">
                        {submission.filePath && (
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_PATH}/${submission.filePath}`}
                            alt="Submission"
                            style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '0.2rem' }}
                          />
                        )}
                        <div style={{ marginTop: '0.5rem' }}>
                          🧑‍🎓 Name:  <span style={{ fontWeight: "bold" }}>{submission.user?.name}</span> <br />
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>


                          ✉️ Email: <span style={{ fontWeight: 'bold' }} > {submission.user?.email} </span>

                        </div>



                        <Typography variant="body2" style={{ marginTop: '0.5rem' }} >
                          🆔 StudentID: <span style={{ fontWeight: 'bold' }} >{submission.title}</span>
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
                          📝 Description: <span style={{ fontWeight: 'bold' }} >{submission.description || 'N/A'}</span>
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '1.0rem', marginTop: '0.5rem' }}>
                          <span style={{ color: 'white' }}>✅ Status:</span>
                          <span style={{ color: getStatusColor(submission), fontWeight: 'bold' }}> {getStatus(submission)}</span>
                        </Typography>

                        {/* Hiển thị Remarks (Điểm mạnh & Cần cải thiện) */}
                        <Typography variant="body2" style={{ marginTop: '0.5rem', color: 'gray' }}>
                          {(() => {
                            const evalData = (evaluations || []).find(ev => ev.submissionId === submission.submissionId);
                            if (!evalData?.remarks) return "No remarks";

                            const remarksParts = evalData.remarks.split(", ");
                            const strengthText = remarksParts.find(part => part.startsWith("Strength:"));
                            const improvementText = remarksParts.find(part => part.startsWith("Improvement:"));

                            return (
                              <>
                                {strengthText && (
                                  <Typography component="span" style={{ color: "white", marginTop: '0.5rem' }}>
                                    💪 Strength:
                                  </Typography>
                                )}
                                {strengthText && (
                                  <Typography component="span" style={{ fontWeight: "bold", color: "white", }}>
                                    {` ${strengthText.replace("Strength: ", "")}`}
                                  </Typography>
                                )}

                                {strengthText && <br />}

                                {improvementText && (
                                  <Typography component="span" style={{ color: "white", marginTop: '0.5rem' }}>
                                    🔧 Improvement:
                                  </Typography>
                                )}
                                {improvementText && (
                                  <Typography component="span" style={{ fontWeight: "bold", color: "white", }}>
                                    {` ${improvementText.replace("Improvement: ", "")}`}
                                  </Typography>
                                )}
                              </>
                            );
                          })()}
                        </Typography>


                        <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'red' }}>
                          🎯 Score: {(evaluations || []).find(ev => ev.submissionId === submission.submissionId)?.score ?? "N/A"}
                        </Typography>

                        {/* Kiểm tra đã có đánh giá chưa */}
                        {(evaluations || []).find(ev => ev.submissionId === submission.submissionId) ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              const existingEval = (evaluations || []).find(ev => ev.submissionId === submission.submissionId);
                              setCurrentSubmission(submission);
                              setEvaluationScore(existingEval.score);
                              setStrengths(existingEval.remarks?.split("\n")[1]?.replace("Điểm mạnh: ", "") || "");
                              setImprovements(existingEval.remarks?.split("\n")[2]?.replace("Cần cải thiện: ", "") || "");
                              setOpenEvalDialog(true);


                            }}
                            error={!!errors.evaluationScore}
                            helperText={errors.evaluationScore}


                            style={{ marginTop: "0.5rem" }}
                          >
                            Edit Evaluation
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddEvaluation(submission)}
                            style={{ marginLeft: "0.5rem" }}
                          >
                            Add Evaluation
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAddAward(submission)}
                          style={{ marginTop: '0.5rem' }}
                        >
                          Add Award
                        </Button>

                      </CardContent>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>

            <Pagination
              count={Math.ceil(filteredSubmissions.length / subPageSize)}
              page={subPage}
              onChange={handleSubPageChange}
              style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            />

          </div>


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
              Evaluating submission: {currentSubmission?.user?.name}
            </Typography>

            {/* Score Input */}
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
              error={!!errors.evaluationScore}
              helperText={errors.evaluationScore}
            />

            {/* Strength Input */}
            <TextField
              label="Strength"
              fullWidth
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              style={{ marginTop: '1rem' }}
              error={!!errors.strengths}
              helperText={errors.strengths}
            />

            {/* Improvement Input */}
            <TextField
              label="Improvement"
              fullWidth
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              style={{ marginTop: '1rem' }}
              error={!!errors.improvements}
              helperText={errors.improvements}
            />
          </DialogContent>

          <DialogActions>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEvaluation}
              style={{ marginTop: "1rem" }}
            >
              Save Evaluation
            </Button>

            <Button onClick={() => setOpenEvalDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        open={openEvalSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenEvalSnackbar(false)}
      >
        <Alert onClose={() => setOpenEvalSnackbar(false)} severity="success">
          ✅ Đánh giá đã được lưu thành công!
        </Alert>
      </Snackbar>



      <Dialog open={openAwardsDialog} onClose={() => setOpenAwardsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Awards</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {filteredAwards.map((award) => (
              <Grid item xs={12} sm={6} md={4} key={award.awardId}>
                <Card style={{ marginBottom: "1rem" }}>
                  <CardContent>
                    {award.submission?.filePath && (
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE_PATH}/${award.submission?.filePath}`}
                        alt="Submission"
                        style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem' }}
                      />
                    )}


                    <Typography variant="h6" gutterBottom>
                      {award.awardTitle || 'Award Title'}
                    </Typography>
                    <Typography variant="body2">
                      Description: {award.awardDescription || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Prize Money: {award.prizeMoney || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Date Awarded: {award.dateAwarded ? new Date(award.dateAwarded).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Awarded to: {award.user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Email Winner: {award.user?.email || 'N/A'}
                    </Typography>


                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditAward(award)}
                      style={{ marginTop: '1rem' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteAward(award.awardId)}
                      style={{ marginTop: '1rem', marginLeft: '10px' }}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog open={openEditAwardDialog} onClose={() => setOpenEditAwardDialog(false)}>
        <DialogTitle>Edit Award</DialogTitle>
        <DialogContent>
          <TextField
            label="Award Title"
            fullWidth
            value={awardData.awardTitle}
            onChange={(e) => setAwardData({ ...awardData, awardTitle: e.target.value })}
            error={!!errors.awardTitle}
            helperText={errors.awardTitle}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Award Description"
            fullWidth
            value={awardData.awardDescription}
            onChange={(e) => setAwardData({ ...awardData, awardDescription: e.target.value })}
            error={!!errors.awardDescription}
            helperText={errors.awardDescription}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Prize Money"
            fullWidth
            value={awardData.prizeMoney}
            onChange={(e) => setAwardData({ ...awardData, prizeMoney: e.target.value })}
            error={!!errors.prizeMoney}
            helperText={errors.prizeMoney}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Date Awarded"
            type="date"
            fullWidth
            value={awardData.dateAwarded}
            onChange={(e) => setAwardData({ ...awardData, dateAwarded: e.target.value })}
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateAwarded}
            helperText={errors.dateAwarded}
            style={{ marginBottom: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateAward} color="primary">Update Award</Button>
          <Button onClick={() => setOpenEditAwardDialog(false)} color="secondary">Cancel</Button>
        </DialogActions>

      </Dialog>
      <Snackbar
        open={openUpdateAwardSnackbar}
        autoHideDuration={2000}
        onClose={() => setAwardSnackbar(false)}
      >
        <Alert onClose={() => setUpdateAwardSnackbar(false)} severity="success">
          ✅ Đã cập nhật giải thưởng thành công
        </Alert>
      </Snackbar>


      <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)}>
        <DialogTitle>Add Award</DialogTitle>
        <DialogContent>
          <TextField
            label="Award Title"
            fullWidth
            value={awardData.awardTitle}
            onChange={(e) => setAwardData({ ...awardData, awardTitle: e.target.value })}
            error={!!errors.awardTitle}
            helperText={errors.awardTitle}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Award Description"
            fullWidth
            value={awardData.awardDescription}
            onChange={(e) => setAwardData({ ...awardData, awardDescription: e.target.value })}
            error={!!errors.awardDescription}
            helperText={errors.awardDescription}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Prize Money"
            fullWidth
            value={awardData.prizeMoney}
            onChange={(e) => setAwardData({ ...awardData, prizeMoney: e.target.value })}
            error={!!errors.prizeMoney}
            helperText={errors.prizeMoney}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Date Awarded"
            type="date"
            fullWidth
            value={awardData.dateAwarded}
            onChange={(e) => setAwardData({ ...awardData, dateAwarded: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dateAwarded}
            helperText={errors.dateAwarded}
            style={{ marginBottom: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitAward} color="primary">Submit Award</Button>
          <Button onClick={() => setOpenAwardDialog(false)} color="secondary">Cancel</Button>
        </DialogActions>

      </Dialog>
      <Snackbar
        open={openAwardSnackbar}
        autoHideDuration={4000}
        onClose={() => setAwardSnackbar(false)}
      >
        <Alert onClose={() => setAwardSnackbar(false)} severity="success">
          Đã thêm giải thưởng thành công
        </Alert>
      </Snackbar>




    </Container>

  )
}

export default StaffDashboard
