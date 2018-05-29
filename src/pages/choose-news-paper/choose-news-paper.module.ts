import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseNewsPaperPage } from './choose-news-paper';

@NgModule({
  declarations: [
    ChooseNewsPaperPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseNewsPaperPage),
  ],
})
export class ChooseNewsPaperPageModule {}
