import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, AlertController, NavParams,
  LoadingController, IonicPage
} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NewsPaperPage } from '../news-paper/news-paper';
//import { LoginPage } from '../login/login';
import { AboutUsPage } from '../about_us/about_us';

@IonicPage()
@Component({
  selector: 'page-choose-news-paper',
  templateUrl: 'choose-news-paper.html',
})
export class ChooseNewsPaperPage {

  public newsData: any;
  public newsArticles: any;
  public newsSourcenames: string[] = [];
  public uniqueNewsSourcenames: string[] = [];
  public washImage = "assets/image/washingonPost.jpg";
  public CNNImage = "assets/image/CNN.png";
  public newYorkImage = "assets/image/TheNewYorkTimes.png";
  public ABCImage = "assets/image/AbcLogo.png";
  public NBCImage = "assets/image/NBC.png";
  public USATodayImage = "assets/image/USAToday.jpg";
  public CBSImage = "assets/image/CBS.jpg";
  public FoxNewsImage = "assets/image/FoxNews.png";
  public YahooImage = "assets/image/Yahoo.png";
  public ReutersImage = "assets/image/Reuters.jpg";
  public NYDailyNewsImage = "assets/image/NYDailyNews.png";
  public baseImage = "assets/image/basenews.png";

  constructor(public navCtrl: NavController, public platform: Platform,
    public actionsheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public ApiService: ApiServiceProvider, public navParams: NavParams,
    public loadingCtrl: LoadingController, private netwrk: Network) {
    //console.log("Inside HomePage");

    this.presentLoadingGif();

    this.ApiService.getNewsData()
      .then(data => {
        this.newsData = data;
        console.log(this.newsData);
        this.newsArticles = this.newsData.articles;
        console.log(this.newsArticles);

        for (var i = 0; i < this.newsArticles.length; i++) {
          this.newsSourcenames[i] = this.newsArticles[i].source.name;
        }
        this.uniqueNewsSourcenames = Array.from(new Set(this.newsSourcenames));
        console.log(this.newsSourcenames);
        console.log(this.uniqueNewsSourcenames);
      })

  }

  // method to create NewsPaperPage
  pushNewsPaperPage(papername, articleset) {
    this.presentLoadingGif();
    this.navCtrl.push(NewsPaperPage, papername, articleset);
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Getting close to your fav Newspapers...
          </div>`,
      duration: 3500
    });
    loading.present();
  }

  // static method to log Out
  appLogout() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'My Profile',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'About Us',
          handler: () => {
            this.navCtrl.setRoot(AboutUsPage);
          }
        },
        {
          text: 'Logout',
          handler: () => {
            //this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    actionSheet.present();
  }


}
