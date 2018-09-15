import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
//import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { NoInternetFoundPage } from '../pages/no-internet-found/no-internet-found';
//import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { PickGeoCountryPage } from '../pages/pick-geo-country/pick-geo-country';

@Component({
  templateUrl: 'app.html'
})

export class WorldTopNews {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public netwrk: Network, public storage: Storage,
    public splashScreen: SplashScreen, public alertCtrl: AlertController, private localNotif: LocalNotifications,
    public toastCtrl: ToastController, public firebaseServe: FirebaseServiceProvider) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("WorldTopNews rootpage initializeApp method called ");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      //Here you can do any higher level native things you might need.

      this.storage.get('introShown1').then((result) => {
        if (result) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = PickGeoCountryPage;
          this.storage.set('introShown', true);
        }
      });

      // for internet disconnect
      this.netwrk.onDisconnect()
        .subscribe(() => {
          console.log('network was disconnected');
          this.nav.setRoot(NoInternetFoundPage);
        });

      // Get a FCM token
      //this.firebaseServe.getToken()
      // Listen to incoming messages
      // this.firebaseServe.listenToNotifications().pipe(
      //   tap(msg => {
      //     // show a toast
      //     console.log("token found for Push Notofications: " + msg);
      //   })).subscribe()

      // Schedule multiple notifications
      this.localNotif.schedule([
        {
          id: 1,
          title: 'Wanna jump to latest bulletins?',
          text: 'World Top News - Read news in the shortest form ever!',
          icon: 'resources/icon.png',
          //sound: 'file://sound.mp3',
          //led: { color: '#FF00FF', on: 500, off: 500 },
          vibrate: true,
          //data: { myData: 'World Top News - Read news in the shortest form ever!' },
          trigger: { at: new Date(new Date().getTime() + 10 * 1000), count: 5 }
        },
        {
          id: 2,
          title: 'Really enjoying our app?',
          text: 'Rate and review on play store - https://goo.gl/TxUuUm',
          icon: 'resources/icon.png',
          //sound: 'file://sound.mp3',
          //led: { color: '#FF00FF', on: 500, off: 500 },
          vibrate: true,
          trigger: { at: new Date(new Date().getTime() + 1200 * 1000), count: 8 },
        }
      ]);


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
