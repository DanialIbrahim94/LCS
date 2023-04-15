import React, { useState } from "react";
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
          <MenuItem value="control_textarea">Text Area</MenuItem>
          <MenuItem value="control_email">Email</MenuItem>
          <MenuItem value="control_phone">Phone</MenuItem>
          <MenuItem value="control_dropdown">Dropdown</MenuItem>
          <MenuItem value="control_checkbox">Checkboxes</MenuItem>
          <MenuItem value="control_radio">Radio Buttons</MenuItem>
          <MenuItem value="control_scale">Scale Rating</MenuItem>
          <MenuItem value="control_matrix">Matrix</MenuItem>
          <MenuItem value="control_time">Time</MenuItem>
          <MenuItem value="control_datetime">Date</MenuItem>
          <MenuItem value="control_address">Address</MenuItem>
          <MenuItem value="control_fileupload">File Upload</MenuItem>
          <MenuItem value="control_image">Image Upload</MenuItem>
          <MenuItem value="control_signature">Signature</MenuItem>
          <MenuItem value="control_number">Number</MenuItem>
          <MenuItem value="control_website">Website</MenuItem>
          <MenuItem value="control_head">HTML</MenuItem>
          <MenuItem value="control_accept">Terms and Conditions</MenuItem>
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
  const [formLink, setFormLink] = useState(null);
  const initialValues = {
    formName: "",
    formDescription: "",
    formElements: [],
  };

  const validationSchema = Yup.object({
    formName: Yup.string().required("Required"),
    formElements: Yup.array().min(1, "At least one field is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    // Call Django view to create new form using Jotform API
    const data = JSON.parse(JSON.stringify(values));
    console.log(data);
    axios
      .post(`/jotform/create/`, data)
      .then((res) => {
        console.log(res);
        setFormLink(res.data.form_link);
        notification.success({
          message: res.data.message,
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.response.data.message || err.message,
          placement: "bottomRight",
        });
      });

    // Redirect to newly created form
  };

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
              </MDBox>
              <MDBox mx={4} py={3} style={{ margin: "auto" }}>
                <MDTypography variant="h5" color="black">
                  {formLink && (
                    <>
                      Try it:{" "}
                      <a href={formLink} target="_blank" rel="noreferrer">
                        {formLink}
                      </a>
                    </>
                  )}
                </MDTypography>
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
                          style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
                        >
                          <Divider
                            style={{ flexGrow: 1, margin: "0 10px", backgroundColor: "black" }}
                          />
                          <MDTypography variant="h6">Form Elements</MDTypography>
                          <Divider
                            style={{ flexGrow: 1, margin: "0 10px", backgroundColor: "black" }}
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
                                style={{ width: "100%", borderRadius: "0", marginTop: "10px" }}
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
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default FormBuilder;
