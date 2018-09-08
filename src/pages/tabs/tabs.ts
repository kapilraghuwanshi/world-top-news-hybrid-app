import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ChooseCategoryPage } from '../choose-category/choose-category';
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
  public tab2Root: any = ChooseCategoryPage;
  public tab3Root: any = ChooseNewsPaperPage;
  public tab4Root: any = FavoritePage;
  public countryParam: string;
  public selectedCountryParam: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("inside TabsPage");
    this.countryParam = navParams.get('defaultCountry');
    console.log("selectedCountryParam in TabsPage : " + this.countryParam);
    this.selectedCountryParam = { selectedCountry: this.countryParam };
  }

}
