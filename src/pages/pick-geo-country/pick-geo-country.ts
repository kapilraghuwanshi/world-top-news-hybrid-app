import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { HomePage } from '../home/home';
@IonicPage()
@Component({
  selector: 'page-pick-geo-country',
  templateUrl: 'pick-geo-country.html',
})
export class PickGeoCountryPage {
  public lati: any;
  public longi: any;
  public newsData: any;
  public newsArticles: any;
  public selectedCountry: string = "in";

  constructor(public navCtrl: NavController, public navParams: NavParams, public geo: Geolocation
    , public ApiService: ApiServiceProvider, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickGeoCountryPage');
  }

  skipToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  //Allow Geo Location to determine country name
  allowGeoLocation() {
    console.log("Inside allowGeoLocation");
    this.geo.getCurrentPosition()
      .then(posi => {
        this.lati = posi.coords.latitude;
        this.longi = posi.coords.longitude;
        console.log(this.lati + " & " + this.longi);
      })
      .catch(err => console.log(err));
  }

  // select countries from dropdown
  chooseCountries() {
    this.presentLoadingGif();
    console.log("You have chosen:- " + this.selectedCountry);
    this.ApiService.getNewsDataByCountry(this.selectedCountry)
      .then(data => {
        this.newsData = data;
        //console.log(this.newsData);
        this.newsArticles = this.newsData.articles;
        //console.log(this.newsArticles);
      }).catch(err => console.log(err));
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      content: `
          <div>
           Fetching News bulletins as per your current Location...
          </div>`,
      duration: 4500
    });
    loading.present();
  }

}
