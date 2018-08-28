import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, NavParams, LoadingController, IonicPage
} from 'ionic-angular';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
//library for social-sharing
import { SocialSharing } from '@ionic-native/social-sharing';
import { Vibration } from '@ionic-native/vibration';
import { Toast } from '@ionic-native/toast';
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
    private shareService: SocialSharing, private vibration: Vibration, public apiServ: ApiServiceProvider,
    private toast: Toast) {
    this.newsArticleSet = this.navParams.get('newarticleset');
    //console.log(this.newsArticleSet);
    //console.log(this.navParams.get('index'));
    this.articleAuthor = this.newsArticleSet[this.navParams.get('index')].author;
    if (this.articleAuthor == null || this.articleAuthor == "")
      this.articleAuthor = "Not Available";
    this.articleImage = this.newsArticleSet[this.navParams.get('index')].urlToImage;
    if (this.articleImage == null)
      this.articleImage = "assets/image/basenews.png";
    this.articleTitle = this.newsArticleSet[this.navParams.get('index')].title;
    this.articlePublishedAt = this.newsArticleSet[this.navParams.get('index')].publishedAt;
    this.articleDescription = this.newsArticleSet[this.navParams.get('index')].description;
    if (this.articleDescription == null)
      this.articleDescription = "Description is not available right now. Click on the Source Link above. Be updated!";

    this.articleUrl = this.newsArticleSet[this.navParams.get('index')].url;


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
    this.toast.show(`Article added into your Favorites. Enjoy reading it anytime!`, '2000', 'center').subscribe(
      toast => { console.log(toast); }
    );
    this.vibration.vibrate(200);
    this.apiServ.favoriteArticle(this.articleDetail).then(() => {
      this.isFavorite = true;
    });
  }

  //select and unfavorite it
  selectUnfavoriteArticle() {
    console.log(this.articleDetail);
    this.toast.show(`Oh, Article removed from your Favorites. You can't read it later`, '1500', 'center').subscribe(
      toast => { console.log(toast); }
    );
    this.vibration.vibrate(150);
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
      backButton: {
        image: 'assets/image/BackArrow.png',
        imagePressed: 'assets/image/BackArrow.png',
        align: 'left',
        event: 'backPressed'
      },
      closeButton: {
        image: 'assets/image/Close.png',
        imagePressed: 'assets/image/Close.png',
        align: 'right',
        event: 'closePressed'
      },
      backButtonCanClose: true
    };

    const myBroswer = this.inAppBrowse.create(this.articleUrl, '_blank', options);
    myBroswer.on('closePressed').subscribe(data => {
      myBroswer.close();
    })

  }


  // Share Message
  compilemsg(): string {
    var msg = this.articleTitle;
    return msg.concat("\n \n - Shared via World Top News App https://goo.gl/TxUuUm! \n \n");
  }

  // Share news articles
  regularShare() {
    var msg = this.compilemsg();
    this.shareService.share(msg, "Latest News", this.articleImage, this.articleUrl);
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
