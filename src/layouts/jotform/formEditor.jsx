/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "utils/axios";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { notification } from "antd";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import ClearIcon from "@mui/icons-material/Clear";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EmailIcon from "@mui/icons-material/Email";
import RoomIcon from "@mui/icons-material/Room";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import Looks3Icon from "@mui/icons-material/Looks3";
import InputBase from "@mui/material/InputBase";
import Rating from "@mui/material/Rating";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const useStyles = makeStyles({
  input: {
    textAlign: "center",
    "& input": {
      textAlign: "center",
    },
  },
});

const StyledRating = styled(Rating)(({ theme }) => ({
  fontSize: "3rem",
}));

const drawerWidth = 240;

function NameInputComponent(props) {
  return (
    <MDBox>
      <InputBase
        variant="standard"
        style={{ width: "100%" }}
        className={useStyles().input}
        id="formName"
        label="Form Name"
        type="text"
        {...props}
      />
    </MDBox>
  );
}

function FieldNameInputComponent(props) {
  return (
    <MDBox>
      <InputBase
        style={{ width: "100%" }}
        label="Element Name"
        type="text"
        variant="standard"
        {...props}
      />
    </MDBox>
  );
}

function FieldDescriptionInputComponent(props) {
  return (
    <MDBox mb={3}>
      <InputBase
        style={{ fontSize: "12px", width: "100%" }}
        label="Element Description"
        type="text"
        variant="standard"
        size="small"
        {...props}
      />
    </MDBox>
  );
}

function FieldRequiredCheckboxComponent(props) {
  return (
    <FormControlLabel
      style={{ margin: "0", marginTop: "5px" }}
      control={<Checkbox size="small" {...props} defaultChecked />}
      label="Required"
    />
  );
}

/* <MenuItem value="control_textbox">Text</MenuItem> */
/* <MenuItem value="control_email">Email</MenuItem> */
/* <MenuItem value="control_phone">Phone</MenuItem> */
/* <MenuItem value="control_scale">Star Rating</MenuItem> */
/* <MenuItem value="control_time">Time</MenuItem> */
/* <MenuItem value="control_address">Address</MenuItem> */
/* <MenuItem value="control_number">Number</MenuItem> */

/* <MenuItem value="control_datetime">Date</MenuItem> */
/* <MenuItem value="control_signature">Signature</MenuItem> */

function ElementList(push) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.level1" }} aria-label="Items">
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_textbox_fullname",
              type: "control_textbox",
              text: "Full Name",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Full Name" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_textbox",
              type: "control_textbox",
              text: "Text Input",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Text Input" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_email",
              type: "control_email",
              text: "Email",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Email" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_phone",
              type: "control_phone",
              text: "Phone",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary="Phone" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_scale",
              type: "control_scale",
              text: "Type a question",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Star rating" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_time",
              type: "control_time",
              text: "Pick a Time",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <AccessTimeFilledIcon />
          </ListItemIcon>
          <ListItemText primary="Pick a Time" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_address",
              type: "control_address",
              text: "Address",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <RoomIcon />
          </ListItemIcon>
          <ListItemText primary="Address" />
        </ListItemButton>
      </ListItem>
      <ListItem style={{ borderBottom: "1px solid #00000038" }} disablePadding>
        <ListItemButton
          onClick={() =>
            push({
              identifier: "control_number",
              type: "control_number",
              text: "Number",
              required: true,
            })
          }
        >
          <ListItemIcon>
            <Looks3Icon />
          </ListItemIcon>
          <ListItemText primary="Number" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

