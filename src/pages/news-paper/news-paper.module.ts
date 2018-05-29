import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsPaperPage } from './news-paper';

@NgModule({
  declarations: [
    NewsPaperPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsPaperPage),
  ],
})
export class NewsPaperPageModule {}
