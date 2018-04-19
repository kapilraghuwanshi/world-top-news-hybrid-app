import { Component } from '@angular/core';
import { NavController,Platform, ActionSheetController,PopoverController, 
        ViewController, NavParams, ModalController, LoadingController, Loading } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { LoginPage } from '../../pages/login/login';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  public userDropDown: Array<String>;
  public statusDetails: any;
  public overallStatus: any;
  public IPDRColor : any;
  public EMMColor: any;
  public NotifColor: any;
  public UserColor: any;
  public OrderColor: any;
  public selectedDate: string = '2017-09-01';
  public yesterdayDate: Date = new Date(Date.parse(this.selectedDate) - 864e5);
  public dateArg: any;
  public systemArg: any;
  public variableArg: any;

  constructor
  (
    public navCtrl: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public restApiService: RestApiServiceProvider, 
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public datePipe: DatePipe,
    public navParams: NavParams,
    public loadingCtrl : LoadingController  
  ) 
   {
    console.log("Inside HomePage");
    this.dateArg = this.datePipe.transform(this.yesterdayDate.toISOString(), 'yyyyMMdd');
    console.log("Selected Date: " + this.dateArg);
    this.presentLoadingGif();
    this.systemArg = 'ALL';
    this.variableArg = 'STATUS';
    this.getOverallStatusData(this.dateArg, this.systemArg, this.variableArg);
   }

   // method to log Out
  appLogout() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'My Account',
      //subTitle: 'Are you sure you want to log out?',

      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Cancel', 
          role: 'cancel', 
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            console.log('Log-Out clicked');
            this.navCtrl.setRoot(LoginPage);
          }
        },
      ]
    });
    actionSheet.present();
  }

  // Date generate click method to set all status colors as per date
  generateOnSelectedDate()
  {
    console.log("Inside generateOnSelectedDate");
    this.yesterdayDate = new Date(Date.parse(this.selectedDate) - 864e5);
    this.dateArg =this.datePipe.transform(this.yesterdayDate.toISOString(), 'yyyyMMdd');
    console.log("Selected Date: " + this.dateArg);
    this.systemArg = 'ALL';
    this.variableArg = 'STATUS';console.log('sysChar : '+ this.systemArg);
    console.log('varChar : '+ this.variableArg);
    this.presentLoadingGif();
    this.getOverallStatusData(this.dateArg, this.systemArg, this.variableArg);
  }

  // method to show all status colors in HomePage
  getOverallStatusData(dateArg, systemArg, variableArg) 
   {
    this.restApiService.getOverallStatusData(this.dateArg, systemArg, variableArg)
    .then(data => {
      this.statusDetails = data;

      let overall_Status=this.statusDetails.overall_status_color;  
      if(overall_Status == "")
        {
          this.overallStatus='#4CAF50';
          this.IPDRColor='#00B050';
          this.EMMColor='#00B050';
          this.NotifColor='#00B050';
          this.UserColor='#00B050';
          this.OrderColor='#00B050';
          console.log("Default OverAllStatus Color : "+ this.overallStatus);
        }
      else
        {
          this.overallStatus=this.statusDetails.overall_status_color;   
          this.IPDRColor=this.statusDetails.ipdr_status_color;
          this.EMMColor=this.statusDetails.emm_status_color;
          this.NotifColor=this.statusDetails.notification_status_color;
          this.UserColor=this.statusDetails.userexperience_status_color;
          this.OrderColor=this.statusDetails.ordermanagement_status_color;
          console.log("OverAll Status Color : "+ this.statusDetails.overall_status_color);
        }
    });

  }

  // method to create InfoModalPage popUp
  openSysInfoModal(sysChar, varChar) {
    let modal = this.modalCtrl.create(InfoModalPage, sysChar, varChar);  
    modal.present();
    this.presentLoadingGif();
  }

  // method to create KPIPage popUp
  pushKPIPage(sysChar, varChar, dateArg) {
    this.presentLoadingGif();
      
  }

  // method to show Loading..
  presentLoadingGif() {
      let loading = this.loadingCtrl.create({
        content: `
          <div>
           Please Wait...
          </div>`,
        duration: 2500
      });
      loading.present();
  }

}
  
