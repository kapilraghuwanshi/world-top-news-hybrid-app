import { Component } from '@angular/core';
import { NavController, NavParams,Platform,ActionSheetController,PopoverController,
        ViewController,ModalController} from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-about_us',
  templateUrl: 'about_us.html'
})
export class AboutUsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    //public restApiService: RestApiServiceProvider,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  
  ) 
  { 

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
