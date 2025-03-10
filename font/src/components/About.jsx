import "@fontsource/dancing-script";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/about.css";
import FooterAboutus from "./FooterAboutus";

const members = [
  {
    name: "Tran Minh Nhat",
    image: "fb.jpg",
    social: { facebook: "https://www.facebook.com/", instagram: "#", linkedin: "#" },
  },
  {
    name: "Tran Nhut Minh",
    image: "fb.jpg",
    social: { facebook: "https://www.facebook.com/minh.tran.2702/", instagram: "https://www.instagram.com/", linkedin: "#" },
  },
  {
    name: "Ngo Tran Thuan",
    image: "fb.jpg",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Tran Phuong Nam",
    image: "fb.jpg",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
];

const About = () => {
  const [index, setIndex] = useState(0);

  const nextMember = () => {
    setIndex((prev) => (prev + 1) % members.length);
  };

  const prevMember = () => {
    setIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h2" gutterBottom className="styled-title">
          Institute of Fine Arts
        </Typography>

        <Box className="content-container">
          <img src="/VisualArt.png" alt="Visual Art" className="background-image" />

          <Box className="content" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" paragraph>
                Welcome to the Institute of Fine Arts, a place where creativity and innovation come to life.
                Our institute is dedicated to nurturing artistic talent and fostering a deep appreciation for the arts.
                Through our diverse programs, we provide students with the tools and guidance they need to express their unique visions.
              </Typography>
              <Typography variant="h5" paragraph>
                We regularly organize competitions where students can showcase their artistic talents.
                Outstanding participants have the opportunity to receive scholarships, supporting their academic and creative journeys.
              </Typography>
              <Typography variant="h5" paragraph>
                To encourage creativity and artistic excellence, we regularly organize competitions where talented students have the opportunity
                to showcase their skills. Outstanding participants are awarded scholarships, helping them pursue their passion for art with greater support.
              </Typography>
              <Typography variant="h5" paragraph>
                Join us in celebrating the beauty of art and unlocking your full potential in a vibrant and inspiring community.
              </Typography>
            </motion.div>
          </Box>

          <Box className="members-container">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="member-wrapper"
            >
              <Box className="member-circle">
                <img src={members[index].image} alt={members[index].name} className="member-image" />
                <Box className="overlay">
                  <a href={members[index].social.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaFacebook />
                  </a>
                  <a href={members[index].social.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                  <a href={members[index].social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                </Box>
              </Box>
              <Typography className="member-name">{members[index].name}</Typography>
            </motion.div>
            <Box className="navigation-buttons">
              <IconButton onClick={prevMember}>
                <FaArrowLeft size={24} />
              </IconButton>
              <IconButton onClick={nextMember}>
                <FaArrowRight size={24} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
      <FooterAboutus />
    </>
  );
};

export default About;
