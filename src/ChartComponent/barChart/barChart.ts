import { Component, ViewChild, Input } from '@angular/core';
import { NavController, Platform, ActionSheetController, PopoverController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { Chart } from 'chart.js';

@Component({
    selector: 'barChart',
    templateUrl: 'barChart.html',
})

export class BarChart {

    @Input('barChartTitle') barChartTitle: any;
    @Input('barChartValue') barChartValue: any;
    @Input('barChartDate') barChartDate: any;

    barChartObject:any;

    ltValue1: any;
    ltValue2: any;
    ltValue3: any;
    ltValue4: any;
    ltValue5: any;

    gtValue1: any;
    gtValue2: any;
    gtValue3: any;
    gtValue4: any;
    gtValue5: any;

    dateValue1: any;
    dateValue2: any;
    dateValue3: any;
    dateValue4: any;
    dateValue5: any;

    @ViewChild('barCanvas') barCanvas;
    barChart: any;
    resultKPI: { [k: string]: any } = {};

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

    ngOnInit() {
        console.log(" injected barChartValue ...." + this.barChartValue);

        //this.Array_1 = JSON.parse(this.barChartValue);

        let barChartJson = JSON.parse(this.barChartValue);
        this.barChartObject=barChartJson["NOTIF_060"];

        this.dateValue1 = this.barChartObject[0].Date;
        this.ltValue1 = this.barChartObject[0].LT1V1;
        this.gtValue1 = this.barChartObject[0].GT1V1;
        //console.log('Date:'+ this.dateValue1+' LT24:'+ this.ltValue1 +' GT24:'+ this.gtValue1);

        this.dateValue2 = this.barChartObject[1].Date;
        this.ltValue2 = this.barChartObject[1].LT1V1;
        this.gtValue2 = this.barChartObject[1].GT1V1;
        //console.log('Date:'+ this.dateValue2+' LT24:'+ this.ltValue2 +' GT24:'+ this.gtValue2);

        this.dateValue3 = this.barChartObject[2].Date;
        this.ltValue3 = this.barChartObject[2].LT1V1;
        this.gtValue3 = this.barChartObject[2].GT1V1;
        //console.log('Date:'+ this.dateValue3+' LT24:'+ this.ltValue3 +' GT24:'+ this.gtValue3);

        this.dateValue4 = this.barChartObject[3].Date;
        this.ltValue4 = this.barChartObject[3].LT1V1;
        this.gtValue4 = this.barChartObject[3].GT1V1;
        //console.log('Date:'+ this.dateValue4+' LT24:'+ this.ltValue4 +' GT24:'+ this.gtValue4);

        this.dateValue5 = this.barChartObject[4].Date;
        this.ltValue5 = this.barChartObject[4].LT1V1;
        this.gtValue5 = this.barChartObject[4].GT1V1;
        //console.log('Date:'+ this.dateValue5+' LT24:'+ this.ltValue5 +' GT24:'+ this.gtValue5);

        this.getChart = this.getBarChart(this.barChartTitle, 
            this.dateValue1,this.dateValue2,this.dateValue3,this.dateValue4, this.dateValue5, 
            this.ltValue1, this.ltValue2, this.ltValue3, this.ltValue4, this.ltValue5,
            this.gtValue1,this.gtValue2,this.gtValue3,this.gtValue4,this.gtValue5);
    }

getChart(context, chartType, data, options ?) {
    return new Chart(context, {
        type: chartType,
        data: data,
        options: options
    });
}

getBarChart(barChartTitle, 
            dateValue1,dateValue2,dateValue3,dateValue4, dateValue5, 
            ltValue1, ltValue2, ltValue3, ltValue4, ltValue5,
            gtValue1,gtValue2,gtValue3,gtValue4,gtValue5){
    let data = {
        labels: [dateValue5, dateValue4,dateValue3,dateValue2, dateValue1],
        datasets: [{
            label: ">24",
            backgroundColor: "#d8a234",
            borderColor: "#f29220",
            data: [gtValue5, gtValue4, gtValue3, gtValue2,gtValue1]
        }, {
            label: "<=24",
            backgroundColor: "#4CA5DB",
            borderColor: "#3db5ff",
            data: [ltValue5, ltValue4, ltValue3, ltValue2, ltValue1 ]
        }]
    };
    let options = {
            scales: {
            xAxes: [{
                stacked: true,
                scaleLabel: {
                display: true,
                labelString: 'Date'
            },
            }
            ],
            yAxes: [{
                stacked: true,
                ticks: {
                beginAtZero: true
            },
            scaleLabel: {
                display: true,
                labelString: 'Counts'
            },
            }]
            },
            }  
    return this.getChart(this.barCanvas.nativeElement, "bar", data, options);

    
}

}