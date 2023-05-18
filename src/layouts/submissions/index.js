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

function Submissions() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [submissions, setSubmissions] = useState(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
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
        setLeadsCount(res.data.leads_count || 0);
        setTotalLeadsCount(res.data.total_leads_count || 0);
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
      </MDBox>
    </DashboardLayout>
  );
}

export default Submissions;
