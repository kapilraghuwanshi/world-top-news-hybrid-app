import { Component } from '@angular/core';
import { NavController, NavParams,Platform,ActionSheetController,PopoverController,
        ViewController,ModalController} from 'ionic-angular';

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
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  
  ) 
  { 

  } 

  appLogout() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'My Account',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Log Out',
          handler: () => {
            console.log('Log-Out clicked');
          }
        },
      ]
    });
    actionSheet.present();
  }
}
