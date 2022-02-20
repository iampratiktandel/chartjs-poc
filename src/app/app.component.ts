import { Component, ElementRef, ViewChild } from '@angular/core';
// import { Chart } from 'chart.js';
import Chart, { FontSpec, Scale, ScriptableScaleContext, Tick } from 'chart.js/auto';
import { AnyObject } from 'chart.js/types/basic';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontStyle } from './intern/intern.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'demo-app';

  @ViewChild('myChart', { static: true })
  myChart!: ElementRef;
  public tColor!: string;
  public dataArray: number[];
  public colorArray: string[];
  public currentMonth: number;
  public fontSizeArray: number[];

  constructor() {
    this.currentMonth = new Date().getMonth();
    this.tColor = 'red';
    this.dataArray = [1,1,1,1,1,1,1,1,1,1,1,1];
    this.colorArray = ['#000','#000','#000','#000','#000','#000','#000','#000','#000','#000','#000','#000'];
    this.fontSizeArray = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    this.colorArray[this.currentMonth] = 'red';
  }

  ngOnInit(): void {
    if (this.myChart) {
      // this.drawBarCanvas();
      this.drawStackBarCanvas();
    }
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
        datasets: [
          {
            label: 'Dataset 1',
            data: this.dataArray,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            // hoverBackgroundColor: 'rgba(255, 99, 132, 0.2)',
            stack: 'Stack 0',
          },
          {
            label: 'Dataset 2',
            data: this.dataArray,
            backgroundColor: 'rgba(54, 162, 235, 1)',
            // hoverBackgroundColor: 'rgba(54, 162, 235, 0.2)',
            stack: 'Stack 0',
          },
          {
            label: 'Dataset 3',
            data: this.dataArray,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            // hoverBackgroundColor: 'rgba(75, 192, 192, 0.2)',
            stack: 'Stack 0',
          },
          // {
          //   label: 'Dataset 1',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(255, 99, 132, 1)',
          //   stack: 'Stack 1',
          // },
          // {
          //   label: 'Dataset 2',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(54, 162, 235, 1)',
          //   stack: 'Stack 1',
          // },
          // {
          //   label: 'Dataset 3',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(75, 192, 192, 1)',
          //   stack: 'Stack 1',
          // },
          // {
          //   label: 'Dataset 1',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(255, 99, 132, 1)',
          //   stack: 'Stack 2',
          // },
          // {
          //   label: 'Dataset 2',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(54, 162, 235, 1)',
          //   stack: 'Stack 2',
          // },
          // {
          //   label: 'Dataset 3',
          //   data: this.dataArray,
          //   backgroundColor: 'rgba(75, 192, 192, 1)',
          //   stack: 'Stack 2',
          // },
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                console.log(context)
                // context.dataset.hoverBackgroundColor = '#000';
                context.dataset.backgroundColor = '#000';
                // context.chart.config._config.data.datasets[2].backgroundColor = '#000';
                
                return '$' + context.dataset.backgroundColor;
              },
            },
          }
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: (c: ScriptableScaleContext) => {
                return this.highlightCurrentMonth(c.index, this.currentMonth, 'blue', 'red');
                // return c.index === this.currentMonth ? 'red' : 'black';
              },
              font: (c: ScriptableScaleContext, options: AnyObject) => {
                return this.setCurrentMonthFontStyle(c.index, this.currentMonth, 
                  { family: 'Arial', size: 12, lineHeight: 1.2, style: 'normal', weight: 'bold' },
                  { family: 'Arial', size: 16, lineHeight: 1.2, style: 'normal', weight: 'bold' }
                );
                // return c.index === this.currentMonth 
                // ? { family: 'Arial', size: 16, lineHeight: 1.2, style: 'normal', weight: 'bold' }
                // : { family: 'Arial', size: 12, lineHeight: 1.2, style: 'normal', weight: 'bold' }
              },


              // color: this.colorArray,
              // textStrokeColor: 'blue',
              // textStrokeWidth: 10
              // font: {
              //   size: 20,
              //   style: 'italic',
              //   weight: 'bold'
              // }
            },
          },
          y: {
            stacked: true
          }
        }
      },
      // plugins: [ChartDataLabels]
    })

    myChart.update();
  }
  // updateData(chart: any) {
  //     // chart.data.labels.push(label);
  //     console.log(chart);
  //     chart.data.datasets.forEach((dataset: any) => {
  //       // dataset.data.push(data);
  //       console.log(dataset)
  //       // console.log(data);
  //     });
  //     chart.update();
  //   };

  /**
   * set different color to current month tick label
   * @param index tick label index
   * @param currentMonth current month index
   * @param defaultColor color for other months labels
   * @param highlightColor color for current month label
   * @returns color
   */
  highlightCurrentMonth(index: number, currentMonth: number, defaultColor: string, highlightColor: string): string {
    return index === currentMonth ? highlightColor : defaultColor;
  }

  /**
   * set different font style for current month
   * @param index tick label index
   * @param currentMonth current month index
   * @param defaultStyle font style object for other months labels
   * @param highlightStyle font style object for current month label
   * @returns 
   */
  setCurrentMonthFontStyle(index: number, currentMonth: number, defaultStyle: FontSpec, highlightStyle: FontSpec): FontSpec {
    return index === currentMonth
    ? { family: highlightStyle.family , size: highlightStyle.size, lineHeight: highlightStyle.lineHeight, style: highlightStyle.style, weight: highlightStyle.weight }
    : { family: defaultStyle.family , size: defaultStyle.size, lineHeight: defaultStyle.lineHeight, style: defaultStyle.style, weight: defaultStyle.weight }
  }

  // color: (c) => {
  //   return c.index === this.currentMonth ? 'red' : 'black';
  // },
  // font: (c: ScriptableScaleContext, options: AnyObject) => {
  //   console.log(options)
  //   if (c.index === this.currentMonth) {
  //     return {
  //       family: 'Arial',
  //       size: 16,
  //       lineHeight: 1.2,
  //       style: 'normal',
  //       weight: 'bold'
  //     }
  //   } else {
  //     return {
  //       family: 'Arial',
  //       size: 12,
  //       lineHeight: 1.2,
  //       style: 'normal',
  //       weight: 'bold'
  //     }
  //   }
  // },
    drawBarCanvas() {
      const canvas = this.myChart.nativeElement;
      const ctx = canvas.getContext('2d');

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                // Include a dollar sign in the ticks
                callback: (value, index, ticks) => {
                  if (value === 1) {
                    this.tColor = 'red';
                  } else {
                    this.tColor = 'yellow'
                  }
                  // console.log(this.x)
                  return '$' + value;
                },
                color: this.tColor
              }
              // ticks: {
              //   callback: function (value: number | string, index: number, ticks: Tick[]) {
              //     // console.log(this.chart.options.color, tickValue)
              //     if (value === 1) {
              //       this.tColor = 'red';
              //     } else {
              //       this.tColor = 'yellow'
              //     }
              //     return this.getLabelForValue(tickValue);
              //   },

              // callback: function(val, index) {
              //   // Hide every 2nd tick label
              //   console.log(val, this.getLabelForValue(val as any))
              //   // return index === 1 ? this.getLabelForValue(val as any): '';
              //   return '$';
              // },
              // color: 'red',
              // formatter: (value, context: any) => {
              //   return context.chart.labels[context.dataIndex] + '\n' + ' ' + value + '%';
              // }
              // callbacks: {
              //   label: function (context: any) {
              //     return context.label + ':' + ' ' + context.formattedValue;
              //   },
              // },
            }
          }
        }
      })
      // this.updateData(myChart)
    }
  }
