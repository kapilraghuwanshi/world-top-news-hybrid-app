import { Component } from '@angular/core';
import {
  NavController, Platform, ActionSheetController, NavParams, LoadingController, IonicPage
} from 'ionic-angular';
import { ArticlePage } from '../article/article';
import { AboutUsPage } from '../about_us/about_us';
//import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-news-paper',
  templateUrl: 'news-paper.html',
})
export class NewsPaperPage {
  public articleSet: any;
  public paperName: string;
  public articleAuthor: string;
  public articleImage: string;
  public articleTitle: string;
  public newsArticleSet = [];
  public baseImage = "assets/image/basenews.png";

  constructor(public navCtrl: NavController, public platform: Platform, public actionsheetCtrl: ActionSheetController,
    public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.paperName = this.navParams.get('categoryArg');
    //console.log(this.paperName);
    this.articleSet = this.navParams.get('newsArticles');
    //console.log("articleSet in newspaper page - " + this.articleSet);

    // for (let i = 0; i < this.articleSet.length; i++) {
    //   if ((this.paperName).localeCompare(this.articleSet[i].source.name) == 0) {
    //     //console.log("index " + i + " and obj name is " + this.articleSet[i].source.name);
    //     this.newsArticleSet.push(this.articleSet[i]);
    //   }
    // }
    //console.log(this.newsArticleSet);
  }

  // method to create pushArticlePage
  pushArticlePage(index, newarticleset) {
    //this.presentLoadingGif();
    this.navCtrl.push(ArticlePage, index, newarticleset);
  }

  // method to save faovrite as bookmarks
  saveArticle() {
    console.log("Saving");
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Just close to your favorite Publisher...
          </div>`,
      duration: 500
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
