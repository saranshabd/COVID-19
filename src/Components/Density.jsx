import React, { Component } from "react";

import CanvasJSReact from "../canvasjs-2/canvasjs.react";
import axios from "axios";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Density extends Component {
    state = {
        data: undefined,
        done: false,
    };

    componentWillMount() {
        axios
            .get(`${process.env.REACT_APP_URL}/population-census`)
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
        if (!this.state.done) return {};

        const states = [
            "Delhi",
            "Maharashtra",
            "Rajasthan",
            "Jammu & Kashmir",
            "Uttar Pradesh",
            "Bihar",
            "Haryana",
            "Punjab",
            "West Bengal",
            "Gujarat",
        ];

        let dataPoints = [];
        for (let item of this.state.data) {
            if (!states.includes(item["State / Union Territory"])) continue;
            let value = item["Density"].split("(")[0];
            value = value.substring(0, value.length - 5).replace(",", "");
            dataPoints.push({
                label: item["State / Union Territory"],
                y: parseInt(value),
            });
        }

        return {
            animationEnabled: true,
            title: {
                text: "Average Density of people in some States/UTs of India",
            },
            axisX: {
                title: "States",
            },
            axisY: {
                title: "Average number of people per km^2",
            },
            data: [
                {
                    type: "line",
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

export default Density;
