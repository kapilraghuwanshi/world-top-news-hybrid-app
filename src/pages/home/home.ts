import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, AlertController, NavParams,
  LoadingController
} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
//import { LoginPage } from '../login/login';
import { ChooseNewsPaperPage } from '../choose-news-paper/choose-news-paper';
import { AboutUsPage } from '../about_us/about_us';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  public newsData: any;
  public newsArticles: any;
  public footerImage = "assets/image/WebFooter.png";
  public hindImageArr: [{image:""}] ;
  public hindiDefaultImage = "HindiNewsDefault.jpg";
  public baseImage = "assets/image/basenews.png";
  public selectedLanguage: string = "English";

  constructor(public navCtrl: NavController, public platform: Platform,
    public actionsheetCtrl: ActionSheetController, public ApiService: ApiServiceProvider,
    public navParams: NavParams, private inAppBrowse: ThemeableBrowser,
    public loadingCtrl: LoadingController, private netwrk: Network, private shareService: SocialSharing) {

    this.presentLoadingGif();

    this.ApiService.getNewsSlideshowEnglish()
      .then(data => {
        this.newsData = data;
        //console.log(this.newsData);
        this.newsArticles = this.newsData.articles.slice(1, 16);
        console.log(this.newsArticles);
      })

  }

  // selected language
  chooseLanguage() {
    console.log("You have chosen :- " + this.selectedLanguage);

    if (this.selectedLanguage === "English") {
      this.presentLoadingGif();
      console.log("if English");
      this.ApiService.getNewsSlideshowEnglish()
        .then(data => {
          this.newsData = data;
          //console.log(this.newsData);
          this.newsArticles = this.newsData.articles.slice(1, 16);
          console.log(this.newsArticles);
        })
    }
    else if (this.selectedLanguage === "Hindi") {
      this.presentLoadingGifHindi();
      console.log("if Hindi");
      this.ApiService.getNewsSlideshowHindi()
        .then(data => {
          this.newsData = data;
          console.log(this.newsData);
          this.newsArticles = this.newsData.posts.slice(1, 16);
          console.log(this.newsArticles);

          for (let i = 0; i < 15 ; i++) {
            this.hindImageArr[i].image = this.newsArticles[i].thread.main_image;
          }
          console.log(this.hindImageArr);

        })
    }


  }

  // open in app browser method
  openLinkInAppBrowser(idx) {
    const options: ThemeableBrowserOptions = {
      statusbar: {
        color: '#f53d3d'
      },
      toolbar: {
        height: 44,
        color: '#f53d3d'
      },
      title: {
        color: '#ffffffff',
        showPageTitle: true,
        staticText: 'World Top News'
      },
      closeButton: {
        image: 'assets/image/web.png',
        align: 'right',
        event: 'closePressed'
      }
    };

    const myBroswer = this.inAppBrowse.create(this.newsArticles[idx].url, '_blank', options);
    myBroswer.on('closePressed').subscribe(data => {
      myBroswer.close();
    })

  }

  //method to redirect to choose newspaper
  skipGoToHome() {
    this.navCtrl.setRoot(ChooseNewsPaperPage);
  }

  //method pull to referesh
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  // Share Message
  compilemsg(idx): string {
    var msg = this.newsArticles[idx].title;
    console.log(msg);
    return msg.concat("\n \n - Shared via My World Top News App Feed https://goo.gl/TxUuUm! \n \n");
  }

  // Share news articles
  regularShare(idx) {
    var msg = this.compilemsg(idx);
    this.shareService.share(msg, null, null, this.newsArticles[idx].url);
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Preparing latest News bulletins for you.. Hang tight!
          </div>`,
      duration: 3500
    });
    loading.present();
  }

  // method to show Loading..
  presentLoadingGifHindi() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Preparing Hindi News bulletins for you..
          </div>`,
      duration: 5500
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