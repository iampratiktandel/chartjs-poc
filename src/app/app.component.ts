import { Component, ElementRef, ViewChild } from '@angular/core';
// import { Chart } from 'chart.js';
import Chart, { FontSpec, Scale, ScriptableScaleContext, Tick } from 'chart.js/auto';
import { AnyObject } from 'chart.js/types/basic';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontStyle } from './intern/intern.model';
import { color, DollarData, MillionData, UniData } from './colorModel';
import { DecimalPipe } from '@angular/common';

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

    public graphData!: any;
    public graphLegends!: any;
    public graphLegendsDisplay!: any;
    public monthData!: any;
    public datasetArray!: any;
    public policyFilterBox: any;
    public serviceFilterBox!: any;
    public serviceFilterBoxDisplay!: any;
    public monthFilterBox!: any;
    public filteredPolicy!: any;
    public filteredService!: any;
    public pushedPolicy: string[];
    public isMillion: boolean;
    public million: number;

    constructor(
        private decimalPipe: DecimalPipe
    ) {
        this.datasetArray = [];
        this.policyFilterBox = [];
        this.serviceFilterBox = [];
        this.serviceFilterBoxDisplay = [];
        this.filteredPolicy = [];
        this.filteredService = [];
        this.graphLegends = [];
        this.graphLegendsDisplay = [];
        this.pushedPolicy = [];
        this.graphData = MillionData;
        // this.graphData = DollarData;
        // this.graphData = UniData;
        this.isMillion = false;
        this.million = 1;
    }

    ngOnInit(): void {
        const d = this.graphData;
        this.monthData = [d.january, d.february, d.march, d.april, d.may, d.june, d.july, d.august, d.september, d.october, d.november, d.december];
        // this.monthData = [ {...this.graphData} ];
        this.removeRedundantService(this.monthData);

        this.million = this.isMillion ? 1000000 : 1;

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

                for (const key in policyElement) {
                    if (Object.prototype.hasOwnProperty.call(policyElement, key)) {
                        if (key === 'serviceData') {
                            const element = policyElement['serviceData'];
                            element.forEach((element: any) => {
                                this.generateServiceFilterBox(element.service);
                                const filter = this.datasetArray?.find(({ label }: any) => label === `${element.service} [${policyElement.policy}]`);
                                if (filter) {
                                    this.datasetArray.forEach((elem: any) => {
                                        if (elem.label === `${element.service} [${policyElement.policy}]`) {
                                            elem.data?.splice(monthIndex, 0, element.amount);
                                        }
                                    });
                                } else {
                                    let dummyArray: any[] = [null, null, null, null, null, null, null, null, null, null, null, null];
                                    let amount = element.amount;
                                    dummyArray.splice(monthIndex, 0, amount);
                                    let backgroundColor = this.setColor(colorIndex, monthIndex);
                                    this.datasetArray.push({
                                        label: `${element.service} [${policyElement.policy}]`,
                                        data: dummyArray,
                                        backgroundColor,
                                        stack: `Stack ${policyIndex}`
                                    })
                                }
                            });
                        }

                    }
                }

                this.generatePolicyFilterBox(policyElement.policy);
            })
        });

        this.datasetArray.forEach((elem: any) => {
            let policy = elem.label.split('[')['1'].replace(']', '');
            let service = elem.label.split('[')['0'].trim();

            if (!this.pushedPolicy.includes(policy)) {
                this.pushedPolicy.push(policy);
            }

            let isUniquePolicy = this.graphLegends.find((x: any) => x.policy === policy);
            let policyIndex = this.pushedPolicy.indexOf(policy);

            if (!isUniquePolicy) {
                this.graphLegends.push({
                    policy: policy,
                    serviceData: []
                })
            }

            let isUniqueService = this.graphLegends[policyIndex].serviceData.find((x: any) => x.service === service);
            if (!isUniqueService) {
                this.graphLegends[policyIndex].serviceData.push({
                    service: service,
                    backgroundColor: elem.backgroundColor
                })
            }

        });
        this.graphLegendsDisplay = this.graphLegends;
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
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ],
                datasets: datasetArray
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
                            label: (context: any) => {
                                let value = this.isMillion
                                    ? parseFloat(this.formatNumber(context.formattedValue)).toFixed(6) : context.formattedValue;
                                return context.dataset.label + ':' + '$' + value;
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
                            text: this.isMillion ? 'MILLIONS' : 'DOLLARS',
                        },
                        ticks: {
                            // Shorthand the millions
                            callback: (value: any, index, values) => {
                                if (this.isMillion) {
                                    return value / 1e6;
                                }
                                return value;
                            }
                        }
                    }
                }
            }
            // plugins: [ChartDataLabels]
        })
    }

    removeRedundantService(monthData: any) {
        monthData.forEach((monthElement: any) => {
            monthElement.forEach((policyElement: any) => {
                let previousService = '';
                policyElement.serviceData = policyElement.serviceData.filter((serviceElement: any) => {
                    if (serviceElement.service !== previousService) {
                        if (!this.isMillion) {
                            this.isMillion = serviceElement.amount > 1000000;
                        }
                        if (serviceElement.amount < 0) {
                            return false
                        }
                        previousService = serviceElement.service;
                        return true;
                    }
                    return false;
                });
            })
        })
    }

    formatNumber(value: string) {
        let numberStr = value.split('.')[0].replace(/,/g, '');
        switch (numberStr.length) {
            case 9: /** 100000000 */
                value = [numberStr.slice(0, 3), numberStr.slice(3)].join('.');
                break;
            case 8: /** 10000000 */
                value = [numberStr.slice(0, 2), numberStr.slice(2)].join('.');
                break;
            case 7: /** 1000000 */
                value = [numberStr.slice(0, 1), numberStr.slice(1)].join('.');
                break;
            case 6: /** 100000 */   
                value = ['0.', numberStr].join('');
                break;
            case 5: /** 10000 */
                value = ['0.0', numberStr].join('');
                break;
            case 4: /** 1000 */
                value = ['0.00', numberStr].join('');
                break;
            case 3: /** 100 */
                value = ['0.000', numberStr].join('');
                break;
            case 2: /** 10 */
                value = ['0.0000', numberStr].join('');
                break;
            case 1: /** 1 */
                value = ['0.00000', numberStr].join('');
                break;
            default:
                break;
        }
        return value;
    }

    numberFormat(
        number: number,
        decimals: number,
        decimalPoint?: string,
        thousandsSep?: string
    ): string {
        debugger
        number = +number || 0;
        decimals = +decimals;
    
        let ret,
            fractionDigits;
    
        const origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
            exponent = number.toString().split('e'),
            firstDecimals = decimals;
    
        if (decimals === -1) {
            // Preserve decimals. Not huge numbers (#3793).
            decimals = Math.min(origDec, 20);
        } else if (decimals && exponent[1] && exponent[1] as any < 0) {
            // Expose decimals from exponential notation (#7042)
            fractionDigits = decimals + +exponent[1];
            if (fractionDigits >= 0) {
                // remove too small part of the number while keeping the notation
                exponent[0] = (+exponent[0]).toExponential(fractionDigits)
                    .split('e')[0];
                decimals = fractionDigits;
            } else {
                // fractionDigits < 0
                exponent[0] = exponent[0].split('.')[0] || 0 as any;
    
                if (decimals < 20) {
                    // use number instead of exponential notation (#7405)
                    number = (exponent[0] as any * Math.pow(10, exponent[1] as any))
                        .toFixed(decimals) as any;
                } else {
                    // or zero
                    number = 0;
                }
                exponent[1] = 0 as any;
            }
        }
    
        // Add another decimal to avoid rounding errors of float numbers. (#4573)
        // Then use toFixed to handle rounding.
        const roundedNumber = (
            Math.abs(exponent[1] ? exponent[0] as any : number) +
            Math.pow(10, -Math.max(decimals, origDec) - 1)
        ).toFixed(decimals);
    
        // A string containing the positive integer component of the number
        console.log(roundedNumber);
        const strinteger = String(roundedNumber);
    
        // Leftover after grouping into thousands. Can be 0, 1 or 2.
        const thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;
    
        // Language
        // decimalPoint = pick(decimalPoint, lang.decimalPoint);
        // thousandsSep = pick(thousandsSep, lang.thousandsSep);
    
        // Start building the return
        ret = number < 0 ? '-' : '';
    
        // Add the leftover after grouping into thousands. For example, in the
        // number 42 000 000, this line adds 42.
        ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';
    
        if (+exponent[1] < 0 && !firstDecimals) {
            ret = '0';
        } else {
            // Add the remaining thousands groups, joined by the thousands separator
            ret += strinteger
                .substr(thousands)
                .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
        }
    
        // Add the decimal point and the decimal component
        if (decimals) {
            // Get the decimal component
            ret += decimalPoint + roundedNumber.slice(-decimals);
        }
    
        if (exponent[1] && +ret !== 0) {
            ret += 'e' + exponent[1];
        }
    
        return ret;
    }
    

    filterData() {
        let result = [];
        if (this.filteredPolicy.length) {
            this.graphLegendsDisplay = this.graphLegends.filter((d: any) => {
                return this.filteredPolicy.includes(d.policy);
            })
        } else {
            this.graphLegendsDisplay = this.graphLegends;
        }

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
        } else {
            result = this.datasetArray;
        }

        // this.checkMillion(this.datasetArray);

        // console.log(this.datasetArray);
        result.every((element: any) => {
            this.isMillion = element.data.some((amount: any) => amount > 1000000);
            return !this.isMillion;
        });

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
