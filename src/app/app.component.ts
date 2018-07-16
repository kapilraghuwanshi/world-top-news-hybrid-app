import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutUsPage } from '../pages/about_us/about_us';
import { NoInternetFoundPage } from '../pages/no-internet-found/no-internet-found';
//import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})

export class WorldTopNews {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  //pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public netwrk: Network,
    public splashScreen: SplashScreen, public alertCtrl: AlertController, ) {
    this.initializeApp();
    // // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Choose Newspaper', component: HomePage },
    //   { title: 'About Us', component: AboutUsPage }
    // ];
  }

  initializeApp() {
    console.log("WorldTopNews rootpage initializeApp method called ");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      //  let status bar overlay webview means no StatusBar shown full screen app
      // this.statusBar.overlaysWebView(true);
      // set status bar to red
      this.statusBar.backgroundColorByHexString('#f53d3d');
      //Splash screen
      this.splashScreen.hide();

      // for internet disconnect
      this.netwrk.onDisconnect()
        .subscribe(() => {
          console.log('network was disconnected');
          this.nav.setRoot(NoInternetFoundPage);
        });


    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   console.log("MyApp openPage method called ");
  //   this.nav.setRoot(page.component);
  // } 

}