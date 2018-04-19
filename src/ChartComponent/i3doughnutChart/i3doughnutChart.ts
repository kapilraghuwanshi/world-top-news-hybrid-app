import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'i3doughnutChart',
  templateUrl: 'i3doughnutChart.html',
})

export class i3DoughnutChart {

  @Input('doughnutValue') doughnutValue : any;
  @Input('doughnutDisc') doughnutDisc : any;
  @Input('doughnutTotal') doughnutTotal : any;
  @Input('doughnutTitle') doughnutTitle : any;
  @Input('doughnutLabel1') doughnutLabel1 : any;
  @Input('doughnutLabel2') doughnutLabel2 : any;
  @Input('Date') Date : any;

  @ViewChild('i3doughnutCanvas') i3doughnutCanvas :  ElementRef;

  public i3doughnutChart: any;

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
      
      this.getChart = this.getDoughnutChart(this.doughnutValue,this.doughnutDisc,this.doughnutTotal,this.doughnutTitle, this.doughnutLabel1, this.doughnutLabel2);
    }

    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    getDoughnutChart(doughnutValue, doughnutDisc, doughnutTotal, doughnutTitle,doughnutLabel1,doughnutLabel2) { 
            let data = {
                labels: [doughnutLabel1],
                datasets: [{
                    label: 'Mins',
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
                  text: doughnutDisc +' ' + doughnutTitle + ' by '+doughnutTotal + ' CMTS ',
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
      return this.getChart(this.i3doughnutCanvas.nativeElement, "doughnut", data, options);     
    }
    
}