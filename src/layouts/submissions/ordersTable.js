import axios from "utils/axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DataTable from "examples/Tables/DataTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function OrdersTable({ updateLeads, showOrders }) {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    { Header: "ID", accessor: "id", width: "20%", align: "left" },
    { Header: "Status", accessor: "status", width: "15%", align: "left" },
    { Header: "Created on", accessor: "date_created", width: "15%", align: "left" },
    { Header: "Total cost", accessor: "total", width: "20%", align: "center" },
    { Header: "Currency", accessor: "currency", width: "10%", align: "center" },
    { Header: "action", accessor: "action", width: "20%", align: "center" },
  ];
  const steps = [
    { no: "Step 1: ", step: 'Click At "Purchase Additional Leads"' },
    {
      no: "Step 2: ",
      step: "Select Your Desired Quantity, And You Will Be Redirected To Our Site To Complete The Purchase.",
    },
    {
      no: "Step 3: ",
      step: "Fill Out Your Payment Details, The Quantity Will Already Be Preselected And Check Out.",
    },
    { no: "Step 4: ", step: "You Will Be Redirected To A Thank You Page" },
    {
      no: "Step 5: ",
      step: "Go Back To Your Dashboard and Click On Release leads - Your Available Leads Will Be Updated Instantly.",
    },
  ];

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const updateRowsData = (data) => {
    const processedRows = data.map((item) => {
      const arr = {
        id: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.id}
            </MDTypography>
          </MDBox>
        ),
        status: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {capitalize(item.status)}
            </MDTypography>
          </MDBox>
        ),
        date_created: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {new Date(item.date_created).toLocaleString()}
            </MDTypography>
          </MDBox>
        ),
        total: (
          <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.total}
            </MDTypography>
          </MDBox>
        ),
        currency: (
          <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.currency}
            </MDTypography>
          </MDBox>
        ),
        action:
          item.status !== "processing" ? (
            <MDTypography
              component="a"
              href="#"
              onClick={() => {
                window.open(item.payment_url, "_blank");
              }}
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              Checkout <OpenInNewIcon />
            </MDTypography>
          ) : (
            <MDBox variant="gradient" bgColor="success" borderRadius="lg" coloredShadow="info">
              <Button
                py={1}
                px={2}
                endIcon={<PublishedWithChangesIcon color="white" />}
                onClick={() => {
                  setLoading(true);
                  axios
                    .get(`/lead-orders/${item.id}/verify/`)
                    .then((res) => {
                      const data0 = res.data;
                      if (data0 && data0.is_valid)
                        notification.success({
                          message: "New leads acquired! Congratulations!",
                          placement: "bottomRight",
                        });
                      getOrders();
                      updateLeads();
                    })
                    .catch((err) => {
                      console.log(err);
                      notification.error({
                        message: err.response.data.message || err.message,
                        placement: "bottomRight",
                      });
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                <MDTypography
                  component="a"
                  href="#"
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                >
                  Release Leads
                </MDTypography>
              </Button>
            </MDBox>
          ),
      };
      return arr;
    });
    setRows(processedRows);
  };

  const getOrders = () => {
    setLoading(true);
    axios
      .get(`/lead-orders/${userinfo.id}`)
      .then((res) => {
        const { data } = res.data;
        updateRowsData(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getOrders();
  }, []);

  return showOrders ? (
    <>
      <Grid container spacing={6} style={{ marginTop: "-5px" }}>
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
              <MDBox>
                <MDTypography variant="h3" color="white">
                  Requested Order(s): {rows.length}
                </MDTypography>
              </MDBox>
              <MDBox>
                <IconButton
                  color="white"
                  fontWeight="medium"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    updateRowsData([]);
                    getOrders();
                  }}
                >
                  {loading ? (
                    <CircularProgress color="white" size={36} />
                  ) : (
                    <RefreshIcon color="white" onClick={getOrders} fontSize="large" />
                  )}
                </IconButton>
              </MDBox>
            </MDBox>
            <MDBox pt={3}>
              {rows && rows.length > 0 ? (
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              ) : (
                <DataTable
                  table={{
                    columns,
                    rows: [
                      {
                        id: "-",
                        status: "-",
                        date_created: "-",
                        total: "-",
                        currency: "-",
                        action: "-",
                      },
                    ],
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={6} style={{ marginTop: "-5px" }}>
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
              <MDBox>
                <MDTypography variant="h3" color="white">
                  How to purchase additional leads:
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox pt={3}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {steps.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">
                          <b>{row.no}</b>
                          {row.step}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </>
  ) : (
    <span />
  );
}

OrdersTable.propTypes = {
  updateLeads: PropTypes.func.isRequired,
  showOrders: PropTypes.func.isRequired,
};

export default OrdersTable;
