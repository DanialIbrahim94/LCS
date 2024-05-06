import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tooltip from "@mui/material/Tooltip";
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
      const jotformLink = `${process.env.REACT_APP_BACKEND_URL}submit/${userinfo.jotform_id}/`;
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
                    <Grid container spacing={6}>
                      <Grid item xs={6}>
                        <MDTypography variant="h4">
                          You have two options to market the promotion which will automatically
                          redirect them to the form you just created.
                        </MDTypography>

                        <MDTypography variant="h5" component="div" mb={3} mt={5}>
                          <span
                            style={{
                              border: "1px",
                              borderRadius: "50%",
                              borderStyle: "solid",
                              padding: "5px 15px",
                            }}
                          >
                            1
                          </span>
                        </MDTypography>
                        <p>Use this link and share it with your customers/clients</p>
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
                      </Grid>

                      <Grid item xs={6}>
                        <MDTypography gutterBottom variant="h5" component="div" mt={2} mb={3}>
                          <span
                            style={{
                              border: "1px",
                              borderRadius: "50%",
                              borderStyle: "solid",
                              padding: "5px 15px",
                            }}
                          >
                            2
                          </span>
                        </MDTypography>
                        <p>
                          You can add this QR Code to any collateral such as a table-top display or
                          to the back of your business cards.
                        </p>

                        <MDBox style={{ textAlign: "center" }}>
                          <Tooltip title="You can RIGHT CLICK and save this to your harddrive">
                            <QRCode
                              value={formLink}
                              level="H"
                              includeMargin="true"
                              renderAs="canvas"
                              size={300}
                            />
                          </Tooltip>
                        </MDBox>

                        <p>
                          NOTE: Simply do a screenshot of YOUR unique QR Code and paste on your
                          graphics.
                        </p>
                      </Grid>
                    </Grid>
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
