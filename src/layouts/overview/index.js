import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#00bcd4", // Blue cyan color
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  "& .MuiCardContent-root": {
    paddingBottom: theme.spacing(4),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: "black",
  "&:hover": {
    backgroundColor: theme.palette.common.white,
  },
}));

const StyledGuideBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

function Overview() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!userinfo || userinfo.role.id !== 2) navigate("/tables");
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={6}>
        <Typography variant="h4" align="center" mb={7} gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Create/Edit Form
                </Typography>
                <Typography variant="body1" color="textSecondary" mt={2}>
                  Click here to create or edit a form to collect data from your users.
                </Typography>
                <Box mt={4}>
                  <Link to="/jotform">
                    <StyledButton variant="contained" fullWidth size="large">
                      CREATE/EDIT FORM
                    </StyledButton>
                  </Link>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  View Submissions
                </Typography>
                <Typography variant="body1" color="textSecondary" mt={2}>
                  View the submissions received from your forms.
                </Typography>
                <Box mt={4}>
                  <Link to="/submissions">
                    <StyledButton variant="contained" fullWidth size="large">
                      View Submissions
                    </StyledButton>
                  </Link>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Generate QR code
                </Typography>
                <Typography variant="body1" color="textSecondary" mt={2}>
                  Generate a QR code for easy sharing and scanning of your form.
                </Typography>
                <Box mt={4}>
                  <Link to="/qrcode">
                    <StyledButton variant="contained" fullWidth size="large">
                      Generate QR Code
                    </StyledButton>
                  </Link>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12}>
            <StyledGuideBox>
              <Typography variant="h5" align="left" mb={4} gutterBottom>
                Getting Started Guide
              </Typography>
              <Typography variant="body1" align="left">
                Welcome to getcustomerdata.com, a Lead Capture System (LCS) where you can leverage
                the power of Jotform to create custom forms and capture valuable data from your
                clients. With getCustomerData, you have full control over managing and optimizing
                your form submissions. Let&apos;s get started:
                <ol style={{ marginLeft: "35px" }}>
                  <li>Create or edit a form to collect data from your users.</li>
                  <li>View the submissions received from your forms.</li>
                  <li>Generate a QR code for easy sharing and scanning.</li>
                  <li>Explore additional features and settings.</li>
                </ol>
              </Typography>
              <Typography variant="body2" align="left" mt={5}>
                We&apos;re here to support you every step of the way. If you need any assistance or
                have questions, our dedicated support team is ready to help. Get ready to maximize
                the value of your captured data with getCustomerData. Start capturing, managing, and
                gaining insights from your form submissions today!
              </Typography>
            </StyledGuideBox>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default Overview;
