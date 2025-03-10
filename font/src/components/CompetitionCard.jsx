import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Award, ScrollText, Star , Info} from "lucide-react"; // Add Star icon
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAwards } from "../Redux/Award/Action";
import { Typography } from "@mui/material";
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
  const awards = useSelector(state => state.awards.awards);
  const submissions = useSelector(state => state.submissions.submissions); // thêm vào
  const currentUser = useSelector(state => state.users.currentUser); // thêm vào


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
  const hasJoined = submissions.some( // thêm vào
    (submission) => submission.competitionId === competitionId && submission.userId === currentUser?.userId
  );

  return (
    <motion.div
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleCardClick}
    >
      {imageUrl && (
        <img src={imageUrl} alt="Competition" className="card-image" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      )}
      <div className="card-content" >
        <div className="flex justify-between items-start">
          <h2 className="card-title">{title}</h2>
          <div className="card-sta">
            <span className={`card-status ${status === "Ongoing" ? "open" : status === "Upcoming" ? "upcoming" : "closed"}`}>
              {status}
            </span>
          </div>

        </div>
        <div className="card-details">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2 symbol" />
            <span> </span> {description}
          </div>
          <div className="flex items-center items">
            <CalendarDays className="w-5 h-5 mr-2 symbol " />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>

          <div className="flex items-center items">
            <Award className="w-5 h-5 mr-2 symbol" />
            <span>{awardsDescription}</span>
          </div>

          <div className="flex items-center mb-5">
            <ScrollText className="w-5 h-5 mr-2 symbol " />
            <p className="font-semibold">
              <span>Rules:</span> {rules}
            </p>
          </div>
        </div>


        {hasJoined ? ( // thêm vào
          <div className="joined-fill"><p className="joined-text">You have joined</p></div> // thêm vào
        ) : ( // thêm vào
          <motion.button
            className="card-button"
            onClick={handleShowMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </motion.button>
        )}
      </div>

      {isExpanded && (
        <motion.div
          className="card-expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >

          {competitionAwards.length > 0 && (
            <div className="awards-section">
              <Typography variant="h6">Awards</Typography>
              {competitionAwards.map(award => (
                <div key={award.awardId} style={{ marginBottom: '1rem', backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '0.5rem' }}>
                  <Typography variant="subtitle1" style={{ display: 'flex', alignItems: 'center', color: '#ff9800' }}>
                    <Star className="w-5 h-5 mr-1" /> {award.awardTitle}
                  </Typography>
                  <Typography variant="body2">Prize Money: {award.prizeMoney}</Typography>
                  <Typography variant="body2" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
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
