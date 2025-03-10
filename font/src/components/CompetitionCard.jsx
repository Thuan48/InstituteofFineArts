import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Award, CalendarDays, ScrollText, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAwards } from "../Redux/Award/Action";
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
  const [competitionAwards, setCompetitionAwards] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const awards = useSelector(state => state.awards.awards || []);

  useEffect(() => {
    dispatch(getAllAwards());
  }, [dispatch]);

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

  const handleShowMore = (e) => {
    e.stopPropagation();
    const filteredAwards = awards.filter(award => award.competitionId === competitionId);
    setCompetitionAwards(filteredAwards);
    setIsExpanded(!isExpanded);
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
        <img
          src={imageUrl}
          alt="Competition"
          className="card-image"
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      )}
      <div className="card-content">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{title}</h2>
          <div className="card-status-container">
            <span
              className={`card-status ${status === "Ongoing" ? "open" : status === "Upcoming" ? "upcoming" : "closed"}`}
            >
              {status}
            </span>
          </div>
        </div>
        <p className="card-description">{description}</p>
        <div className="card-details">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            <span>{awardsDescription}</span>
          </div>
        </div>
        <motion.button
          className="card-button"
          onClick={handleShowMore}
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
          {competitionAwards.length > 0 && (
            <div className="awards-section">
              <Typography variant="h6">Awards</Typography>
              {competitionAwards.map(award => (
                <div
                  key={award.awardId}
                  className="award-card"
                  style={{
                    marginBottom: "1rem",
                    backgroundColor: "#f0f4f8",
                    padding: "1rem",
                    borderRadius: "0.5rem"
                  }}
                >
                  <Typography variant="subtitle1" className="award-title">
                    <Star className="w-5 h-5 mr-1" /> {award.awardTitle}
                  </Typography>
                  <Typography variant="body2">Prize Money: {award.prizeMoney}</Typography>
                  <Typography
                    variant="body2"
                    className="award-winner"
                    style={{ fontWeight: "bold", color: "#3f51b5" }}
                  >
                    Awarded to: {award.user.name}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompetitionCard;
