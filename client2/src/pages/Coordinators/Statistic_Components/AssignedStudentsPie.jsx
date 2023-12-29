import React from "react";
import { Chart } from "react-google-charts";
import { useTheme } from "../../../Global/ThemeContext";





export default function AssignedStudentsPie({assigned, notAssigned}) {

  const {theme: colors} = useTheme();

  const data = [
    ["Type", "Students"],
    ["Assigned", assigned],
    ["Not Assigned", notAssigned],
  ];

  const options = {
    legend: "none",
    pieSliceText: "label",
    title: "Students In your Department",
    titleTextStyle: {
      fontSize: 21,
      color: colors.font, // Change this value to set the title color
      bold: true,
      italic: false,
      alignment: "center", // Center-align the title
    },
    pieStartAngle: 120,
    colors: ["#4CAF50", "#91ffba"],
    backgroundColor: colors.secondary,
    chartArea: {
      left: 10, // Adjust this value to move the pie chart to the left
      // top: 10,
      width: "95%", // Adjust this value to control the width of the chart
      height: "80%", // Adjust this value to control the height of the chart
    },
    pieSliceTextStyle: {
      fontSize: 19,
      color: '#000', // Change this value to set the pie slice label color
      bold: true,
      italic: false,
      alignment: "center", // Center-align the pie slice labels
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"350px"}
      height={"400px"}
    />
  );
}
