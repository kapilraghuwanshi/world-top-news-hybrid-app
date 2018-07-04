import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-no-internet-found',
  templateUrl: 'no-internet-found.html',
})
export class NoInternetFoundPage {
  public noInternetImage = "assets/image/NoInternetFound.png";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public netwrk: Network, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoInternetFoundPage');
  }

  RetryConnection() {
    console.log('inside RetryConnection when network was disconnected');
    this.presentLoadingGif();

    // for internet Connect
    this.netwrk.onConnect()
      .subscribe(() => {
        console.log('inside RetryConnection - network is connected');
        this.navCtrl.setRoot(HomePage);
      });
  }
  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Let's see internet arrived!
          </div>`,
      duration: 1500
    });
    loading.present();
  }


}
