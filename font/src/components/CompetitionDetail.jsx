import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompetitionById } from "../Redux/Competition/Action";
import { addSubmission, getAllSubmissions, updateSubmission } from "../Redux/Submissions/Action";
import HomeAppBar from "./HomeAppBar";
import { motion } from "framer-motion";
import { fetchCurrentUser } from "../Redux/User/Action";
import { getToken } from "../utils/tokenManager";
import "../styles/CompetitionDetail.css";
import { Snackbar, Alert } from "@mui/material";
import { CalendarDays, Award, ScrollText, Info } from "lucide-react";

const CompetitionDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedCompetition = useSelector((state) => state.competitions.selectedCompetition);
  const { users, currentUser } = useSelector((state) => state.users);
  const submissions = useSelector((state) => state.submissions.submissions);
  const token = getToken();
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    title: "",
    description: "",
    filePath: "",
    uploadImage: null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(getCompetitionById(id));
    dispatch(getAllSubmissions());
  }, [dispatch, id]);

  if (!selectedCompetition)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  const userSubmission = submissions.find(submission => submission.competitionId === selectedCompetition.competitionId && submission.userId === currentUser?.userId);
  const isCompetitionEnded = new Date(selectedCompetition.endDate) < new Date();

  const handleJoinCompetition = () => {
    setShowForm(true);
    setIsUpdate(false);
  };

  const handleEditSubmission = () => {
    setShowForm(true);
    setIsUpdate(true);
    setSubmissionData({
      title: userSubmission.title,
      description: userSubmission.description,
      filePath: userSubmission.filePath,
      uploadImage: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", currentUser.name);
    formData.append("userEmail", currentUser.email);
    formData.append("userId", currentUser.userId);
    formData.append("competitionId", selectedCompetition.competitionId);
    formData.append("title", submissionData.title);
    formData.append("description", submissionData.description);
    formData.append("submitDate", new Date().toISOString());
    formData.append("status", "Chờ kết quả");

    if (submissionData.uploadImage) {
      formData.append("uploadImage", submissionData.uploadImage);
    }

    console.log("Submitting FormData:", Object.fromEntries(formData.entries())); // Kiểm tra dữ liệu trước khi gửi

    if (isUpdate) {
      dispatch(updateSubmission(userSubmission.submissionId, formData));
    } else {
      dispatch(addSubmission(formData));
    }

    setShowForm(false);
    setOpenSnackbar(true);
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setSubmissionData((prevData) => ({
        ...prevData,
        uploadImage: files[0],
      }));
    } else {
      setSubmissionData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  return (
    <div className="detail-container">
      <HomeAppBar />
      <div className="container mx-auto px-4 py-8 detail-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="card-containers">
              <div className="card-contented ">
                {selectedCompetition.image && (
                  <img src={`${imageLink}/${selectedCompetition.image}`} alt="Competition" className="card-image" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="card-title">{selectedCompetition.title}</h2>
                  <div className="card-sta">
                    <span className={`card-status ${selectedCompetition.status === "Ongoing" ? "open" : selectedCompetition.status === "Upcoming" ? "upcoming" : "closed"}`}>
                      {selectedCompetition.status}
                    </span>
                  </div>

                </div>

                <div className="card-details">
                  <div className="flex items-center ">
                      <Info className="w-5 h-5 mr-2 symbol" />
                      <span> </span> {selectedCompetition.description}
                  </div>
                  <div className="flex items-center items">
                    <CalendarDays className="w-5 h-5 mr-2 symbol" />
                    <span>{new Date(selectedCompetition.startDate).toLocaleDateString()} - {new Date(selectedCompetition.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center items">
                    <Award className="w-5 h-5 mr-2 symbol" />
                    <span></span>{selectedCompetition.awardsDescription}
                  </div>
                  <div className="flex items-center mb-5">
                    <ScrollText className="w-5 h-5 mr-2 symbol " />
                    <p className="font-semibold">
                      <span>Rules:</span> {selectedCompetition.rules}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="card-containerss">

            <div className="users-joined">
              <h3>
                Users Joined (
                {new Set(submissions
                  .filter(sub => sub.competitionId === selectedCompetition.competitionId) // Lọc theo competition
                  .map(sub => sub.user?.name.trim()) // Lấy tên student duy nhất
                ).size})
              </h3>
              <div className="table-container">
              <table className="tablelist">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions
                    .filter(submission => submission.competitionId === selectedCompetition.competitionId)
                    .map(submission => (
                      <tr key={submission.submissionId}>
                        <td>{submission.user ? submission.user.name : "User not found"}</td>
                        <td>{submission.title}</td>
                        <td>{submission.description || "No description"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
              
            </div>


            <div>

            </div>

            {!isCompetitionEnded && selectedCompetition.status !== "Upcoming" && currentUser?.role === "STUDENT" && (
              <>
                {userSubmission && !isCompetitionEnded ? (
                  <motion.button
                    className="join-button"
                    onClick={handleEditSubmission}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit Submission
                  </motion.button>
                ) : (
                  <motion.button
                    className="join-button"
                    onClick={handleJoinCompetition}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Competition
                  </motion.button>
                )}

                {showForm && (
                  <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
                    <div className="form-input">
                      <label htmlFor="title">Enter Student Code</label>
                      <input
                        type="text"
                        name="title"
                        value={submissionData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        value={submissionData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <label htmlFor="uploadImage">Upload Image</label>
                      <input
                        type="file"
                        name="uploadImage"
                        onChange={handleChange}
                      />
                    </div>
                    {isUpdate && userSubmission.filePath && (
                      <img src={`${imageLink}/${userSubmission.filePath}`} alt="Submission" className="submission-image" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                    )}
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                        Cancel
                      </button>
                      <button type="submit" className="submit-button">
                        {isUpdate ? "Update" : "Submit"}
                      </button>

                    </div>
                  </form>
                )}
              </>
            )}

          </div>
        </div>
      </div>
      {/* 🆕 Hiển thị thông báo sau khi nộp bài */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>Nộp bài thành công!</Alert>
      </Snackbar>
    </div>

  );
};

export default CompetitionDetail;

