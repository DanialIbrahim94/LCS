import React, { useState, useEffect } from "react";
import axios from "utils/axios";
import { notification } from "antd";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import Popup from "reactjs-popup";
import "./index.css";

function Submissions() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [submissions, setSubmissions] = useState(null);
  const [requestedLeadsCount, setRequestedLeadsCount] = useState();
  const [leadsCount, setLeadsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showRequestLeads, setShowRequestLeads] = useState(false);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [maxReaquestedLeadsCount, setMaxReaquestedLeadsCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  const getQuestions = (subs) => {
    const questions = Object.keys(subs[0].answers).map((key) => {
      const { text } = subs[0].answers[key];
      const { order } = subs[0].answers[key];
      return { order, text };
    });

    return questions;
  };

  const initSubmissionsTableData = (subs) => {
    console.log(subs);
    let cols = [
      { Header: "No", accessor: "no", width: "5%", align: "left" },
      { Header: "Submission Date", accessor: "submissionDate", width: "20%", align: "left" },
    ];
    const questions = getQuestions(subs);
    const newCols = questions
      .filter((question) => ({ order: question.order, text: question.text }))
      .map(({ order, text }) => ({
        Header: capitalize(`${order}-${text}`),
        accessor: capitalize(`${order}-${text}`),
      }));
    cols = cols.concat(newCols);
    setColumns(cols);

    const data = subs.map((item, idx) => {
      /* eslint-disable no-restricted-syntax, guard-for-in */
      const results = {
        no: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {idx + 1}
            </MDTypography>
          </MDBox>
        ),
        submissionDate: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.created_at}
            </MDTypography>
          </MDBox>
        ),
      };
      for (const key in item.answers) {
        results[`${item.answers[key].order}-${item.answers[key].text}`] = (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {typeof item.answers[key].answer === "string"
              ? item.answers[key].answer
              : item.answers[key].prettyFormat}
          </MDTypography>
        );
      }
      /* eslint-enable no-restricted-syntax */
      return results;
    });
    console.log(data);
    setRows(data);
  };

  const initSubmissions = () => {
    axios
      .get(`/jotform/${userinfo.id}/submissions/`)
      .then((res) => {
        setSubmissions(res.data.submissions);
        const subs = res.data.submissions;
        if (subs && subs.length > 0) initSubmissionsTableData(subs);
        const count = res.data.leads_count || 0;
        const total = res.data.total_leads_count || 0;
        setLeadsCount(count);
        setTotalLeadsCount(total);
        setMaxReaquestedLeadsCount(total - count);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.message,
          placement: "bottomRight",
        });
      });
  };

  const downloadSubmissions = () => {
    axios({
      url: `/jotform/${userinfo.id}/submissions/download/`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.message,
          placement: "bottomRight",
        });
      });
  };

  const handleRequestedLeadsCountChange = (e) => {
    const newRequestedLeadsCount = e.target.value;
    if (
      !newRequestedLeadsCount ||
      (newRequestedLeadsCount > 0 && newRequestedLeadsCount <= maxReaquestedLeadsCount)
    )
      setRequestedLeadsCount(newRequestedLeadsCount);
  };

  const handleRequestLeads = () => {
    if (loading) {
      notification.warning({
        message: "Your order is being processed. Please wait.",
        placement: "bottomRight",
      });
      return;
    }
    setLoading(true);

    if (!requestedLeadsCount) {
      notification.error({
        message: "Enter a valid number!",
        placement: "bottomRight",
      });
      return;
    }

    axios
      .post("leads/order/", { quantity: parseInt(requestedLeadsCount, 10), user_id: userinfo.id })
      .then((res) => {
        const paymentURL = res.data.payment_url;
        console.log(paymentURL);
        window.open(paymentURL, "_blank");

        notification.success({
          message: "Successfully requested more leads!",
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.response.data.message || "Failed to request more leads!",
          placement: "bottomRight",
        });
      })
      .finally(() => {
        setLoading(false);
        setRequestedLeadsCount(0);
        setShowRequestLeads(false);
        initSubmissions();
      });
  };

  useEffect(() => {
    if (userinfo.jotform_id) {
      initSubmissions();
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
                  Submissions
                </MDTypography>
                {userinfo && userinfo.jotform_id && (
                  <MDTypography variant="h4" color="white">
                    Leads owned: <span style={{ color: "white" }}>{leadsCount} </span>\
                    <span style={{ color: "lime", fontSize: "30px" }}> {totalLeadsCount}</span>
                  </MDTypography>
                )}
                {submissions && leadsCount > 0 ? (
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon color="white" />}
                    onClick={downloadSubmissions}
                    mx="10px"
                  >
                    <MDTypography
                      variant="caption"
                      color="white"
                      fontWeight="medium"
                      sx={{ fontSize: "15px" }}
                    >
                      Download
                    </MDTypography>
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon color="white" />}
                    onClick={downloadSubmissions}
                    mx="10px"
                    disabled
                  >
                    <MDTypography
                      variant="caption"
                      color="white"
                      fontWeight="medium"
                      sx={{ fontSize: "15px" }}
                    >
                      Download
                    </MDTypography>
                  </Button>
                )}
              </MDBox>
              <MDBox mx={4} py={3}>
                <MDBox pt={3}>
                  {(submissions === null || (submissions && leadsCount === 0)) && (
                    <MDBox style={{ textAlign: "center" }} mb={-5}>
                      <MDTypography gutterBottom fontWeight="medium" component="div">
                        Nothing to see in here
                      </MDTypography>
                      <SentimentDissatisfiedIcon fontSize="large" />
                    </MDBox>
                  )}
                  {rows && (
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {userinfo && userinfo.jotform_id && (
          <MDBox
            width="100%"
            m={2}
            px={2}
            display="flex"
            justifyContent="flex-end"
            sx={{ borderRadius: "16px" }}
          >
            <Popup
              open={showRequestLeads}
              trigger={
                <Button variant="contained" startIcon={<AddIcon color="white" />}>
                  <MDTypography variant="caption" fontSize="20px" color="white" fontWeight="medium">
                    Purchase Additional Leads
                  </MDTypography>
                </Button>
              }
              modal
              nested
            >
              {() => (
                <div className="modal" style={{ textAlign: "center", padding: "20px" }}>
                  <div>
                    <h3>Buy More Leads</h3>
                  </div>

                  <div className="content" style={{ margin: "15px auto" }}>
                    <MDBox>
                      <FormControl style={{ width: "220px", marginRight: "10px" }}>
                        <InputLabel id="request-coupons-label">
                          Amount <small>(max {maxReaquestedLeadsCount})</small>
                        </InputLabel>
                        <Input
                          type="number"
                          name="requestedLeadsCount"
                          min={1}
                          max={totalLeadsCount}
                          value={requestedLeadsCount}
                          onChange={handleRequestedLeadsCountChange}
                        />
                      </FormControl>

                      <Button
                        variant="contained"
                        endIcon={
                          loading ? (
                            <CircularProgress size={16} color="white" />
                          ) : (
                            <SendIcon color="white" />
                          )
                        }
                        mx="10px"
                        onClick={handleRequestLeads}
                      >
                        <MDTypography
                          variant="caption"
                          color="white"
                          fontWeight="medium"
                          sx={{ fontSize: "15px" }}
                        >
                          Request
                        </MDTypography>
                      </Button>
                    </MDBox>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <small>
                      <MDTypography
                        variant="body2"
                        color="black"
                        fontWeight="small"
                        sx={{ fontSize: "11px" }}
                      >
                        <span style={{ color: "red" }}>
                          <b>NOTE</b>
                        </span>
                        : THERE ARE NO REFUNDS OR RETURNS ONCE A COUPON CODE HAS BEEN ISSUED. DO NOT
                        PROCEED if you don&apos;t understand, or click on CONTACT US on
                        <a href="https://datacapturepro.com/contact">
                          {" "}
                          https://datacapturepro.com/contact
                        </a>
                      </MDTypography>
                    </small>
                  </div>
                </div>
              )}
            </Popup>
          </MDBox>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Submissions;
