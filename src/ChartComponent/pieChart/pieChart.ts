import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'pieChart',
  templateUrl: 'pieChart.html',
})

export class PieChart {

  @Input('pieValue') pieValue : any;
  @Input('pieDisc') pieDisc : any;
  @Input('pieTotal') pieTotal : any;
  @Input('pieTitle') pieTitle : any;
  @Input('Date') Date : any;

  @ViewChild('pieCanvas') pieCanvas :  ElementRef;

  public pieChart: any;
  public pieChartVal1: any;
  public pieChartVal2: any;
  public pieChartVal3: any;

   constructor
  (
    public navCtrl: NavController,
    public restApiService: RestApiServiceProvider, 
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController,
  ) 
  {
  }

    ngOnInit()
    {
      console.log(" injected pieValue " + this.pieValue);
      let pieJsonConfig = JSON.parse(this.pieValue);
      console.log(" injected parsed pieJsonConfig ...." + pieJsonConfig);
       this.pieChartVal1 = pieJsonConfig["<20"];
       this.pieChartVal2 = pieJsonConfig["20-25"];
       this.pieChartVal3 = pieJsonConfig[">25"];

      console.log(" injected pieChartVal1 ...." + pieJsonConfig["<20"]);
      console.log(" injected pieChartVal2 ...." + pieJsonConfig["20-25"]);
      console.log(" injected pieChartVal3 ...." + pieJsonConfig[">25"]);

      this.getChart = this.getpieChart(this.pieChartVal1,this.pieChartVal2,this.pieChartVal3,this.pieTitle);
    }

    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    getpieChart(pieChartVal1, pieChartVal2, pieChartVal3, pieTitle) { 
            let data = {
                labels: ["<20 mins","20-25 mins",">25 mins"],
                datasets: [{
                    label: '# of Votes',
                    data: [pieChartVal1,pieChartVal2,pieChartVal3],
                    backgroundColor: [ '#4CA5DB', '#d8a234', '#1CE8D2'],
                    hoverBackgroundColor: ["#3db5ff", "#a57d2c", '#0FC3B0']
                  }]
                };
            let options = {     
                responsive : false,       
                title: {    
                  display: true,
                  position: 'bottom',
                  text: pieTitle,
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

    return this.getChart(this.pieCanvas.nativeElement, "pie", data, options);     
    }
    
}