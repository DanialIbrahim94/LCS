import React, { useState, useEffect } from "react";
import axios from "utils/axios";
import { notification } from "antd";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import FormBuilder from "./formBuilder";
import FormEditor from "./formEditor";

function Jotform() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [editorView, setEditorView] = useState(false);
  const [initialWelcomePage, setInitialWelcomePage] = useState({});
  const [initialVerificationCode, setInitialVerificationCode] = useState(false);
  const [initialReferralId, setinitialReferralId] = useState();
  const [initialValues, setInitialValues] = useState({
    formName: "Form Name",
    formElements: [],
  });

  const initJotForm = () => {
    axios
      .get(`/jotform/${userinfo.id}/`)
      .then((res) => {
        const formName = res.data.form.name;
        const welcomePage = res.data.form.welcome_page;
        const referredID = res.data.form.referral_id;
        const { questions } = res.data.form;
        const formElements = [];

        // Loop through each question in the response and format it as desired
        Object.keys(questions).forEach((key) => {
          const question = questions[key];
          const identifier = question.type;
          const { type } = question;
          const { text } = question;
          const required = question.required === "Yes";
          if (question.verificationCode && question.verificationCode === "Yes")
            setInitialVerificationCode(question.verificationCode);

          formElements.push({ identifier, type, text, required });
        });
        // Set the state with the formatted data
        setInitialValues({ formName, formElements });
        setInitialWelcomePage(welcomePage);
        setinitialReferralId(referredID);
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
    if (userinfo.jotform_id) {
      setEditorView(true);
      initJotForm();
    }
  }, []); // Empty array as a dependency to only run once variant="standard"

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
                  Form {editorView ? "Editor" : "Builder"}
                </MDTypography>
              </MDBox>
              <MDBox
                mx={4}
                py={3}
                style={
                  /* eslint-disable-next-line no-nested-ternary */
                  editorView
                    ? {
                        margin: "30px",
                        backgroundColor: "#49a3f130",
                      }
                    : { margin: "none" }
                }
              >
                {editorView ? (
                  <FormEditor
                    initialVerificationCode={initialVerificationCode}
                    initialWelcomePage={initialWelcomePage}
                    initialValues={initialValues}
                    initialReferralId={initialReferralId}
                  />
                ) : (
                  <FormBuilder setEditorView={setEditorView} />
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
