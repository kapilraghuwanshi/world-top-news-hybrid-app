import { Component, ViewChild, Input } from '@angular/core';
import { NavController,Platform, ActionSheetController,PopoverController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'u2PieChart',
  templateUrl: 'u2PieChart.html',
})

export class U2PieChart {

   @Input('u2PieChartValue') u2PieChartValue : any;
   @Input('Date') Date : any;
   @ViewChild('u2PieChartCanvas') u2PieChartCanvas;
   public pieChartArray : any;
   public pieChartArrayStatus : any;
   public pieChartArrayCount0 : any;
   public pieChartArrayPercent0 : any;
   public pieChartArrayCount1: any;
   public pieChartArrayPercent1 : any;

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
      console.log(" injected u2PieChartChartValue " + this.u2PieChartValue);
      let pieJsonConfig = JSON.parse(this.u2PieChartValue);
      this.pieChartArray = pieJsonConfig["USER_005"];
      this.pieChartArrayCount0 = this.pieChartArray[0].Count;
      this.pieChartArrayPercent0 = this.pieChartArray[0].Percent;
      console.log(" injected pieChartArrayCount0 ...." + this.pieChartArrayCount0);
      this.pieChartArrayCount1 = this.pieChartArray[1].Count;
      this.pieChartArrayPercent1 = this.pieChartArray[1].Percent;

      this.getChart = this.u2PieChart(this.pieChartArrayCount0,this.pieChartArrayPercent0,this.pieChartArrayCount1,this.pieChartArrayPercent1);
    }
     
    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    u2PieChart(pieChartArrayCount0, pieChartArrayPercent0, pieChartArrayCount1, pieChartArrayPercent1) { 
            let data = {
                labels: ["Up","Down"],
                datasets: [{
                    label: [pieChartArrayPercent0,pieChartArrayPercent1],
                    data: [pieChartArrayCount0,pieChartArrayCount1],
                    backgroundColor: [  '#4CA5DB', '#d8a234'],
                    hoverBackgroundColor: ["#3db5ff", "#a57d2c"] 
                  }]
                };
            let options = {     
                responsive : false,       
                title: {    
                  display: true,
                  position: 'bottom',
                  text: 'Usage Meter Availablity',
                  fontColor: 'black',
                  fontSize: 15,
                  fontStyle: 'Helvetica'    
              },
                legend: {
                  display: true,
                  labels: {
                  fontColor: 'black',
                  position: 'left',
                  }
              },
                layout: {
                  padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                  }
              },
                animation: {
                  animateScale: true,
                  animateRotate: true
              }
          }

    return this.getChart(this.u2PieChartCanvas.nativeElement, "pie", data, options);     
    }
  }