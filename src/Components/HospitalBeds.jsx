import React, { Component } from "react";

import CanvasJSReact from "../canvasjs-2/canvasjs.react";
import axios from "axios";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HospitalBeds extends Component {
    state = {
        data: undefined,
        done: false,
    };

    componentWillMount() {
        axios
            .get(`${process.env.REACT_APP_URL}/hospital-beds`)
            .then((response) => {
                this.setState({ data: response.data });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ data: null });
            })
            .finally(() => {
                console.log(this.state.data);
                this.setState({ done: true });
            });
    }

    getOptions = () => {
        if (!this.state.done || [undefined, null].includes(this.state.data))
            return {};

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
            if (!states.includes(item["State/UT"])) continue;
            dataPoints.push({
                label: item["State/UT"],
                y: parseInt(item["TotalPublicHealthFacilities_HMIS"]),
            });
        }

        return {
            animationEnabled: true,
            theme: "light2",
            title: {
                text:
                    "Total number of Health Facilities in some States/UTs of India",
            },
            axisX: {
                title: "States",
                reversed: true,
            },
            axisY: {
                title: "Total number of Health Facilities",
                labelFormatter: this.addSymbols,
            },
            data: [
                {
                    type: "bar",
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

export default HospitalBeds;