function getFieldRepr(field) {
  switch (field.identifier) {
    case "control_textbox_fullname":
      return (
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="First Name" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Last Name" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
        </Grid>
      );
    case "control_textbox":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Last Name" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
        </Grid>
      );
    case "control_email":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Email" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
        </Grid>
      );
    case "control_phone":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={3} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Area Code" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
          <Grid item xs={9} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Phone Number" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
        </Grid>
      );
    case "control_scale":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "0" }}>
            <StyledRating name="Star rating" value={3} size="large" />
          </Grid>
        </Grid>
      );
    case "control_time":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={4} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Hour" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
          <Grid item xs={4} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="Minutes" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
          <Grid item xs={4} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField label="PM" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
        </Grid>
      );
    case "control_address":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "7px" }}>
            <TextField
              label="Street Address"
              variant="outlined"
              style={{ width: "100%" }}
              disabled
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "7px" }}>
            <TextField
              label="Street Address Line 2"
              variant="outlined"
              style={{ width: "100%" }}
              disabled
            />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center", paddingTop: "7px" }}>
            <TextField label="City" variant="outlined" style={{ width: "100%" }} disabled />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center", paddingTop: "7px" }}>
            <TextField
              label="State / Province"
              variant="outlined"
              style={{ width: "100%" }}
              disabled
            />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center", paddingTop: "7px" }}>
            <TextField
              label="Postal / Zip Code"
              variant="outlined"
              style={{ width: "100%" }}
              disabled
            />
          </Grid>
        </Grid>
      );
    case "control_number":
      return (
        <Grid container spacing={2} style={{ padding: "0" }}>
          <Grid item xs={12} style={{ textAlign: "center", paddingTop: "0" }}>
            <TextField
              label="e.g. 23"
              type="number"
              variant="outlined"
              style={{ width: "100%" }}
              disabled
            />
          </Grid>
        </Grid>
      );
    default:
      return null;
  }
}

function FormEditor({ initialValues }) {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
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
      .put(`/jotform/${userinfo.id}/update/`, data)
      .then((res) => {
        updateUserInfo(res.data.form_id);
        notification.success({
          message: res.data.message,
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message || err.message,
          placement: "bottomRight",
        });
      });

    // Redirect to newly created form
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <Form>
          <div style={{ textAlign: "center" }}>
            <Field as={NameInputComponent} name="formName" id="formName" defaultValue="Form Name" />
          </div>
          <div style={{ margin: "20px 0", minHeight: "500px" }}>
            <FieldArray name="formElements" id="formElements">
              {({ push, remove }) => (
                <Container
                  disableGutters
                  maxWidth="false"
                  style={{ boxSizing: "content-box", borderStyle: "dashed", minHeight: "500px" }}
                >
                  <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <AppBar
                      style={{ backgroundColor: "cadetblue" }}
                      position="absolute"
                      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    >
                      <Toolbar>
                        <Typography variant="h6" noWrap component="div" style={{ color: "white" }}>
                          Form Elements
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <Drawer
                      sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                          position: "absolute",
                          height: "auto",
                          width: drawerWidth,
                          borderRadius: 0,
                          margin: "64px 0 0 0",
                          boxSizing: "border-box",
                          zIndex: 0,
                        },
                      }}
                      variant="permanent"
                      anchor="left"
                    >
                      <Box sx={{ overflow: "auto" }}>{ElementList(push)}</Box>
                    </Drawer>
                    <Box
                      component="main"
                      style={{ minHeight: "452px", backgroundColor: "lightblue" }}
                      sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
                    >
                      <Toolbar />
                      {values.formElements.map((field, index) => (
                        <div>
                          <div
                            style={{
                              borderRadius: "4px",
                              borderTopLeftRadius: "0",
                              borderBottomLeftRadius: "0",
                              backgroundColor: "white",
                              float: "right",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => remove(index)}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </div>
                          <div
                            style={{
                              marginRight: "30px",
                              marginBottom: "30px",
                              padding: "10px 20px 10px 20px",
                              backgroundColor: "white",
                              borderRadius: "4px",
                              borderTopRightRadius: "0",
                            }}
                          >
                            <Field
                              type="hidden"
                              name={`formElements[${index}].type`}
                              value={field.type}
                            />
                            <Field
                              as={FieldNameInputComponent}
                              name={`formElements[${index}].text`}
                            />
                            <Field
                              as={FieldDescriptionInputComponent}
                              name={`formElements[${index}].description`}
                              placeholder="Description"
                            />

                            {getFieldRepr(field, index)}
                            <Field
                              as={FieldRequiredCheckboxComponent}
                              name={`formElements[${index}].required`}
                            />
                          </div>
                        </div>
                      ))}
                    </Box>
                  </Box>
                </Container>
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
                Save
              </MDTypography>
            </Button>
          </MDBox>
        </Form>
      )}
    </Formik>
  );
}

FormEditor.propTypes = {
  initialValues: PropTypes.func.isRequired,
};

export default FormEditor;
