import { Component } from '@angular/core';
import {
  NavController, NavParams, Platform, ActionSheetController, PopoverController,
  ViewController, ModalController
} from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-about_us',
  templateUrl: 'about_us.html'
})
export class AboutUsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController

  ) {

  }

}
