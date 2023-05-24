import {
    Typography,
} from "@mui/material";
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Chart from 'chart.js/auto';

//let myChart = null;

const Graph = forwardRef((props, ref) => {
    const { data, scale } = props;
    const chartRef = useRef();
    const chartInstanceRef = useRef();

    // if (data === null || data.length === 0) {
    //     return (
    //         <Typography sx={{ textAlign: "center" }}>It's empty!</Typography>
    //     );
    // }

    //var hours = Array.from(Array(24).keys())

    // if (myChart) {
    //     myChart.clear();
    //     myChart.destroy();
    // }

    // myChart = new Chart(
    //     document.getElementById(canvas).getContext('2d'),
    //     {
    //         type: 'bar',
    //         data: {
    //             labels: data.map(row => row.time),
    //             datasets: [
    //                 {
    //                     label: 'avrg power',
    //                     data: data.map(row => row.power)
    //                 }
    //             ],

    //         },
    //         options: {
    //             scales: {
    //               x: {
    //                 title: {
    //                     display: true,
    //                     text: scale
    //                 }
    //               },
    //               y: {
    //                 title: {
    //                     display: true,
    //                     text: 'Average power'
    //                 }
    //               }
    //             }
    //           }
    //     }
    // );

    useImperativeHandle(ref, () => ({
        updateData: (newData, timeTitle, dataTitle) => {
            const chartInstance = chartInstanceRef.current;

            if (chartInstance) {
                console.log(chartInstance.data.datasets[0].data);
                console.log(newData.map(row => row.power));
                console.log(chartInstance.options.scales.x.title.text);
                chartInstance.data.labels = newData.map(row => row.time);
                if (dataTitle === "Power") {
                    chartInstance.data.datasets[0].data = newData.map(row => row.power);
                    chartInstance.data.datasets[0].label = 'vid. galia';
                    chartInstance.options.scales.x.title.text = timeTitle;
                    chartInstance.options.scales.y.title.text = 'Vidutinė galia W';  
                }
                else if (dataTitle === "Usage")
                {
                    chartInstance.data.datasets[0].data = newData.map(row => row.usage);
                    chartInstance.data.datasets[0].label = 'sąnaudos';
                    chartInstance.options.scales.x.title.text = timeTitle;
                    chartInstance.options.scales.y.title.text = 'Sąnaudos kWh'; 
                }
                //chartInstance.options.scales.x.title
                chartInstance.update();
            }
        },
    }));

    useEffect(() => {
        let chartInstance;
        if (data === null || data.length === 0) {
            chartInstance = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'My dataset',
                            data: [0, 10, 5, 2, 20, 30, 45],
                            borderColor: 'red',
                            fill: false,
                        },
                    ],
                },
            });
        }
        else {
            chartInstance = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: data.map(row => row.time),
                    datasets: [
                        {
                            label: 'vid. galia',
                            data: data.map(row => row.power)
                        }
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: scale
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Vidutinė galia W'
                            }
                        }
                    }
                }
            });
        }

        chartInstanceRef.current = chartInstance;

        return () => {
            chartInstance.destroy();
        };
    }, [data, scale]);

    return <canvas ref={chartRef} />;
});

export default Graph;