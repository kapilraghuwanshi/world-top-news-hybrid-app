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
  // public newsSourcenames: string[] = [];
  // public uniqueNewsSourcenames: string[] = [];
  public baseImage = "assets/image/basenews.png";

  public AlJazeera = "assets/image/al-jazeera-english.png";
  public AustralianFinancial = "assets/image/australian-financial-review.jpg";
  public BusinessInsider = "assets/image/business-insider.png";
  public Bloomberg = "assets/image/bloomberg.png";
  public BBC = "assets/image/BBC.png";
  public CNBC = "assets/image/CNBC.png";
  public CNN = "assets/image/CNN.png";
  public ESPN = "assets/image/espn.png";
  public EntertainmentWeekly = "assets/image/EWeekly.jpg";
  public FinancialPost = "assets/image/FinancialPost.png";
  public FoxNews = "assets/image/FoxNews.png";
  public NationalGeographic = "assets/image/NationalGeographic.jpg";
  public News24 = "assets/image/News24.jpg";
  public TechCrunch = "assets/image/TechCrunch.png";
  public Reuters = "assets/image/Reuters.png";
  public Hindu = "assets/image/Hindu.jpeg";
  public TheHuffingtonPost = "assets/image/huffington_post.png";
  public TheNewYorkTimes = "assets/image/TheNewYorkTimes.png";
  public TheTimesofIndia = "assets/image/TOI.png";
  public TheWallStreetJournal = "assets/image/WallStreetJournal.png";
  public TheEconomist = "assets/image/Economist.jpg";
  public Time = "assets/image/Time.png";
  public USAToday = "assets/image/USAToday.jpg";
  public WashingtonPost = "assets/image/WashingtonPost.jpg";

  constructor(public navCtrl: NavController, public platform: Platform,
    public actionsheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public ApiService: ApiServiceProvider, public navParams: NavParams,
    public loadingCtrl: LoadingController, private netwrk: Network) {
    console.log("Inside Publisher");
    this.presentPageLoadingGif();
    // this.ApiService.getNewsSlideshowEnglish()
    //   .then(data => {
    //     this.newsData = data;
    //     console.log(this.newsData);
    //     this.newsArticles = this.newsData.articles;
    //     console.log(this.newsArticles);

    //     for (var i = 0; i < this.newsArticles.length; i++) {
    //       this.newsSourcenames[i] = this.newsArticles[i].source.name;
    //     }
    //     this.uniqueNewsSourcenames = Array.from(new Set(this.newsSourcenames));
    //     console.log(this.newsSourcenames);
    //     console.log(this.uniqueNewsSourcenames);
    //   })

  }

  openNewsPublisher(publisherArg) {
    this.presentLoadingGif();
    console.log("Current publisherArg: " + publisherArg);
    this.ApiService.getNewsDataByPublisher(publisherArg).then(data => {
      this.newsData = data;
      // console.log(this.newsData);
      this.newsArticles = this.newsData.articles;
      //console.log(this.newsArticles);
      this.navCtrl.push(NewsPaperPage, {
        categoryArg: publisherArg,
        newsArticles: this.newsArticles
      });
    })
  }

  // method to show Loading..
  presentPageLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           You're going to witness ooodles of Top Publishers here...
          </div>`,
      duration: 2000
    });
    loading.present();
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Getting updated articles from your preferred Publisher...
          </div>`,
      duration: 3500
    });
    loading.present();
  }

  // setting method -About us & exit app
  appLogout() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Settings',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'About Us',
          handler: () => {
            this.navCtrl.push(AboutUsPage);
          }
        },
        {
          text: 'Exit the App',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    actionSheet.present();
  }


}
