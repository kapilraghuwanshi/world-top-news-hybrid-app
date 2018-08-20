import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, NavParams, LoadingController, IonicPage
} from 'ionic-angular';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
//library for social-sharing
import { SocialSharing } from '@ionic-native/social-sharing';
import { Vibration } from '@ionic-native/vibration';
import { AboutUsPage } from '../about_us/about_us';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
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
  public articleDetail: any;
  public isFavorite = false;

  constructor(
    public navCtrl: NavController, public platform: Platform, public actionsheetCtrl: ActionSheetController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public inAppBrowse: ThemeableBrowser,
    private shareService: SocialSharing, private vibration: Vibration, public apiServ: ApiServiceProvider) {
    this.newsArticleSet = this.navParams.get('newarticleset');
    console.log(this.newsArticleSet);
    console.log(this.navParams.get('index'));
    this.articleAuthor = this.newsArticleSet[this.navParams.get('index')].author;
    if (this.articleAuthor == null || this.articleAuthor == "")
      this.articleAuthor = "Not Available";
    console.log(this.articleAuthor);
    this.articleImage = this.newsArticleSet[this.navParams.get('index')].urlToImage;
    if (this.articleImage == null)
      this.articleImage = "assets/image/basenews.png";
    console.log(this.articleImage);
    this.articleTitle = this.newsArticleSet[this.navParams.get('index')].title;
    //console.log(this.articleTitle);
    this.articlePublishedAt = this.newsArticleSet[this.navParams.get('index')].publishedAt;
    //console.log(this.articlePublishedAt);
    this.articleDescription = this.newsArticleSet[this.navParams.get('index')].description;
    if (this.articleDescription == null)
      this.articleDescription = "Description is not available right now. Click on the Source Link above. Be updated!";
    console.log(this.articleDescription);
    this.articleUrl = this.newsArticleSet[this.navParams.get('index')].url;
    console.log(this.articleUrl);

    this.articleDetail = {
      author: this.articleAuthor, urlToImage: this.articleImage, title: this.articleTitle, url: this.articleUrl,
      publishedAt: this.articlePublishedAt, description: this.articleDescription
    };

    //check clicked article is already favorite or not
    this.apiServ.isFavorite(this.articleDetail).then(isFav => {
      console.log("isFav checking in articlePage " + this.articleDetail);
      this.isFavorite = isFav;
    })

  }

  //select and make it favourite
  selectFavoriteArticle() {
    console.log(this.articleDetail);
    this.vibration.vibrate(1000);
    this.apiServ.favoriteArticle(this.articleDetail).then(() => {
      this.isFavorite = true;
    });
  }

  //select and unfavorite it
  selectUnfavoriteArticle() {
    console.log(this.articleDetail);
    this.vibration.vibrate(1000);
    this.apiServ.unfavoriteArticle(this.articleDetail).then(() => {
      this.isFavorite = false;
    });
  }

  // open in app browser method
  openLinkInAppBrowser() {
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
        image: 'assets/image/close.png',
        align: 'right',
        event: 'closePressed'
      }
    };

    const myBroswer = this.inAppBrowse.create(this.articleUrl, '_blank', options);
    myBroswer.on('closePressed').subscribe(data => {
      myBroswer.close();
    })

  }


  // Share Message
  compilemsg(): string {
    var msg = this.articleTitle;
    return msg.concat("\n \n - Shared via World Top News Hybrid App https://goo.gl/TxUuUm! \n \n");
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
