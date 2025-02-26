import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Award, ScrollText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/CompetitionCard.css";

const CompetitionCard = ({
  competitionId,
  title,
  description,
  status,
  startDate,
  endDate,
  rules,
  awardsDescription,
  imageUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/competition/${competitionId}`);
  };

  return (
    <motion.div
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleCardClick}
    >
      {imageUrl && (
        <img src={imageUrl} alt="Competition" className="card-image" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      )}
      <div className="card-content">
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title">{title}</h2>
          <span className={`card-status ${status === "Ongoing" ? "open" : status === "Upcoming" ? "upcoming" : "closed"}`}>
            {status}
          </span>
        </div>
        <p className="card-description">{description}</p>
        <div className="card-details">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            <span>{awardsDescription}</span>
          </div>
        </div>
        <motion.button
          className="card-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </motion.button>
      </div>
      {isExpanded && (
        <motion.div
          className="card-expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start mb-2">
            <ScrollText className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
            <p>
              <span className="font-semibold">Rules:</span> {rules}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompetitionCard;
