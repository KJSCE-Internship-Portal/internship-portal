import React from "react";
import { Chart } from "react-google-charts";



export function CompanyProvidingInternships() {

    const data = [
        ["Name", "Students"],
        ["Axis Bank", 10],
        ["JPMC", 7],
        ["Barclays", 5],
    ];
    return (
        <Chart
            chartType="BarChart"
            width="80%"
            height="400px"
            data={data}
            chartPackages={["corechart", "controls"]}
            controls={[
                {
                    controlType: "StringFilter",
                    options: {
                        filterColumnIndex: 0,
                        matchType: "any", // 'prefix' | 'exact',
                        ui: {
                            label: "Search by name",
                        },
                    },
                },
            ]}
        />
    );
}
