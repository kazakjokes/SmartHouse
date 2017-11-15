import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { LightsDetailsPage } from '../pages/lights-details/lights-details';
import { LightsPage } from '../pages/lights/lights';
import { ListPage } from '../pages/list/list';
import { HumidifierPage } from '../pages/humidifier/humidifier';
import { VentilationPage } from '../pages/ventilation/ventilation';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AjaxProvider } from '../providers/ajax/ajax';
import { ConfigProvider } from '../providers/config/config';

//import { SuperTabsModule } from 'ionic2-super-tabs';


@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    AboutPage,
    HomePage,
    ItemDetailsPage,
    LightsDetailsPage,
    LightsPage,
    ListPage,
    HumidifierPage,
    VentilationPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    //SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    HomePage,
    AboutPage,
    ItemDetailsPage,
    LightsDetailsPage,
    LightsPage,
    ListPage,
    HumidifierPage,
    VentilationPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AjaxProvider,
    ConfigProvider
  ]
})
export class AppModule {}
