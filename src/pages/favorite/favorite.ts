import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, NavParams, LoadingController, IonicPage
} from 'ionic-angular';
import { ArticlePage } from '../article/article';
import { AboutUsPage } from '../about_us/about_us';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
})
export class FavoritePage {

  public articleDetails: any;
  public isFavorite = false;
  private favArticleCount: number = 0;

  constructor(public navCtrl: NavController, public platform: Platform,
    public actionsheetCtrl: ActionSheetController, public apiServ: ApiServiceProvider,
    public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.presentLoadingGif();
  }

  //on entry to this page everytime
  ionViewWillEnter() {
    console.log("inside of ionViewWillEnter");
    //Fetch out all favourites logos stored in the SQLite
    this.apiServ.getAllFavoriteArticles()
      .then(data => {
        this.articleDetails = data;
        if (this.articleDetails)
          this.favArticleCount = this.articleDetails.length;
        else
          this.favArticleCount = 0;
        console.log(this.favArticleCount);
        console.log("Fav ArticleDetails on launch of favoritePage " + this.articleDetails);
      });
  }

  // method to push to ArticlePage
  pushArticlePage(index, newarticleset) {
    //this.presentLoadingGif();
    console.log("newarticleset in favoritePage - " + newarticleset);
    this.navCtrl.push(ArticlePage, index, newarticleset);
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Reminisce your beloved articles right here...
          </div>`,
      duration: 2000
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
            this.navCtrl.push(AboutUsPage);
          }
        },  
        {
          text: 'Exit',
          handler: () => {
            //this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    actionSheet.present();
  }

}
