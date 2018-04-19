import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { EcosystemPage } from '../pages/ecosystem/ecosystem';
import { AboutUsPage } from '../pages/about_us/about_us';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class OpvApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;

  pages: Array<{title: string, component: any}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) 
  {
    this.initializeApp();
    console.log("MyApp constructor method called ");
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Ecosystem', component: EcosystemPage },
      { title: 'About Us', component: AboutUsPage }
    ];
  }

  initializeApp() {
    console.log("MyApp initializeApp method called ");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("MyApp openPage method called ");
    this.nav.setRoot(page.component);
  } 

}