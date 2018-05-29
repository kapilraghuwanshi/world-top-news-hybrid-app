import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiServiceProvider {

  public infoData: any;
  public newsURL: string = 'https://newsapi.org/v2/top-headlines?' + 'country=in&' + 'apiKey=e9052d3beea84071b88f4f55e12f9fe1';
  public webNewsURL: string = 'http://webhose.io/filterWebContent?token=9159484a-6975-4496-be07-f1aa516d9a89&format=json&sort=crawled&q=news%20language%3Ahindi';
  public newsData: any;

  constructor(public http: Http) {
    console.log('Inside ApiServiceProvider');
  }

  //for choose newspaper and furthur page data
  getNewsData() {
    return new Promise(resolve => {
      this.http.get(this.newsURL)
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
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


  //for home page slideshow if selected hindi
  getNewsSlideshowHindi() {
    return new Promise(resolve => {
      this.http.get(this.webNewsURL)
        .map(resp => resp.json())
        .subscribe(tempdata => {
          this.newsData = tempdata;
          resolve(this.newsData);
        });
    });
  }
  

} 