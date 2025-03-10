import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SubmissionCard = ({
  submissionId,
  title,
  description,
  submissionDate,
  rules,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleJoinSubmission = (e) => {
    e.stopPropagation();
    navigate(`/submission/${submissionId}`);
  };

  return (
    <motion.div
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        margin: "20px auto", // Đưa thẻ vào giữa
        width: "350px",
      }}
    >
      {imageUrl && (
        <img src={imageUrl} alt="Submission" className="card-image" />
      )}
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <div className="card-details">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>Submitted on: {submissionDate}</span>
          </div>
        </div>
        <motion.button
          className="card-button"
          onClick={handleJoinSubmission}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          Join Submission
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SubmissionCard;
