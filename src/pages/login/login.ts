import { Component } from '@angular/core';
import {  NavController,AlertController,Platform, ActionSheetController,
          PopoverController, ViewController, NavParams, ModalController,
          LoadingController, Loading } from 'ionic-angular';
import { RestApiServiceProvider } from '../../providers/rest-api-service/rest-api-service';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  public userName : any;
  public userPassword : any;
  public loading : Loading;

  registerCredentials = { userId: '', password: '' };
  //private auth: RestApiServiceProvider;
  
  constructor
  (
    public navCtrl: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public restApiService: RestApiServiceProvider, 
    public navController: NavController,
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) 
  {

  }

 getLogin() {

    console.log("Entered Data: ", this.registerCredentials);
    this.showLoading();

    this.restApiService.getLogin(this.registerCredentials)
    .subscribe(allowed => {
      if (allowed) {
        console.log("Login credentials are ", this.registerCredentials);        
        this.navController.setRoot(HomePage);
      } 
      else {
        this.showError("Access Denied! Please check your credentials!");
      }
    },
      error => {
        this.showError(error);
      });
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      //content:"Image:url('../assets/image/loader.gif')",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}