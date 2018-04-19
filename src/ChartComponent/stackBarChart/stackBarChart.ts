import { Component, ViewChild, Input } from '@angular/core';
import { NavController, Platform, ActionSheetController, PopoverController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'stackBarChart',
  templateUrl: 'stackBarChart.html',
})

export class StackBarChart {


  @Input('stackBarChartTitle') stackBarTitle: any;
  @Input('stackBarChartValue') stackBarValue: any;
  @Input('stackBarChartDate') Date: any;

  chartData: any;

  timeValue1: any;
  timeValue2: any;
  timeValue3: any;
  timeValue4: any;

  countValue1: any;
  countValue2: any;
  countValue3: any;
  countValue4: any;

  thresholdValue1: any;
  thresholdValue2: any;
  thresholdValue3: any;
  thresholdValue4: any;

  seconds1: any;
  seconds2: any;
  seconds3: any;
  seconds4: any;

  @ViewChild('stackBarChartCanvas') stackBarChartCanvas;
  GroupBarLineChart: any;

  constructor
    (
    public navCtrl: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public restApiService: RestApiServiceProvider,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
    ) {

  }

  ngOnInit() {
    console.log(" injected Title ...." + this.stackBarTitle);
    console.log(" injected Date ...." + this.Date);
    console.log(" injected lineValue ...." + this.stackBarValue);

    let chartObject = JSON.parse(this.stackBarValue);
    this.chartData = chartObject["NOTIF_000"];

    var hms = '02:04:33';



    this.thresholdValue1 = this.chartData[0].Threshold;
    this.countValue1 = this.chartData[0].Count;
    this.timeValue1 = this.chartData[0].Time;
    var timeValueSplit1 = this.timeValue1.split(':');
    this.seconds1 = (+timeValueSplit1[0]) * 60 * 60 + (+timeValueSplit1[1]) * 60 + (+timeValueSplit1[2]);
    let int = parseInt(localStorage.getItem(this.timeValue1))
    console.log("Percent: " + this.thresholdValue1 + " Time: " + this.timeValue1 + " Count: " + this.countValue1 + " Convert: " + this.seconds1);

    this.thresholdValue2 = this.chartData[1].Threshold;
    this.countValue2 = this.chartData[1].Count;
    this.timeValue2 = this.chartData[1].Time;
    var timeValueSplit2 = this.timeValue2.split(':');
    this.seconds2 = (+timeValueSplit2[0]) * 60 * 60 + (+timeValueSplit2[1]) * 60 + (+timeValueSplit2[2]);
    console.log("Percent: " + this.thresholdValue2 + " Time: " + this.timeValue2 + " Count: " + this.countValue2 + " Convert: " + this.seconds2);

    this.thresholdValue3 = this.chartData[2].Threshold;
    this.countValue3 = this.chartData[2].Count;
    this.timeValue3 = this.chartData[2].Time;
    var timeValueSplit3 = this.timeValue3.split(':');
    this.seconds3 = (+timeValueSplit3[0]) * 60 * 60 + (+timeValueSplit3[1]) * 60 + (+timeValueSplit3[2]);
    console.log("Percent: " + this.thresholdValue3 + " Time: " + this.timeValue3 + " Count: " + this.countValue3 + " Convert: " + this.seconds3);

    this.thresholdValue4 = this.chartData[3].Threshold;
    this.countValue4 = this.chartData[3].Count;
    this.timeValue4 = this.chartData[3].Time;
    var timeValueSplit4 = this.timeValue4.split(':');
    this.seconds4 = (+timeValueSplit4[0]) * 60 * 60 + (+timeValueSplit4[1]) * 60 + (+timeValueSplit4[2]);
    console.log("Percent: " + this.thresholdValue4 + " Time: " + this.timeValue4 + " Count: " + this.countValue4 + " Convert: " + this.seconds4);

    this.getChart = this.stackBarChart(this.thresholdValue1, this.thresholdValue2, this.thresholdValue3, this.thresholdValue4,
      this.timeValue1, this.timeValue2, this.timeValue3, this.timeValue4,
      this.countValue1, this.countValue2, this.countValue3, this.countValue4,
      this.seconds1, this.seconds2, this.seconds3, this.seconds4);
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  stackBarChart(thresholdValue1, thresholdValue2, thresholdValue3, thresholdValue4,
    timeValue1, timeValue2, timeValue3, timeValue4,
    countValue1, countValue2, countValue3, countValue4,
    seconds1, seconds2, seconds3, seconds4) {
    var data = {
      labels: [thresholdValue1, thresholdValue2, thresholdValue3, thresholdValue4],
      datasets: [
        {
          label: "Time Taken",
          fill: false,
          type: 'line',
          //yAxes:"1",
          yAxisID: '1',
          //yAxesGroup: "1",
          lineTension: 0.1,
          backgroundColor: "#4365B0",
          borderColor: "#4365B0",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "#F29220",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 7,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#F29220",
          pointHoverBorderColor: "#F29220",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [seconds1, seconds2, seconds3, seconds4],
          data_1: [timeValue1, timeValue2, timeValue3, timeValue4],
          spanGaps: false,
        },
        {
          label: "Counts",
          fill: false,
          type: 'bar',
          //yAxes:"1",
          //yAxesGroup: "0",
          yAxisID: '0',
          lineTension: 0.1,
          backgroundColor: "#4CA5DB",
          borderColor: "#4CA5DB",
          borderCapStyle: 'butt',
          borderDash: [5, 8],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "#4CA5DB",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#4CA5DB",
          pointHoverBorderColor: "#4CA5DB",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [countValue1, countValue2, countValue3, countValue4],
          spanGaps: false,
        }
      ]
    };

    let options = {
      scales: {
        xAxes: [
          {
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Sent Percentage'
            }
          }
        ],
        yAxes: [{
          //name: "0",
          scalePositionLeft: true,
          position: "left",
          id: "0",
          stacked: true,
          ticks: { beginAtZero: true },
          scaleFontColor: "rgba(151,137,200,0.8)",
          scaleLabel: {
            display: true,
            labelString: 'Notification Count'
          },
        },
        {
          //name: "1",
          position: "right",
          id: "1",
          scalePositionLeft: false,
          stacked: true,
          //ticks: { beginAtZero: true },

          // ticks: {
          //   callback: function(value, index, values) {
          //     return value + "s";
          //   }
          // },

         /* tooltips: {
            enabled: true,
            mode: 'single',

          callback: function(value, index, values) {
              return value + "s";
            }
          },*/

          scaleLabel: {
            display: true,
            labelString: 'Time Taken (in sec)'
          },
          //scaleFontColor: "rgba(151,137,200,0.8)"
        }

        ]
      }
    }
    return this.getChart(this.stackBarChartCanvas.nativeElement, "bar", data, options);
  }
}