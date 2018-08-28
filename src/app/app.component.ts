import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
//import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
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
    public splashScreen: SplashScreen, public alertCtrl: AlertController, private localNotif: LocalNotifications,
    public toastCtrl: ToastController, public firebaseServe: FirebaseServiceProvider) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("WorldTopNews rootpage initializeApp method called ");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      //Here you can do any higher level native things you might need.

      // for internet disconnect
      this.netwrk.onDisconnect()
        .subscribe(() => {
          console.log('network was disconnected');
          this.nav.setRoot(NoInternetFoundPage);
        });

      // Get a FCM token
      this.firebaseServe.getToken()

      // Listen to incoming messages
      this.firebaseServe.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          console.log("token: " + msg);
        })).subscribe()

      // Schedule multiple notifications
      this.localNotif.schedule([{
        id: 1,
        title: 'World Top News - Read hourly updated top bulletins!',
        text: 'Have you check-out the latest news of now?',
        icon: 'resources/icon.png',
        sound: 'file://sound.mp3',
        led: 'FF0000',
        //data: { secret: key },
        trigger: { at: new Date(new Date().getTime() + 3600) }
      },
      {
        id: 2,
        title: 'World Top News - Read hourly updated top bulletins!',
        text: 'Really enjoying our app. Rate and review on play store - https://goo.gl/TxUuUm',
        icon: 'resources/icon.png',
        sound: 'file://sound.mp3',
        led: 'FF0000',
        trigger: { at: new Date(new Date().getTime() + 3600) },
      }]);


      //this.statusBar.styleDefault();
      //  let status bar overlay webview means no StatusBar shown full screen app
      //this.statusBar.overlaysWebView(true);
      // set status bar to red
      this.statusBar.backgroundColorByHexString('#f53d3d');
      // Splash screen
      this.splashScreen.hide();

    });
  }

}
