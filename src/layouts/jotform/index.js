import React, { useState, useEffect } from "react";
import axios from "utils/axios";
import { notification } from "antd";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import MDTypography from "components/MDTypography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import QRCode from "qrcode.react";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTable from "examples/Tables/DataTable";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

function NameInputComponent(props) {
  return (
    <MDBox mt={3}>
      <TextField style={{ width: "100%" }} id="formName" label="Form Name" type="text" {...props} />
    </MDBox>
  );
}

function DescriptionInputComponent(props) {
  return (
    <MDBox mt={3}>
      <TextField
        style={{ width: "100%" }}
        id="formDescription"
        label="Form Description"
        type="text"
        rows={3}
        multiline
        {...props}
      />
    </MDBox>
  );
}

function FieldTypeInputComponent(props) {
  return (
    <MDBox>
      <FormControl style={{ marginBottom: "10px" }} fullWidth>
        <InputLabel id="elementTypeLabel">Element Type</InputLabel>
        <Select
          style={{ height: "44px" }}
          labelId="elementTypeLabel"
          id="elementTypeInput"
          label="Element Type"
          {...props}
        >
          <MenuItem value="control_textbox">Text</MenuItem>
          {/* <MenuItem value="control_textarea">Text Area</MenuItem> */}
          <MenuItem value="control_email">Email</MenuItem>
          <MenuItem value="control_phone">Phone</MenuItem>
          {/* <MenuItem value="control_dropdown">Dropdown</MenuItem> */}
          {/* <MenuItem value="control_checkbox">Checkboxes</MenuItem> */}
          {/* <MenuItem value="control_radio">Radio Buttons</MenuItem> */}
          <MenuItem value="control_scale">Scale Rating</MenuItem>
          {/* <MenuItem value="control_matrix">Matrix</MenuItem> */}
          <MenuItem value="control_time">Time</MenuItem>
          <MenuItem value="control_datetime">Date</MenuItem>
          <MenuItem value="control_address">Address</MenuItem>
          {/* <MenuItem value="control_fileupload">File Upload</MenuItem> */}
          {/* <MenuItem value="control_image">Image Upload</MenuItem> */}
          <MenuItem value="control_signature">Signature</MenuItem>
          <MenuItem value="control_number">Number</MenuItem>
          {/* <MenuItem value="control_website">Website</MenuItem> */}
          {/* <MenuItem value="control_head">HTML</MenuItem> */}
          {/* <MenuItem value="control_accept">Terms and Conditions</MenuItem> */}
        </Select>
      </FormControl>
    </MDBox>
  );
}

function FieldNameInputComponent(props) {
  return (
    <MDBox mb={3}>
      <TextField style={{ width: "100%" }} label="Element Name" type="text" {...props} />
    </MDBox>
  );
}

function FormBuilder() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formLink, setFormLink] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [submissionsView, setSubmissionsView] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const initialValues = {
    formName: "",
    formDescription: "",
    formElements: [],
  };

  const validationSchema = Yup.object({
    formName: Yup.string().required("Required"),
    formElements: Yup.array().min(1, "At least one field is required"),
  });

  const updateUserInfo = (formId) => {
    userinfo.jotform_id = formId;
    sessionStorage.setItem("userData", JSON.stringify(userinfo));
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    // Call Django view to create new form using Jotform API
    const data = JSON.parse(JSON.stringify(values));
    data.user_id = userinfo.id;
    axios
      .post(`/jotform/create/`, data)
      .then((res) => {
        updateUserInfo(res.data.form_id);
        notification.success({
          message: res.data.message,
          placement: "bottomRight",
        });
        setFormLink(res.data.form_url);
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message || err.message,
          placement: "bottomRight",
        });
      });

    // Redirect to newly created form
  };

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

  useEffect(() => {
    if (submissionsView) initSubmissions();
  }, [submissionsView]);

  useEffect(() => {
    if (userinfo.jotform_id) {
      const jotformLink = `https://form.jotform.com/${userinfo.jotform_id}`;
      setFormLink(jotformLink);
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
                  Form Builder
                </MDTypography>
                {formLink && (
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
                      : { margin: "auto" }
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
                ) : formLink ? (
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
                ) : (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ values, isSubmitting }) => (
                      <Form style={{ width: "500px" }}>
                        <div>
                          <Field as={NameInputComponent} name="formName" id="formName" />
                          <ErrorMessage name="formName" />
                        </div>
                        <div>
                          <Field
                            as={DescriptionInputComponent}
                            name="formDescription"
                            id="formDescription"
                          />
                        </div>
                        <div style={{ margin: "20px 0" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "20px",
                            }}
                          >
                            <Divider
                              style={{
                                flexGrow: 1,
                                margin: "0 10px",
                                backgroundColor: "black",
                              }}
                            />
                            <MDTypography variant="h6">Form Elements</MDTypography>
                            <Divider
                              style={{
                                flexGrow: 1,
                                margin: "0 10px",
                                backgroundColor: "black",
                              }}
                            />
                          </div>
                          <FieldArray name="formElements" id="formElements">
                            {({ push, remove }) => (
                              <>
                                {values.formElements.map((field, index) => (
                                  <div>
                                    <div style={{ float: "right" }}>
                                      <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => remove(index)}
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    </div>
                                    <Field
                                      as={FieldTypeInputComponent}
                                      name={`formElements[${index}].type`}
                                    />
                                    <Field
                                      as={FieldNameInputComponent}
                                      name={`formElements[${index}].text`}
                                    />
                                  </div>
                                ))}
                                <Button
                                  variant="contained"
                                  onClick={() => push({ type: "", name: "" })}
                                  style={{
                                    width: "100%",
                                    borderRadius: "0",
                                    marginTop: "10px",
                                  }}
                                >
                                  <MDTypography variant="caption" color="white" fontWeight="medium">
                                    <AddIcon color="white" fontSize="large" />
                                  </MDTypography>
                                </Button>
                              </>
                            )}
                          </FieldArray>
                          <ErrorMessage name="formElements" />
                        </div>
                        <MDBox style={{ float: "right" }}>
                          <Button type="submit" disabled={isSubmitting} variant="contained">
                            <MDTypography
                              variant="caption"
                              fontSize="15px"
                              color="white"
                              fontWeight="medium"
                              style={{ paddingLeft: "5px" }}
                            >
                              Create Form
                            </MDTypography>
                          </Button>
                        </MDBox>
                      </Form>
                    )}
                  </Formik>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default FormBuilder;
