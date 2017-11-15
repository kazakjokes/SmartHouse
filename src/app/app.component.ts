import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { AboutPage } from '../pages/about/about';
import { LightsPage } from '../pages/lights/lights';
import { ListPage } from '../pages/list/list';
import { HumidifierPage } from '../pages/humidifier/humidifier';
import { VentilationPage } from '../pages/ventilation/ventilation';
import { SettingsPage } from '../pages/settings/settings';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HelloIonicPage;
  pages: Array<{title: string, icon: string, component: any, tab: number}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Pradžia', icon: 'home', component: HelloIonicPage, tab: 0 },
      { title: 'Šviesos', icon: 'bulb', component: LightsPage, tab: 2 },
      { title: 'Šildymas / vėdinimas', icon: 'thermometer', component: ListPage, tab: 1 },
      { title: 'Drėkintuvas', icon: 'color-fill', component: HumidifierPage, tab: 3 },
      { title: 'Vėdinimo kamera', icon: 'sync', component: VentilationPage, tab: 4 },
      { title: 'Nustatymai', icon: 'settings', component: SettingsPage, tab: null },
      { title: 'Apie', icon: 'information-circle', component: AboutPage, tab: null }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    //extra navigation logic via tabs
    if(page.tab !==null) {
      this.nav.setRoot(this.rootPage, {
        tabIndex: page.tab,
        pages: this.pages
      });
    }
    else {
      // navigate to the new page if it is not the current page
      this.nav.setRoot(page.component);
    }
  }
}
