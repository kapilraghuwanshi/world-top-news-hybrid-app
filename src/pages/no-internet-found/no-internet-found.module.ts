import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoInternetFoundPage } from './no-internet-found';

@NgModule({
  declarations: [
    NoInternetFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(NoInternetFoundPage),
  ],
})
export class NoInternetFoundPageModule {}
