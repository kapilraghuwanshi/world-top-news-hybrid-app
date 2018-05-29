import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ChooseNewsPaperPage } from '../choose-news-paper/choose-news-paper';
import { FavoritePage } from '../favorite/favorite';
import { MyprofilePage } from '../myprofile/myprofile';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  public myIndex: number;
  public tab1Root: any = HomePage;
  public tab2Root: any = ChooseNewsPaperPage;
  public tab3Root: any = FavoritePage;
  public tab4Root: any = MyprofilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

}
