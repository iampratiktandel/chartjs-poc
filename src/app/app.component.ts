import { Component, ElementRef, ViewChild } from '@angular/core';
// import { Chart } from 'chart.js';
import Chart, { FontSpec, Scale, ScriptableScaleContext, Tick } from 'chart.js/auto';
import { AnyObject } from 'chart.js/types/basic';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontStyle } from './intern/intern.model';
import { color, DollarData, MillionData, UniData } from './colorModel';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'demo-app';

    @ViewChild('myChart', { static: true })
    myChart!: ElementRef;

    public dataArray: number[];
    public graphData!: any;
    public monthData!: any;
    public datasetArray!: any;

    constructor() {
        this.dataArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.datasetArray = [];
        // this.graphData = MillionData;
        // this.graphData = DollarData;
        this.graphData = UniData;
    }

    ngOnInit(): void {
        const d = this.graphData;
        this.monthData = [d.january, d.february, d.march, d.april, d.may, d.june, d.july, d.august, d.september, d.october, d.november, d.december];
        // this.monthData = [ {...this.graphData} ];
        console.log(this.monthData);

        // console.log(this.datasetArray);

        this.generateDataset(this.monthData);
        if (this.myChart) {
            // this.drawBarCanvas();
            this.drawStackBarCanvas();
        }
    }

    generateDataset(monthData: any) {
        monthData.forEach((monthElement: any, monthIndex: number) => {
            monthElement.forEach((policyElement: any, policyIndex: number) => {
                let colorIndex = policyIndex === 10 ? 0 : policyIndex;
                for (const key in policyElement) {
                    if (Object.prototype.hasOwnProperty.call(policyElement, key)) {
                        let lastPushedService = '';
                        if (key === 'serviceData') {
                            const element = policyElement['serviceData'];
                            element.forEach((element: any) => {
                                if (element.service !== lastPushedService) {
                                    const filter = this.datasetArray?.find(({ label }: any) => label === `${element.service} [${policyElement.policy}]`);
                                    if (filter) {
                                        this.datasetArray.forEach((elem: any) => {
                                            if (elem.label === `${element.service} [${policyElement.policy}]`) {
                                                elem.data?.splice(monthIndex, 0, element.amount);
                                            }
                                        });
                                    } else {
                                        let dummyArray = [null, null, null, null, null, null, null, null, null, null, null, null];
                                        dummyArray.splice(monthIndex, 0, element.amount);
                                        this.datasetArray.push({
                                            label: `${element.service} [${policyElement.policy}]`,
                                            data: dummyArray,
                                            backgroundColor: [
                                                this.setColor(colorIndex, monthIndex)
                                            ],
                                            stack: `Stack ${policyIndex}`
                                        })
                                        this.datasetArray
                                    }
                                    lastPushedService = element.service;
                                }
                            });
                        }
                    }
                }
            })
        });
        console.log(this.datasetArray);
    }

    drawStackBarCanvas() {
        const canvas = this.myChart.nativeElement;
        const ctx = canvas.getContext('2d');

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: this.datasetArray,
                // datasets: [
                //   {
                //     label: 'Policy 1 - Service 1',
                //     data: [100, 10, 3],
                //     backgroundColor: 'rgba(255, 99, 132, 1)',
                //     stack: 'Stack 0',
                //   },
                //   {
                //     label: 'Policy 1 - Service 2',
                //     data: [50],
                //     backgroundColor: 'rgba(54, 162, 235, 1)',
                //     stack: 'Stack 0',
                //   },
                //   {
                //     label: 'Policy 2 - Service 1',
                //     data: [50],
                //     backgroundColor: 'rgba(54, 162, 235, 1)',
                //     stack: 'Stack 1',
                //   },
                //   {
                //     label: 'Policy 3 - Service 2',
                //     data: [60],
                //     backgroundColor: 'rgba(75, 192, 192, 1)',
                //     stack: 'Stack 2',
                //   },
                //   // {
                //   //   label: 'Dataset 1',
                //   //   data: this.dataArray,
                //   //   backgroundColor: 'rgba(255, 99, 132, 1)',
                //   //   stack: 'Stack 2',
                //   // },
                //   // {
                //   //   label: 'Dataset 2',
                //   //   data: this.dataArray,
                //   //   backgroundColor: 'rgba(54, 162, 235, 1)',
                //   //   stack: 'Stack 2',
                //   // },
                //   // {
                //   //   label: 'Dataset 3',
                //   //   data: this.dataArray,
                //   //   backgroundColor: 'rgba(75, 192, 192, 1)',
                //   //   stack: 'Stack 2',
                //   // },
                // ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart.js Bar Chart - Stacked'
                    },
                    //   tooltip: {
                    //     callbacks: {
                    //       label: function (context: any) {
                    //         // context.dataset.hoverBackgroundColor = '#000';
                    //         // context.dataset.backgroundColor = '#000';
                    //         // context.chart.config._config.data.datasets[2].backgroundColor = '#000';
                    //         let value = context.parsed.y.toFixed(1);
                    //         return '$' + value;
                    //       },
                    //     },
                    //   }
                },
                responsive: true,
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            count: 100
                        },
                        stacked: true
                    }
                }
            },
            // plugins: [ChartDataLabels]
        })
    }









    /**
     * set color according stack chart 
     * 
     */
    setColor(index: number, hed: number) {
        switch (index) {
            case 0:
                return this.getColorForService(hed, color.colorseries1);
            case 1:
                return this.getColorForService(hed, color.colorseries2);
            case 2:
                return this.getColorForService(hed, color.colorseries3);
            case 3:
                return this.getColorForService(hed, color.colorseries4);
            case 4:
                return this.getColorForService(hed, color.colorseries5);
            case 5:
                return this.getColorForService(hed, color.colorseries6);
            case 6:
                return this.getColorForService(hed, color.colorseries7);
            case 7:
                return this.getColorForService(hed, color.colorseries8);
            case 8:
                return this.getColorForService(hed, color.colorseries9);
            case 9:
                return this.getColorForService(hed, color.colorseries10);
        }
    }

    /**
     * set color according stack chart 
     * 
     */
    getColorForService(hed: number, series: any) {
        return series[hed];
    }
}
