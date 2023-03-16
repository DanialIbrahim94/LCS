import axios from "utils/axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DataTable from "examples/Tables/DataTable";
import SendIcon from "@mui/icons-material/Send";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import Popup from "reactjs-popup";

function couponsRecharge(props) {
  const [showOrders, setShowOrders] = useState(false);
  const [rows, setRows] = useState([]);
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [requestedCoupons, setRequestedCoupons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showRequestCoupons, setShowRequestCoupons] = useState(false);
  const [init, setInit] = useState(false);
  const columns = [
    { Header: "ID", accessor: "id", width: "20%", align: "left" },
    { Header: "Status", accessor: "status", width: "30%", align: "left" },
    { Header: "Total cost", accessor: "total", width: "20%", align: "center" },
    { Header: "Currency", accessor: "currency", width: "10%", align: "center" },
    { Header: "action", accessor: "action", width: "20%", align: "center" },
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
          item.status !== "completed" ? (
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
                  axios
                    .get(`/orders/${item.id}/verify/`)
                    .then((res) => {
                      const data0 = res.data;
                      if (data0 && data0.is_valid)
                        notification.success({
                          message: "New coupons added to inventory!",
                          placement: "bottomRight",
                        });
                      getOrders();
                      props.updateCoupons();
                    })
                    .catch((err) => {
                      console.log(err);
                      notification.error({
                        message: err.response.data.message || err.message,
                        placement: "bottomRight",
                      });
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
                  Verify
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
      .get(`/orders/${userinfo.id}`)
      .then((res) => {
        const { data } = res.data;
        if (data && data.length > 0) setShowOrders(true);
        updateRowsData(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const checkCouponsThreshold = () => {
    const couponsAmount = userinfo.coupons_amount;
    const couponsMinimumAmount = userinfo.coupons_minimum_amount;
    const couponsAlreadyRequested = userinfo.coupons_already_requested || false;
    console.log(couponsAlreadyRequested, couponsAmount, couponsMinimumAmount);

    if (!couponsAlreadyRequested && couponsAmount < couponsMinimumAmount) {
      setShowRequestCoupons(true);
      userinfo.coupons_already_requested = true;
      sessionStorage.setItem("userData", JSON.stringify(userinfo));
    }

    setInit(true);
  };

  const handleRequestCoupons = () => {
    if (loading) return;

    if (!requestedCoupons) {
      notification.error({
        message: "Select a valid option!",
        placement: "bottomRight",
      });
      return;
    }

    setLoading(true);
    axios
      .post("/coupons/request/", { amount: requestedCoupons, user_id: userinfo.id })
      .then((res) => {
        const paymentURL = res.data.payment_url;
        console.log(paymentURL);
        window.open(paymentURL, "_blank");

        notification.success({
          message: "Successfully requested new coupons!",
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: err.response.data.message || "Failed to request coupons!",
          placement: "bottomRight",
        });
      })
      .finally(() => {
        setLoading(false);
        setRequestedCoupons(0);
        setShowRequestCoupons(false);
        getOrders();
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      {/* Check if the user needs to recharge */}
      {!init && userinfo.role.id === 3 && checkCouponsThreshold()}

      {showOrders && (
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
            </Card>
          </Grid>
        </Grid>
      )}

      {userinfo.role.id === 3 && (
        <MDBox width="100%" mt={2} px={2} display="flex" justifyContent="flex-end">
          <Popup
            open={showRequestCoupons}
            trigger={
              <Button variant="contained" startIcon={<AddIcon color="white" />}>
                <MDTypography variant="caption" fontSize="20px" color="white" fontWeight="medium">
                  Request Coupons
                </MDTypography>
              </Button>
            }
            modal
            nested
          >
            {() => (
              <div className="modal" style={{ textAlign: "center" }}>
                <div>
                  <h3>Request New Coupons</h3>
                </div>

                <div className="content" style={{ margin: "15px auto" }}>
                  <MDBox>
                    <FormControl style={{ width: "150px", marginRight: "10px" }}>
                      <InputLabel id="request-coupons-label">Amount</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={requestedCoupons}
                        label="Amount"
                        onChange={(event) => setRequestedCoupons(event.target.value)}
                        style={{ height: "40px" }}
                      >
                        <MenuItem value={0}>-</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={250}>250</MenuItem>
                        <MenuItem value={500}>500</MenuItem>
                        <MenuItem value={1000}>1000</MenuItem>
                        <MenuItem value={1500}>1500</MenuItem>
                      </Select>
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
                      onClick={handleRequestCoupons}
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
              </div>
            )}
          </Popup>
        </MDBox>
      )}
    </>
  );
}

export default couponsRecharge;
