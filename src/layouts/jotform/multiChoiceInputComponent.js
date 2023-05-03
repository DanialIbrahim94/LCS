import React, { useState } from "react";
import MDBox from "components/MDBox";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

function multiChoiceInputComponent({ field, form, ...props }) {
  const [chipValue, setChipValue] = useState();
  const [chipData, setChipData] = useState([]);
  const [options, setOptions] = useState([]);
  const fieldIndex = parseInt(field.name.match(/\d+/)[0], 10);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };
  console.log(field);
  return (
    <>
      <input type="hidden" value={options} name={props.name} />
      <MDBox>
        <TextField
          label="Write the option here and click ENTER"
          type="text"
          variant="outlined"
          value={chipValue}
          style={{ width: "100%", margin: "-15px 0 10px 0" }}
          onChange={(event) => {
            setChipValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === 13 && event.target.value) {
              const newChipData = [
                ...chipData,
                { key: chipData.length, label: event.target.value },
              ];
              const newOptions = newChipData.map((data) => data.label).join(" | ");
              setChipData(newChipData);
              setOptions(newOptions);
              setChipValue("");
              const updatedFormElements = form.values.formElements.map((element, index) => {
                if (index === fieldIndex) {
                  return { ...element, options: newOptions };
                }
                return element;
              });
              form.setValues({ ...form.values, formElements: updatedFormElements });
            }
          }}
        />
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0.5,
            m: 0,
          }}
          component="ul"
          style={{ boxShadow: "none" }}
        >
          {chipData.map((data) => (
            <ListItem key={data.key}>
              <Chip
                label={data.label}
                onDelete={handleDelete(data)}
                style={{ marginBottom: "5px" }}
              />
            </ListItem>
          ))}
        </Paper>
      </MDBox>
    </>
  );
}

export default multiChoiceInputComponent;
