import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
// Key for local storage
const STORAGE_KEY = 'favoriteNewsArticles';

@Injectable()
export class ApiServiceProvider {

  public infoData: any;
  public newsURL: string = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=e9052d3beea84071b88f4f55e12f9fe1';
  public webNewsURL: string = 'http://webhose.io/filterWebContent?token=9159484a-6975-4496-be07-f1aa516d9a89&format=json&sort=crawled&q=news%20language%3Ahindi';
  public newsData: any;

  constructor(public http: Http, private storage: Storage) {
    console.log('Inside ApiServiceProvider');
  }

  //for home page slideshow if selected English
  getNewsSlideshowEnglish() {
    return new Promise(resolve => {
      this.http.get(this.newsURL)
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
  }

  //for choose countries and furthur page data
  getNewsDataByCountry(countryArg) {
    return new Promise(resolve => {
      this.http.get('https://newsapi.org/v2/top-headlines?country=' + countryArg + '&apiKey=e9052d3beea84071b88f4f55e12f9fe1')
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
  }

  //for choose countries and furthur page data
  getNewsDataByCategory(categoryArg) {
    return new Promise(resolve => {
      this.http.get('https://newsapi.org/v2/top-headlines?country=us&category=' + categoryArg + '&apiKey=e9052d3beea84071b88f4f55e12f9fe1')
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
  }

  //for choose publishers and furthur page data
  getNewsDataByPublisher(publisherArg) {
    return new Promise(resolve => {
      this.http.get('https://newsapi.org/v2/top-headlines?sources=' + publisherArg + '&apiKey=e9052d3beea84071b88f4f55e12f9fe1')
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
  }

  //for home page slideshow if selected hindi
  getNewsSlideshowHindi() {
    return new Promise(resolve => {
      this.http.get(this.webNewsURL)
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
          console.log(this.newsData);
        });
    });
  }

  //Get All stored favorites
  getAllFavoriteArticles() {
    console.log("stored items " + this.storage.get(STORAGE_KEY));
    return this.storage.get(STORAGE_KEY);
  }

  //Check data is favourite or not - return true/false
  isFavorite(articleDetail) {
    console.log(" isFavorite articleDetail in api - " + articleDetail);
    return this.getAllFavoriteArticles().then(result => {
      console.log("isFavorite result in api " + result);
      return result && result.findIndex(loc => loc.title === articleDetail.title && loc.url === articleDetail.url) !== -1;
    });
  }

  //Add to Favourite object in local storage
  favoriteArticle(articleDetail) {
    return this.getAllFavoriteArticles().then(result => {
      console.log("favorite in api " + result);
      if (result) {
        result.push(articleDetail);
        return this.storage.set(STORAGE_KEY, result);
      }
      else {
        return this.storage.set(STORAGE_KEY, [articleDetail]);
      }
    });
  }

  //Remove from favorite object in local storage
  unfavoriteArticle(articleDetail) {
    return this.getAllFavoriteArticles().then(result => {
      console.log("unfavorite in api" + result);
      if (result) {
        var index = result.findIndex(loc => loc.title === articleDetail.title && loc.url === articleDetail.url);
        console.log("index unfavorite " + index);
        result.splice(index, 1);
        return this.storage.set(STORAGE_KEY, result);
      }
    });


  }

}
