import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickGeoCountryPage } from './pick-geo-country';

@NgModule({
  declarations: [
    PickGeoCountryPage,
  ],
  imports: [
    IonicPageModule.forChild(PickGeoCountryPage),
  ],
})
export class PickGeoCountryPageModule {}
