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
import IconButton from "@mui/material/IconButton";
import QRCode from "qrcode.react";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "examples/Tables/DataTable";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FormBuilder from "./formBuilder";
import FormEditor from "./formEditor";

function Jotform() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formLink, setFormLink] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [submissionsView, setSubmissionsView] = useState(false);
  const [editorView, setEditorView] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [initialValues, setInitialValues] = useState({
    formName: "Form Name",
    formElements: [],
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  const getQuestions = (subs) => {
    const questions = Object.keys(subs[0].answers).map((key) => {
      const value = subs[0].answers[key].text;
      return { text: value };
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
      .filter((question) => question.text)
      .map((question) => ({
        Header: capitalize(question.text),
        accessor: capitalize(question.text),
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
        results[item.answers[key].text] = (
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
    setRows(data);
  };

  const initSubmissions = () => {
    axios
      .get(`/jotform/${userinfo.id}/submissions/`)
      .then((res) => {
        setSubmissions(res.data.submissions);
        if (submissions && submissions.length > 0) initSubmissionsTableData(submissions);
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

  const initJotForm = () => {
    axios
      .get(`/jotform/${userinfo.id}/`)
      .then((res) => {
        console.log(res);
        const formName = res.data.form.name;
        const { questions } = res.data.form;
        const formElements = [];

        // Loop through each question in the response and format it as desired
        Object.keys(questions).forEach((key) => {
          const question = questions[key];
          const identifier = `control_${question.type}_${question.qid}`;
          const { type } = question;
          const { text } = question;
          const required = question.required === "Yes";

          formElements.push({ identifier, type, text, required });
        });
        // Set the state with the formatted data
        setInitialValues({ formName, formElements });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.response, // .data.message || err.message,
          placement: "bottomRight",
        });
      });
  };

  useEffect(() => {
    if (submissionsView) initSubmissions();
  }, [submissionsView]);

  useEffect(() => {
    if (userinfo.jotform_id) {
      const jotformLink = `https://form.jotform.com/${userinfo.jotform_id}`;
      setFormLink(jotformLink);
      initSubmissions();
      initJotForm();
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
                  Form Builder
                </MDTypography>

                {!submissionsView && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon color="white" />}
                    onClick={() => setEditorView(!editorView)}
                    style={{ marginLeft: "auto", marginRight: "15px" }}
                  >
                    <MDTypography
                      variant="caption"
                      color="white"
                      fontWeight="medium"
                      sx={{ fontSize: "15px" }}
                    >
                      {editorView ? "View Form" : "Edit Form"}
                    </MDTypography>
                  </Button>
                )}
                {formLink && !editorView && (
                  <>
                    {submissionsView && submissions && submissions.length !== 0 && (
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
                    )}
                    <Button
                      variant="outlined"
                      startIcon={
                        submissionsView ? (
                          <ArrowBackIcon color="white" />
                        ) : (
                          <TableRowsIcon color="white" />
                        )
                      }
                      onClick={() => setSubmissionsView(!submissionsView)}
                      mx="10px"
                    >
                      <MDTypography
                        variant="caption"
                        color="white"
                        fontWeight="medium"
                        sx={{ fontSize: "15px" }}
                      >
                        {submissionsView ? "Back" : "Submissions"}
                      </MDTypography>
                    </Button>
                  </>
                )}
              </MDBox>
              <MDBox
                mx={4}
                py={3}
                style={
                  /* eslint-disable-next-line no-nested-ternary */
                  !submissionsView
                    ? formLink
                      ? {
                          margin: "30px",
                          backgroundColor: "#49a3f130",
                        }
                      : { margin: "none" }
                    : null
                }
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {submissionsView ? (
                  <MDBox pt={3}>
                    {submissions && submissions.length === 0 && (
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
                ) : /* eslint-disable-next-line no-nested-ternary */
                formLink && !editorView ? (
                  <MDBox style={{ textAlign: "center" }}>
                    <MDTypography gutterBottom variant="h5" component="div">
                      To access your form, Scan this QR code:
                    </MDTypography>

                    <QRCode
                      value={formLink}
                      level="H"
                      includeMargin="true"
                      renderAs="canvas"
                      size={200}
                    />
                    <MDTypography variant="h5" component="div" style={{ marginTop: "20px" }}>
                      Or use this link:
                    </MDTypography>
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
                  </MDBox>
                ) : !editorView ? (
                  <FormBuilder setFormLink={setFormLink} />
                ) : (
                  <FormEditor initialValues={initialValues} />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Jotform;
