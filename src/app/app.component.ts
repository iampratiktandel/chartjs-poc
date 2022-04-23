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
    public spendByPolicyChartBind!: Chart;

    public dataArray: number[];
    public graphData!: any;
    public graphLegends!: any;
    public monthData!: any;
    public datasetArray!: any;
    public policyFilterBox: any;
    public serviceFilterBox!: any;
    public serviceFilterBoxDisplay!: any;
    public monthFilterBox!: any;
    public filteredPolicy!: any;
    public filteredService!: any;

    constructor() {
        this.dataArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.datasetArray = [];
        this.policyFilterBox = [];
        this.serviceFilterBox = [];
        this.serviceFilterBoxDisplay = [];
        this.filteredPolicy = [];
        this.filteredService = [];
        this.graphLegends = [];
        // this.graphData = MillionData;
        // this.graphData = DollarData;
        this.graphData = UniData;
    }

    ngOnInit(): void {
        const d = this.graphData;
        this.monthData = [d.january, d.february, d.march, d.april, d.may, d.june, d.july, d.august, d.september, d.october, d.november, d.december];
        // this.monthData = [ {...this.graphData} ];
        // console.log(this.monthData);


        // console.log(this.datasetArray);

        this.generateDataset(this.monthData);
        if (this.myChart) {
            // this.drawBarCanvas();
            this.drawStackBarCanvas(this.datasetArray);
        }
    }

    generateDataset(monthData: any) {
        monthData.forEach((monthElement: any, monthIndex: number) => {
            monthElement.forEach((policyElement: any, policyIndex: number) => {
                let colorIndex = policyIndex === 10 ? 0 : policyIndex;
                this.generateGraphLegends(policyElement.policy);

                // if (this.graphLegends.find((x: any) => x.policy !== policyElement.policy)) {
                //     this.generateGraphLegends(policyElement.policy);
                // }
                for (const key in policyElement) {
                    if (Object.prototype.hasOwnProperty.call(policyElement, key)) {
                        let lastPushedService = '';
                        if (key === 'serviceData') {
                            const element = policyElement['serviceData'];
                            element.forEach((element: any) => {
                                if (element.service !== lastPushedService) {
                                    this.generateServiceFilterBox(element.service);
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
                                        let backgroundColor = this.setColor(colorIndex, monthIndex);
                                        this.datasetArray.push({
                                            label: `${element.service} [${policyElement.policy}]`,
                                            data: dummyArray,
                                            backgroundColor,
                                            stack: `Stack ${policyIndex}`
                                        })
                                        this.updateGraphLegend(policyIndex, element.service, backgroundColor, dummyArray);
                                    }
                                    lastPushedService = element.service;
                                }
                            });
                        }

                    }
                }

                this.generatePolicyFilterBox(policyElement.policy);
            })
        });
        // console.log(this.policyFilterBox);
        // console.log(this.serviceFilterBox);
        // console.log(this.datasetArray);
        // console.log(this.graphLegends);
    }


    drawStackBarCanvas(datasetArray: any) {
        const canvas = this.myChart.nativeElement;
        const ctx = canvas.getContext('2d');

        if (this.spendByPolicyChartBind) {
            this.spendByPolicyChartBind.destroy();
        }

        this.spendByPolicyChartBind = new Chart(ctx, {
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
                datasets: datasetArray,
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
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context: any) {
                                return context.dataset.label + ':' + '$' + context.formattedValue;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'MONTH',
                        },
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'DOLLARS',
                        },
                    }
                }
            }
            // plugins: [ChartDataLabels]
        })
    }


    filterData() {
        let result = [];
        if (this.filteredPolicy.length && !this.filteredService.length) {
            result = this.datasetArray.filter((d: any) => {
                return this.filteredPolicy.includes(d.label.split('[')['1'].replace(']', ''));
            });
        } else if (!this.filteredPolicy.length && this.filteredService.length) {
            result = this.datasetArray.filter((d: any) => {
                return this.filteredService.includes(d.label.split('[')['0'].trim());
            });
        } else if (this.filteredPolicy.length && this.filteredService.length) {
            let subResult = this.datasetArray.filter((d: any) => {
                return this.filteredPolicy.includes(d.label.split('[')['1'].replace(']', ''));
            });
            result = subResult.filter((d: any) => {
                return this.filteredService.includes(d.label.split('[')['0'].trim());
            });
            // console.log(subResult);
        } else {
            result = this.datasetArray;
        }
        // console.log(result);
        this.drawStackBarCanvas(result);
    }

    generatePolicyFilterBox(policyName: string) {
        let isNotUnique = this.policyFilterBox.find((x: any) => x.policy === policyName);
        if (!isNotUnique) {
            this.policyFilterBox.push(
                {
                    policy: policyName,
                    isChecked: false
                }
            )
        }
    }

    generateServiceFilterBox(serviceName: string) {
        let isNotUnique = this.serviceFilterBox.find((x: any) => x.service === serviceName);
        if (!isNotUnique) {
            this.serviceFilterBox.push(
                {
                    service: serviceName,
                    isChecked: false
                }
            )
        }
        this.serviceFilterBoxDisplay = this.serviceFilterBox;
    }

    generateGraphLegends(policy: string) {
        this.graphLegends.push({
            policy: policy,
            serviceData: []
        })
        console.log(this.graphLegends);
    }

    updateGraphLegend(policyIndex: number, service: number, backgroundColor: string, data: any) {
        this.graphLegends[policyIndex].serviceData.push({
            service: service,
            backgroundColor: backgroundColor,
            data: data
        })
        // console.log(this.graphLegends);
    }

    onPolicyClick(item: any) {
        this.filteredPolicy = [];
        item.isChecked = !item.isChecked;
        this.policyFilterBox.forEach((elem: any) => {
            if (elem.isChecked) {
                this.filteredPolicy.push(elem.policy);
            }
        })
        this.filterData();
    }

    onServiceClick(item: any) {
        this.filteredService = [];
        item.isChecked = !item.isChecked;
        this.serviceFilterBox.forEach((elem: any) => {
            if (elem.isChecked) {
                this.filteredService.push(elem.service);
            }
        })
        this.filterData();
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
