import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Toast } from '@ionic-native/toast';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
//import { AngularFireAuthModule } from 'angularfire2/auth';
//import { AngularFireDatabaseModule } from 'angularfire2/database';

//import { AppRoutingModule } from './app-routing.module';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';

import { WorldTopNews } from './app.component';
//import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ChooseNewsPaperPage } from '../pages/choose-news-paper/choose-news-paper';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { NewsPaperPage } from '../pages/news-paper/news-paper';
import { ArticlePage } from '../pages/article/article';
import { FavoritePage } from '../pages/favorite/favorite';
import { MyprofilePage } from '../pages/myprofile/myprofile';
import { AboutUsPage } from '../pages/about_us/about_us';
import { PickGeoCountryPage } from '../pages/pick-geo-country/pick-geo-country';
import { NoInternetFoundPage } from '../pages/no-internet-found/no-internet-found';
import { MyFilterPipe } from '../pipes/my-filter/my-filter';

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
@NgModule({
  declarations: [
    WorldTopNews,
    //LoginPage,
    TabsPage, HomePage, ChooseNewsPaperPage, ChooseCategoryPage, NewsPaperPage, ArticlePage,
    FavoritePage, MyprofilePage, AboutUsPage, NoInternetFoundPage, MyFilterPipe, PickGeoCountryPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(WorldTopNews),
    IonicStorageModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WorldTopNews,
    //LoginPage,
    TabsPage, HomePage, ChooseNewsPaperPage, ChooseCategoryPage, NewsPaperPage, ArticlePage,
    FavoritePage, MyprofilePage, AboutUsPage, NoInternetFoundPage, PickGeoCountryPage
  ],
  providers: [
    StatusBar, SplashScreen, Network, ThemeableBrowser,
    SocialSharing, Vibration, Toast, Geolocation, FCM, Firebase, LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiServiceProvider,
    FirebaseServiceProvider
  ]
})
export class AppModule { }