@Component({
  template:`
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-navbar>
          <ion-title> <b>{{kpiName}}</b> KPIs </ion-title>
        </ion-navbar>
      </ion-toolbar>     
    </ion-header>
    <ion-content>
      <ion-list style="background-color:#D1D5ED;">     
        <ion-item *ngFor="let kpi of kpiItems">
            <ion-card style="box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); border: 1px solid #3320E1;">
              <ion-card-header style="background-color:#9d99cc; white-space:normal; border: 1px solid #3320E1">
                <ion-row>
                  <ion-col col-11>
                    <b>{{kpi.KPIName}}</b>
                  </ion-col>
                  <ion-col col-1>
                    <div *ngIf="kpi.ColorStatus=='green' || kpi.ColorStatus==0">
                      <div style="margin: 0 auto;width: 24px;height: 24px;float: right; background-color: #17D044; border-radius: 50%;"></div>  
                    </div>
                    <div *ngIf="kpi.ColorStatus=='yellow'">
                      <div style="margin: 0 auto;width: 24px;height: 24px;float: right; background-color: #F9F618; border-radius: 50%;"></div>     
                    </div>  
                    <div *ngIf="kpi.ColorStatus=='red'">
                      <div style="margin: 0 auto;width: 24px;height: 24px;float: right; background-color: #F00; border-radius: 50%;"></div>      
                    </div>
                  </ion-col>
                </ion-row>
              </ion-card-header>
              <ion-card-content>  

                  <div *ngIf="kpi.ChartType=='doughnut' && kpi.KPIValue1!='0'">  
                    <doughnutChart doughnutValue="{{kpi.KPIValue1}}" doughnutDisc="{{kpi.KPIValue2}}" doughnutTotal="{{kpi.KPIValue3}}" doughnutLabel1="{{kpi.KPIValue4}}" doughnutLabel2="{{kpi.KPIValue5}}" doughnutTitle="{{kpi.TitleString}}" colorStatus="{{kpi.ColorStatus}}" Date="{{kpi.Date}}"> </doughnutChart>                
                  </div>

                  <div *ngIf="kpi.ChartType=='i3doughnut'">  
                    <i3doughnutChart doughnutValue="{{kpi.KPIValue1}}" doughnutDisc="{{kpi.KPIValue2}}" doughnutTotal="{{kpi.KPIValue3}}" doughnutLabel1="{{kpi.KPIValue4}}" doughnutLabel2="{{kpi.KPIValue5}}" doughnutTitle="{{kpi.TitleString}}" Date="{{kpi.Date}}"> </i3doughnutChart>                
                  </div>

                  <div *ngIf="kpi.ChartType=='i6doughnut'">  
                    <i6doughnutChart doughnutValue="{{kpi.KPIValue1}}" doughnutDisc="{{kpi.KPIValue2}}" doughnutTotal="{{kpi.KPIValue3}}" doughnutLabel1="{{kpi.KPIValue4}}" doughnutLabel2="{{kpi.KPIValue5}}" doughnutTitle="{{kpi.TitleString}}" Date="{{kpi.Date}}"> </i6doughnutChart>                
                  </div>

                  <div *ngIf="kpi.ChartType=='billerDoughnut'">  
                    <billerDoughnutChart doughnutValue="{{kpi.KPIValue1}}" doughnutValue2="{{kpi.KPIValue2}}" doughnutValue3="{{kpi.KPIValue3}}" doughnutValue4="{{kpi.KPIValue4}}" doughnutTitle="{{kpi.TitleString}}" Date="{{kpi.Date}}"> </billerDoughnutChart>                
                  </div>

                <div *ngIf="kpi.ChartType=='pie'">
                    <pieChart pieValue="{{kpi.config}}" pieTitle="{{kpi.TitleString}}" Date="{{kpi.Date}}"> </pieChart>
                  </div>  

                  <div *ngIf="kpi.ChartType=='u2Pie'">
                    <u2PieChart u2PieChartValue="{{kpi.config}}" Date="{{kpi.Date}}"> </u2PieChart>
                  </div> 

                  <div *ngIf="kpi.ChartType=='multipleBarEMM'">
                    <barChart barChartTitle="{{kpi.KPIName}}" barChartValue="{{kpi.config}}" barChartDate="{{kpi.Date}}"> </barChart>
                  </div>

                  <div *ngIf="kpi.ChartType=='multipleBarNotif'">
                    <stackBarChart stackBarChartTitle="{{kpi.KPIName}}" stackBarChartValue="{{kpi.config}}" stackBarChartDate="{{kpi.Date}}"> </stackBarChart>
                  </div> 

                  <div *ngIf="kpi.ChartType=='multipleBar'">
                    <multiBarChart multiBarChartTitle="{{kpi.KPIName}}" multiBarChartValue="{{kpi.config}}" multiBarChartDate="{{kpi.Date}}"> </multiBarChart>
                  </div>

              </ion-card-content>
            </ion-card>
        </ion-item>
      </ion-list>
    </ion-content>`
}) 

