import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'doughnutChart',
  templateUrl: 'doughnutChart.html',``
})

export class DoughnutChart {

  @Input('doughnutValue') doughnutValue : any;
  @Input('doughnutDisc') doughnutDisc : any;
  @Input('doughnutTotal') doughnutTotal : any;
  @Input('doughnutTitle') doughnutTitle : any;
  @Input('doughnutLabel1') doughnutLabel1 : any;
  @Input('doughnutLabel2') doughnutLabel2 : any;
  @Input('Date') Date : any;
  @Input('colorStatus') colorStatus : any;

  @ViewChild('doughnutCanvas') doughnutCanvas :  ElementRef;

  public doughnutChart: any;

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
      console.log(" injected colorStatus .." + this.colorStatus);
      if(this.colorStatus=='green') {
        this.colorStatus='#9BBB59';
      }
      else if(this.colorStatus=='yellow') {
        this.colorStatus='#F79646';
      }
      else{
        this.colorStatus='#C04D50';
      }

      this.getChart = this.getDoughnutChart(this.doughnutValue,this.doughnutDisc,this.doughnutTotal,this.doughnutTitle, this.doughnutLabel1, this.doughnutLabel2, this.colorStatus);
    }

    getChart(context, chartType, data, options?) {
      return new Chart(context, {
          type: chartType,
          data: data,
          options: options
        });
      }

    getDoughnutChart(doughnutValue, doughnutDisc, doughnutTotal, doughnutTitle,doughnutLabel1,doughnutLabel2, colorStatus) { 
            let data = {
                labels: [doughnutLabel1,doughnutLabel2],
                datasets: [{
                    label: "Percentage",
                    display: true,
                    data: [doughnutValue, 100-doughnutValue],
                    //backgroundColor: [  colorStatus, '#EDEDF5'],
                    backgroundColor: [  '#4CA5DB', '#d8a234'],
                    hoverBackgroundColor: ["#3db5ff", "#a57d2c"]  
                  }]
                };
            let options = {     
                responsive : false,       
                title: {    
                  display: true,
                  position: 'bottom',
                  text: doughnutDisc+' out of '+doughnutTotal +' ' +doughnutTitle,
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
              },
                //rotation: 1 * Math.PI,
                //circumference: 1 * Math.PI 

          }
      return this.getChart(this.doughnutCanvas.nativeElement, "doughnut", data, options);     
    }
    
}