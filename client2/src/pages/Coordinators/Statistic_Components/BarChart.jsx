import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useTheme } from "../../../Global/ThemeContext";

function generateRandomLightColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function BarChart(props) {
  const { theme: colors } = useTheme();
  const distribution = props.distribution;

  const [data, setData] = useState([
    ["Student", "Batch", { role: "style" }],
    // ["Copper", 20, generateRandomLightColor()],
  ]);

  const barChartOptions = {
    legend: { position: "none" },
    title: "BatchWise Distribution",
    titleTextStyle: {
      fontSize: 21,
      color: colors.heading1,
      bold: true,
      italic: false,
      alignment: "center",
    },
    colors: [colors.font, colors.font, colors.font, colors.font],
    backgroundColor: colors.secondary,
    chartArea: {
      left: 50,
      width: "90%",
      height: "80%",
    },
    hAxis: {
      title: "Batch",
      titleTextStyle: {
        fontSize: 20,
        color: colors.font,
        bold: true,
        italic: false,
      },
      gridlines: { color: "transparent" }, // Set gridlines color to transparent
      minValue: 0,
      textStyle: { color: colors.font }
    },
    vAxis: {
      title: "Students",
      titleTextStyle: {
        fontSize: 18,
        color: colors.font,
        bold: true,
        italic: false,
      },
      gridlines: { color: "transparent" }, // Set gridlines color to transparent
      format: '0', // Display integer values on the Y-axis
      textStyle: { color: colors.font }, // Change the color of Y-axis labels
    },
    bar: { groupWidth: "70%" },
  };
  
  
  

  useEffect(() => {
    setData((x)=>[["Student", "Batch", { role: "style" }]])
    if (distribution && distribution.length > 0) {
      setData((prevData) => [
        ...prevData,
        ...distribution.map((info) => [
          info._id,
          info.count,
          generateRandomLightColor(),
        ]),
      ]);
    }
  }, [distribution]);

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      style={{ marginBottom: "20px" }}
      options={barChartOptions}
      data={data}
    />
  );
}
