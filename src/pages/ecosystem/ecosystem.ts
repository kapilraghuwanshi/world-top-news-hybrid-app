import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, PopoverController, ViewController,
  NavParams, ModalController, LoadingController, Loading
} from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-ecosystem',
  templateUrl: 'ecosystem.html',
})

export class EcosystemPage {

  public ecoKPIs: any;
  public resultKPI: { [k: string]: any } = {};
  public selectedDate: string = '2018-02-01';
  public yesterdayDate: Date = new Date(Date.parse(this.selectedDate) - 864e5);
  public dateArg: any;
  public systemArg: any;
  public variableArg: any;
  public kpiItems: any;

  constructor
    (
    public navCtrl: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public restApiService: RestApiServiceProvider,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public datePipe: DatePipe
    ) {
    console.log("Inside EcosystemPage");
    this.presentLoadingGif();
    this.dateArg = this.datePipe.transform(this.yesterdayDate.toISOString(), 'yyyyMMdd');
    this.systemArg = 'ALL';
    this.variableArg = 'KPI';
    console.log("Ecosystem Date: " + this.dateArg);
    console.log("systemArg: " + this.systemArg);
    console.log("variableArg: " + this.variableArg);
    this.getEcosystemColor(this.dateArg, this.systemArg, this.variableArg);
  }

  getEcosystemColor(dateArg, systemArg, variableArg) {
    this.ecoKPIs = this.restApiService.getEcosystemData(this.dateArg, this.systemArg, this.variableArg)
      .then(data => {
        this.ecoKPIs = data;
        console.log(this.ecoKPIs);
        this.kpiItems = this.ecoKPIs.kpis;
        //console.log("this.ecoKPIs.kpis; " + this.ecoKPIs.kpis);
        this.kpiItems.forEach(eachItem => {
            let kpiValues = eachItem.items;
            kpiValues.forEach(eachKPI => {
            this.resultKPI[eachKPI.Profileid] = eachKPI.ColorStatus;
            //console.log("The Final value" + this.resultKPI[eachKPI.Profileid]);
          });
        });
      });
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
            <div>
               Please Wait...
            </div>  
          </div>`,
      duration: 5000
    });
    loading.present();
  }

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

}