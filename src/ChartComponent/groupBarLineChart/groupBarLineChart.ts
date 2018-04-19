import { Component, ViewChild, Input } from '@angular/core';
import { NavController,Platform, ActionSheetController,PopoverController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'groupBarLineChart',
  templateUrl: 'groupBarLineChart.html',
})

export class GroupBarLineChart {

   @Input('groupBarLineChartValue') groupBarLineChartValue : any;
   @Input('Date') Date : any;

   @ViewChild('groupBarLineChartCanvas') groupBarLineChartCanvas;
  
   constructor
  (
    public navCtrl: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public restApiService: RestApiServiceProvider, 
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) 
  {

  }

    ngOnInit(){
      console.log(" injected groupBarLineChartValue ...." + this.groupBarLineChartValue);
      console.log(" injected date ...." + this.Date);
      
      this.getChart = this.groupBarLineChart(this.groupBarLineChartValue);
    }
     
    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    groupBarLineChart(dynamicData) {
            var data = {
              labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
              datasets: [
                {
                  label: "Initial Dataset",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: [65, dynamicData, 80, 81, dynamicData, 55, 40, dynamicData],
                  spanGaps: false,
                },
                {
                  label: "Final Dataset",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(175,92,192,0.4)",
                  borderColor: "rgba(31,156,156,1)",
                  borderCapStyle: 'butt',
                  borderDash: [5, 8],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(31,156,156,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(31,156,156,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: [15, 39, 50, 81, 51, 55, 30, 70],
                  spanGaps: false,
                }
              ]
            };

    return this.getChart(this.groupBarLineChartCanvas.nativeElement, "line", data);
      }
  }