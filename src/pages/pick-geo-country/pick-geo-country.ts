import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { TabsPage } from '../tabs/tabs';
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
  public selectedCountryName: string;
  public selectedCountryCity: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geo: Geolocation,
    public ApiService: ApiServiceProvider, public loadingCtrl: LoadingController) {
    console.log('inside PickGeoCountryPage');
  }

  skipToHome() {
    this.presentLoadingGif();
    this.navCtrl.setRoot(TabsPage, {
      defaultCountry: "in"
    });
  }

  //Allow Geo Location to determine country name
  allowGeoLocation() {
    console.log("Inside allowGeoLocation");
    this.presentLoadingGif();
    this.geo.getCurrentPosition()
      .then(posi => {
        this.lati = posi.coords.latitude;
        this.longi = posi.coords.longitude;
        console.log(this.lati + " & " + this.longi);
        this.ApiService.getCountryNameOfYourCurrentLocation(this.lati, this.longi)
          .then(geoData => {
            console.log(geoData);
            this.newsData = geoData;
            this.newsArticles = this.newsData.address;
            this.selectedCountry = this.newsData.country_code;
            this.selectedCountryName = this.newsData.country;
            this.selectedCountryCity = this.newsData.city;
            console.log("country came: " + this.selectedCountry + " & " + this.selectedCountryName + " & " + this.selectedCountryCity);
          })
      })
      .catch(err => console.log(err));

    //this.presentLoadingCountryDetails(this.selectedCountryCity, this.selectedCountryName);
    this.navCtrl.setRoot(TabsPage, {
      defaultCountry: this.selectedCountry
    });
  }

  // select countries from given dropdown
  chooseCountries() {
    this.presentLoadingGif();
    console.log("You have chosen from dropdown:- " + this.selectedCountry);
    this.navCtrl.setRoot(TabsPage, {
      defaultCountry: this.selectedCountry
    });
  }

  // method to show Loading..
  presentLoadingGif() {
    let loading = this.loadingCtrl.create({
      spinner:'bubbles',
      content: `
          <div>
           Fetching news from your location...Hang tight!
          </div>`,
      duration: 5000
    });
    loading.present();
  }

  // method to show Loading..
  // presentLoadingCountryDetails(city, country) {
  //   let loading = this.loadingCtrl.create({
  //     spinner:'bubbles',
  //     content: `
  //         <div>
  //          Awesome! You're at {{city}}, {{country}}.  Enjoy what's going around you!
  //         </div>`,
  //     duration: 4000
  //   });
  //   loading.present();
  // }

}
