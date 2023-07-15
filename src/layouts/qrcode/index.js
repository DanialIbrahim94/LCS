import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import QRCode from "qrcode.react";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";

function QRcode() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formLink, setFormLink] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (userinfo.jotform_id) {
      const jotformLink = `https://form.jotform.com/${userinfo.jotform_id}`;
      setFormLink(jotformLink);
    }
  }, []); // Empty array as a dependency to only run once

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <MDTypography variant="h3" color="white">
                  Share Your Form
                </MDTypography>
              </MDBox>
              <MDBox mx={4} py={3}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {formLink ? (
                  <MDBox>
                    <MDTypography variant="h4">
                      To make it easier for your clients to access the form, you have two options:
                    </MDTypography>

                    <MDTypography variant="h5" component="div" mt={3}>
                      - Share the link:
                    </MDTypography>
                    <p>You can copy the following link and share it directly with your clients:</p>
                    <MDBox alignItems="center">
                      <a
                        href={formLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "darkblue" }}
                      >
                        {formLink}
                      </a>

                      <CopyToClipboard text={formLink} onCopy={handleCopy}>
                        <IconButton sx={{ ml: 1 }} size="small">
                          <FileCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </CopyToClipboard>

                      <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        message="Copied!"
                      />
                    </MDBox>

                    <MDTypography gutterBottom variant="h5" component="div" mt={4}>
                      - Scan the QR code:
                    </MDTypography>
                    <p>
                      Alternatively, your clients can scan the QR code provided below using a QR
                      code scanner on their smartphones. This will automatically redirect them to
                      the form.
                    </p>

                    <MDBox style={{ textAlign: "center" }}>
                      <QRCode
                        value={formLink}
                        level="H"
                        includeMargin="true"
                        renderAs="canvas"
                        size={300}
                      />
                    </MDBox>
                  </MDBox>
                ) : (
                  <MDBox style={{ textAlign: "center" }} mt={4}>
                    <MDTypography gutterBottom fontWeight="medium" component="div">
                      Nothing to see in here
                    </MDTypography>
                    <SentimentDissatisfiedIcon fontSize="large" />
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default QRcode;
