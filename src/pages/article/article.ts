import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, NavParams, LoadingController, IonicPage
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//library for social-sharing
import { SocialSharing } from '@ionic-native/social-sharing';
import { AboutUsPage } from '../about_us/about_us';
//import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  public newsArticleSet: any;
  public articleAuthor: string;
  public articleImage: string;
  public articleTitle: string;
  public articleUrl: string;
  public articlePublishedAt: string;
  public articleDescription: string;
  public authorImage = "assets/image/Web.png";

  constructor(
    public navCtrl: NavController, public platform: Platform, public actionsheetCtrl: ActionSheetController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public inAppBrowse: InAppBrowser,
    private shareService: SocialSharing) {
    this.newsArticleSet = this.navParams.get('newarticleset');
    console.log(this.newsArticleSet);
    console.log(this.navParams.get('index'));
    this.articleAuthor = this.newsArticleSet[this.navParams.get('index')].author;
    console.log(this.articleAuthor);
    this.articleImage = this.newsArticleSet[this.navParams.get('index')].urlToImage;
    console.log(this.articleImage);
    this.articleTitle = this.newsArticleSet[this.navParams.get('index')].title;
    console.log(this.articleTitle);
    this.articlePublishedAt = this.newsArticleSet[this.navParams.get('index')].publishedAt;
    console.log(this.articlePublishedAt);
    this.articleDescription = this.newsArticleSet[this.navParams.get('index')].description;
    console.log(this.articleDescription);

    this.articleUrl = this.newsArticleSet[this.navParams.get('index')].url;
    console.log(this.articleUrl);

    //const browser = this.inAppBrowse.create(this.articleUrl);



  }

  // open in app browser method
  openLinkInAppBrowser() {
    const myBroswer = this.inAppBrowse.create(this.articleUrl);

    myBroswer.insertCSS({ code: "body {color: red;}" });

  }

  // Share Message
  compilemsg(): string {
    var msg = this.articleTitle;
    return msg.concat("\n \n - Shared via My World Top News App Feed! \n \n");
  }

  // Share news articles
  regularShare() {
    var msg = this.compilemsg();
    this.shareService.share(msg, null, null, this.articleUrl);
  }

  //WhatsApp share
  whatsappShare() {
    var msg = this.compilemsg();
    this.shareService.shareViaWhatsApp(msg, this.articleImage, this.articleUrl);
  }

  //Social sites sharing
  facebookShare() {
    var msg = this.compilemsg();
    this.shareService.shareViaFacebook(msg, this.articleImage, this.articleUrl);
  }

  twitterShare() {
    var msg = this.compilemsg();
    this.shareService.shareViaTwitter(msg, this.articleImage, this.articleUrl);
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Please Wait...
          </div>`,
      duration: 1500
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
