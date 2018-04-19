import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'billerDoughnutChart',
  templateUrl: 'billerDoughnutChart.html',
})

export class BillerDoughnutChart {

  @Input('doughnutValue') doughnutValue : any;
  @Input('doughnutValue2') doughnutValue2 : any;
  @Input('doughnutValue3') doughnutValue3 : any;
  @Input('doughnutValue4') doughnutValue4 : any;
  @Input('doughnutTitle') doughnutTitle : any;
  @Input('Date') Date : any;

  @ViewChild('billerDoughnutCanvas') billerDoughnutCanvas :  ElementRef;

  public billerDoughnutChart: any;

   constructor
  (
    public navCtrl: NavController,
    public restApiService: RestApiServiceProvider, 
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController,
  ) 
  {
  }

    ngOnInit(){
      console.log(" injected doughnutValue .." + this.doughnutValue);
      
      this.getChart = this.getDoughnutChart(this.doughnutValue,this.doughnutValue2,this.doughnutValue3, this.doughnutValue4, this.doughnutTitle);
    }

    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    getDoughnutChart(doughnutValue, doughnutValue2, doughnutValue3, doughnutValue4, doughnutTitle) { 
            let data = {
                labels: ['Percentage'],
                datasets: [{
                    label: 'Percentage',
                    display: true,
                    data: [doughnutValue],
                    backgroundColor: [  '#4CA5DB', '#d8a234'],
                    hoverBackgroundColor: ["#3db5ff", "#a57d2c"]   
                  }]
                };
            let options = {     
                responsive : false,       
                title: {    
                  display: true,
                  position: 'bottom',
                  text: 'CSG-' + doughnutValue2 + ', '+ 'DDP-' + doughnutValue3 +' out of '+ doughnutValue4 + ' ' + doughnutTitle,
                  fontColor: 'black',
                  fontSize: 20,
                  fontStyle: 'Helvetica'
              },
                legend: {
                  display: true,
                  labels: {
                    fontColor: 'black',
                    position: 'left',
                    display: true
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
      return this.getChart(this.billerDoughnutCanvas.nativeElement, "doughnut", data, options);     
    }
    
}