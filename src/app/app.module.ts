import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { RestApiServiceProvider } from '../providers/rest-api-service/rest-api-service';

import { OpvApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage, InfoModalPage, KPIPage } from '../pages/home/home';
import { AboutUsPage } from '../pages/about_us/about_us';
import { EcosystemPage } from '../pages/ecosystem/ecosystem';
import { DoughnutChart } from '../ChartComponent/doughnutChart/doughnutChart';
import { i3DoughnutChart } from '../ChartComponent/i3doughnutChart/i3doughnutChart';
import { i6DoughnutChart } from '../ChartComponent/i6doughnutChart/i6doughnutChart';
import { BillerDoughnutChart } from '../ChartComponent/billerDoughnutChart/billerDoughnutChart';
import { BarChart } from '../ChartComponent/barChart/barChart';
import { PieChart } from '../ChartComponent/pieChart/pieChart';
import { StackBarChart } from '../ChartComponent/stackBarChart/stackBarChart';
import { U2PieChart } from '../ChartComponent/u2PieChart/u2PieChart';
import { MultiBarChart } from '../ChartComponent/multiBarChart/multiBarChart';

@NgModule({
  declarations: [
    OpvApp,
    HomePage,
    InfoModalPage,
    KPIPage,
    EcosystemPage,
    AboutUsPage,
    DoughnutChart,
    i3DoughnutChart,
    i6DoughnutChart,
    BillerDoughnutChart,
    BarChart,
    U2PieChart,
    StackBarChart,
    PieChart,
    MultiBarChart,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(OpvApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    OpvApp,
    HomePage,
    InfoModalPage,
    KPIPage,
    EcosystemPage,
    AboutUsPage,
    DoughnutChart,
    i3DoughnutChart,
    i6DoughnutChart,
    BillerDoughnutChart,
    BarChart,
    U2PieChart,
    StackBarChart,
    PieChart,
    MultiBarChart,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestApiServiceProvider,
    DatePipe
  ]
})
export class AppModule {}
