import React, { Component } from "react";

import CanvasJSReact from "../canvasjs-2/canvasjs.react";
import axios from "axios";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {
    state = {
        data: undefined,
        done: false,
    };

    componentWillMount() {
        axios
            .get(`${process.env.REACT_APP_URL}/age-group`)
            .then((response) => {
                this.setState({ data: response.data });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ data: null });
            })
            .finally(() => this.setState({ done: true }));
    }

    getOptions = () => {
        if (undefined === this.state.data) return {};

        let dataPoints = [];
        for (const item of this.state.data) {
            dataPoints.push({
                y: parseFloat(
                    item["Percentage"].substring(
                        0,
                        item["Percentage"].length - 1
                    )
                ),
                label: item["AgeGroup"],
            });
        }

        return {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "COVID-19 Age Group Percentage",
            },
            data: [
                {
                    type: "pie",
                    startAngle: 75,
                    toolTipContent: "<b>{label}</b>: {y}%",
                    showInLegend: "true",
                    legendText: "{label}",
                    indexLabelFontSize: 16,
                    indexLabel: "{label}",
                    dataPoints,
                },
            ],
        };
    };

    render() {
        const options = this.getOptions();
        return (
            <div>
                {this.state.done ? (
                    <div>
                        {this.state.data !== null ? (
                            <CanvasJSChart options={options} />
                        ) : (
                            <h1>Internal Server Error</h1>
                        )}
                    </div>
                ) : (
                    <p>Waiting...</p>
                )}
            </div>
        );
    }
}

export default Chart;
