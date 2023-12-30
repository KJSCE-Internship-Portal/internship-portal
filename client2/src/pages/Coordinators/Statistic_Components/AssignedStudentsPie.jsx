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
      color: colors.font,
      bold: true,
      italic: false,
      alignment: "center",
    },
    pieStartAngle: 0,
    colors: ["#4CAF50", "#91ffba"],
    backgroundColor: colors.secondary,
    chartArea: {
      left: 10,
      width: "95%",
      height: "80%",
    },
    pieSliceTextStyle: {
      fontSize: 19,
      color: "#000",
      bold: true,
      italic: false,
      alignment: "center",
    },
    is3D: true, // Enable 3D effect
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
