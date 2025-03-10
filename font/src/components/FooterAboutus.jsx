import { Box, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#181818",
        color: "#fff",
        padding: "30px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        bottom: 0,
        width: "95.20%",
        textAlign: "center",
        minHeight: "150px",
        marginTop: "50px",
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "16px",
          fontWeight: "500",
          textAlign: "left",
        }}
      >
        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Hotline:{" "}
          <a
            href="tel:0909540605"
            style={{
              textDecoration: "none",
              color: "white",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#00f")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            0909540605 - 012345678910
          </a>
        </Typography>

        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Email:{" "}
          <a
            href="mailto:trannhutminh2702@gmail.com"
            style={{
              textDecoration: "none",
              color: "white",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#00f")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            trannhutminh2702@gmail.com
          </a>
        </Typography>

        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Address:{" "}
          <a
            href="https://www.google.com/maps/place/FPT+AfterSchool+-+CS+Nam+K%E1%BB%B3+Kh%E1%BB%9Fi+Ngh%C4%A9a/@10.7907778,106.6822359,20z/data=!4m15!1m8!3m7!1s0x317528d34ca09b81:0x1ef201bbf2cee6d!2zMzE5IMSQLiBOYW0gS-G7syBLaOG7n2kgTmdoxKlhLCBQaMaw4budbmcgMTQsIFF14bqtbiAzLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!3b1!8m2!3d10.790138!4d106.6832826!16s%2Fg%2F11c21rgp8t!3m5!1s0x317528d35725aa0b%3A0xd71d4731b5032e5e!8m2!3d10.790848!4d106.6822686!16s%2Fg%2F11cndbc9tf?entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "white",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#00f")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            391A Đ. Nam Kỳ Khởi Nghĩa, Phường 14, Quận 3, Hồ Chí Minh 700000, Việt Nam
          </a>
        </Typography>
      </Box>

      <Box
        sx={{
          width: "350px",
          height: "150px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4510619025117!2d106.6822359!3d10.7907778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d35725aa0b%3A0xd71d4731b5032e5e!2sFPT%20AfterSchool%20-%20CS%20Nam%20K%E1%BB%B3%20Kh%E1%BB%9Fi+Ngh%C4%A9a!5e0!3m2!1sen!2s!4v1647977754992!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
};

export default Footer;