export class KPIPage {

  public kpiDetails: any;
  public systemArg: any;
  public variableArg: any;
  public kpiName: any;
  public kpiItems : any;

  constructor 
  (
    public navParams: NavParams,
    public restApiService: RestApiServiceProvider,
    public datePipe: DatePipe
  ) 
  {
    console.log('Inside KPIPage');
    var sysChar = this.navParams.get('sysChar');   
    var varChar = this.navParams.get('varChar');
    var dateArg = this.navParams.get('dateArg');
    console.log('sysChar : '+ sysChar);
    console.log('varChar : '+ varChar);
    console.log('dateArg : '+ dateArg);

    this.restApiService.getKPIData(dateArg, sysChar, varChar)
    .then(data => {
      this.kpiDetails = data;
      console.log(this.kpiDetails);
      this.kpiName = this.kpiDetails.name;
      console.log(this.kpiName);
      this.kpiItems = this.kpiDetails.items;
      //console.log(this.kpiItems);
    });

  }
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="tertiary">
      <ion-title><b>{{infoName}}</b> System Info </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="danger" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content style="background-color:#eaeded;" class="info-background-page">
      <ion-list>
        <ion-row>
          <ion-col>
            <div style="padding-block-end:2px;height:30px;display:block;font-size:15px;"> 
              <b>{{infoDescription}}.</b>
            </div>
          </ion-col>
        </ion-row>
      </ion-list>     
      <div style="margin-left:150px;hight:100px;font-size:18px;">
       <b>List of KPIs</b> 
      </div>
      <ion-item *ngFor="let item of infoItems" style="padding-block-end:1px;0 hight:90px ;padding-top: 200px;">
              <label>
                  <input type="checkbox">
                  <div class="card">
                      <div class="front"> 
                        <ion-row> <ion-col>  <b>KPI Name: </b> {{item.kpi_name}}   </ion-col> </ion-row> 
                        <ion-row> <ion-col>  <b>Category: </b> {{item.category}}  </ion-col> </ion-row> 
                        <ion-row> <ion-col>  <b>Owner: </b> {{item.kpi_owner}}    </ion-col> </ion-row>
                        <ion-row> <ion-col>  <b> Threshold: </b>    </ion-col> </ion-row>
                        <a class="buttonRed" > <b> {{item.Threshold_red}} </b> </a>
                        <a class="buttonYellow"> <b> {{item.Threshold_yellow}} </b> </a> 
                        <a class="buttonGreen"> <b> {{item.Threshold_green}} </b> </a> 
                      </div>
                      <div class="back">
                          <ion-row> <ion-col><b>Description: </b> {{item.kpi_description}}</ion-col></ion-row>      
                          <ion-row> <ion-col><b>Sources: </b> {{item.kpi_source}} </ion-col></ion-row>            
                      </div>
                  </div>
              </label>
        </ion-item>
  </ion-content>
`
})

export class InfoModalPage {
  public infoDetails: any;
  public systemArg: any;
  public variableArg: any;
  public infoName: any;
  public infoDescription : any;
  public infoItems : any;
  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public restApiService: RestApiServiceProvider,
    public datePipe: DatePipe
  ) 
  {
    console.log('Inside InfoModalPage');
    var sysChar = this.navParams.get('sysChar');
    var varChar = this.navParams.get('varChar');
    var dateArg = this.navParams.get('dateArg');
    console.log('sysChar : '+ sysChar);
    console.log('varChar : '+ varChar);
    console.log('dateArg : '+ dateArg);

     this.restApiService.getInfoPageData(dateArg, sysChar, varChar)
    .then(data => {
      this.infoDetails = data;
      console.log(this.infoDetails);
      this.infoName = this.infoDetails.name;
      console.log(this.infoName);
      this.infoDescription = this.infoDetails.Description;
      console.log(this.infoDescription);
      this.infoItems = this.infoDetails.items;
    });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}