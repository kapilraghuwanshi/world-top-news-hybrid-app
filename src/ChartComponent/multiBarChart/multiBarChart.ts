import { Component, ViewChild, Input } from '@angular/core';
import { NavController, Platform, ActionSheetController, PopoverController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'multiBarChart',
  templateUrl: 'multiBarChart.html',
})

export class MultiBarChart {

  @Input('multiBarChartTitle') multiBarTitle: any;
  @Input('multiBarChartValue') multiBarValue: any;
  @Input('multiBarChartDate') Date: any;

  chartData: any;

  sentValue1: any;
  sentValue2: any;
  sentValue3: any;
  sentValue4: any;

  notSentValue1: any;
  notSentValue2: any;
  notSentValue3: any;
  notSentValue4: any;

  thresholdValue1: any;
  thresholdValue2: any;
  thresholdValue3: any;
  thresholdValue4: any;

  @ViewChild('multiBarChartCanvas') multiBarChartCanvas;
  MultiBarChart: any;

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
    console.log(" injected Title ...." + this.multiBarTitle);
    console.log(" injected Date ...." + this.Date);
    console.log(" injected lineValue ...." + this.multiBarValue);

    let chartObject = JSON.parse(this.multiBarValue);
    this.chartData = chartObject["NOTIF_044"];

    this.thresholdValue1 = this.chartData[0].Threshold;
    this.sentValue1 = this.chartData[0].Sent;
    this.notSentValue1 = this.chartData[0].NotSent;
    console.log("Percent: " + this.thresholdValue1 + " Sent: " + this.sentValue1 + " Not Sent: " + this.notSentValue1);

    this.thresholdValue2 = this.chartData[1].Threshold;
    this.sentValue2 = this.chartData[1].Sent;
    this.notSentValue2 = this.chartData[1].NotSent;
    console.log("Percent: " + this.thresholdValue2 + " Sent: " + this.sentValue2 + " Not Sent: " + this.notSentValue2);

    this.thresholdValue3 = this.chartData[2].Threshold;
    this.sentValue3 = this.chartData[2].Sent;
    this.notSentValue3 = this.chartData[2].NotSent;
    console.log("Percent: " + this.thresholdValue3 + " Sent: " + this.sentValue3 + " Not Sent: " + this.notSentValue3);

    this.thresholdValue4 = this.chartData[3].Threshold;
    this.sentValue4 = this.chartData[3].Sent;
    this.notSentValue4 = this.chartData[3].NotSent;
    console.log("Percent: " + this.thresholdValue4 + " Sent: " + this.sentValue4 + " Not Sent: " + this.notSentValue4);

 
    this.getChart = this.multiBarChart(this.thresholdValue1,this.thresholdValue2,this.thresholdValue3,this.thresholdValue4,
                this.sentValue1,this.sentValue2,this.sentValue3,this.sentValue4, 
                this.notSentValue1,this.notSentValue2,this.notSentValue3,this.notSentValue4);
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  multiBarChart(thresholdValue1,thresholdValue2,thresholdValue3,thresholdValue4,
                sentValue1,sentValue2,sentValue3,sentValue4, 
                notSentValue1,notSentValue2,notSentValue3,notSentValue4,) {
    var data = {
      labels: [thresholdValue1, thresholdValue2, thresholdValue3, thresholdValue4],
      datasets: [ 
        {
          label: "Not Sent",
          fill: false,
          type: 'line',
          //yAxes:"1",
          //yAxesGroup: "0",
          yAxisID: '0',
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
          data: [notSentValue1, notSentValue2, notSentValue3, notSentValue4],       
          spanGaps: false,
        },
        {
          label: "Sent",
          fill: false,
          type: 'bar',
          //yAxes:"1",
          yAxisID: '1',
          //yAxesGroup: "1",
          lineTension: 0.1,
          backgroundColor: "#4CA5DB",
          borderColor: "#4CA5DB",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "#4CA5DB",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#4CA5DB",
          pointHoverBorderColor: "#4CA5DB",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          //data: [seconds1, seconds2, seconds3, seconds4],
          data: [sentValue1, sentValue2, sentValue3, sentValue4],
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
              labelString: 'Percentage'
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
            labelString: 'Sent'
          },
        },
        {
          //name: "1",
          position: "right",
          id: "1",
          scalePositionLeft: false,
          stacked: true,
          ticks: { beginAtZero: true },

          scaleLabel: {
            display: true,
            labelString: 'Not Sent'
          },
          //scaleFontColor: "rgba(151,137,200,0.8)"
        }

        ]
      }
    }
    return this.getChart(this.multiBarChartCanvas.nativeElement, "bar", data, options);
  }
}