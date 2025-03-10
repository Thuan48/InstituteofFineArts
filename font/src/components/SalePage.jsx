import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";
import HomeAppBar from "./HomeAppBar";
import { useParams } from "react-router-dom";
import { initiateSale, getExhibitionSubmissionById } from "../Redux/Sale/action";

const SalePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Lấy thông tin currentUser từ redux (được set bởi HomeAppBar qua state.users.currentUser)
  const currentUser = useSelector((state) => state.users.currentUser);

  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [buyer, setBuyer] = useState("");

  // Sử dụng biến môi trường để lấy đường dẫn ảnh
  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  // Lấy thông tin submission
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await dispatch(getExhibitionSubmissionById(id));
        if (data) {
          setSubmission(data);
        } else {
          setError("No submission information found.");
        }
      } catch (err) {
        console.error("Error when taking submission:", err);
        setError("Error retrieving submission information.");
      }
    };
    fetchSubmission();
  }, [dispatch, id]);

  // Khi currentUser thay đổi, cập nhật giá trị buyer với currentUser.name
  useEffect(() => {
    if (currentUser && currentUser.name) {
      setBuyer(currentUser.name);
    }
  }, [currentUser]);

  const handleQRCodePayment = async () => {
    if (!buyer) {
      setError("Please enter buyer name.");
      return;
    }
    setError("");
    setLoading(true);

    const saleData = {
      ExhibitionSubmissionId: parseInt(id, 10),
      Buyer: buyer,
      SoldPrice: parseFloat(submission.price),
      SoldDate: new Date().toISOString(),
      PaymentStatus: "Sold out", // Lưu trạng thái là "Sold out"
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    try {
      const response = await dispatch(initiateSale(saleData));
      if (response && response.qrCodeUrl) {
        setQrCodeUrl(response.qrCodeUrl);
      } else {
        setError("QR code not received from payment system.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy filePath từ submission; nếu không có thì dùng placeholder
  const filePath = submission?.submission?.filePath || "placeholder.jpg";
  const imageSrc = `${imageLink}/${filePath}`;

  return (
    <>
      <HomeAppBar />
      <Container sx={{ mt: 8 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {submission ? (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <img
                src={imageSrc}
                alt="Submission Image"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <Typography variant="h6" gutterBottom>
                {submission.submission?.title || "Submission Title"}
              </Typography>
              <Typography variant="body2">
                Submitted by: {submission.submission?.user?.name || `User ${submission.submission?.userId}`}
              </Typography>
              <Typography variant="body2">
                Price: ${submission.price}
              </Typography>
              <Typography variant="body2">
                Status: {submission.status}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1">Loading submission information...</Typography>
        )}

        <TextField
          label="Buyer name"
          fullWidth
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          // Nếu có thông tin currentUser.name, disable ô nhập
          disabled={!!currentUser?.name}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleQRCodePayment}
          disabled={loading || !submission}
          sx={{
            backgroundColor: "#A50064", // Màu nền MoMo
            color: "#fff", // Màu chữ trắng
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            marginBottom:"20px",
            "&:hover": {
              backgroundColor: "#8C0052", // Màu hover MoMo
            },
            "&:disabled": {
              backgroundColor: "#D5A7B4", // Màu khi disabled
              color: "#fff",
            },
          }}
        >
          {loading ? "Processing..." : "Payment by MoMo QR code"}
        </Button>


        {qrCodeUrl && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              Scan QR code to pay
              </Typography>
              <img
                src={qrCodeUrl}
                alt="QR Code for MoMo Payment"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  display: "block",
                  margin: "auto",
                }}
              />
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default SalePage;
