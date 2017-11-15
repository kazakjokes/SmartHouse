import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';


import { ItemDetailsPage } from '../item-details/item-details';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { LightsPage } from '../lights/lights';
import { HumidifierPage } from '../humidifier/humidifier';
import { VentilationPage } from '../ventilation/ventilation';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  @ViewChild('myTabs') tabs: Tabs;

  page1: any = HomePage;
  page2: any = ListPage;
  page3: any = LightsPage;
  page4: any = HumidifierPage;
  page5: any = VentilationPage;
  selectedTab: number = 0;
  pages: any;
  panTimestamp : number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.get("tabIndex")>=0){
      this.selectedTab=navParams.get("tabIndex");
    }
    this.pages=navParams.get("pages");

    //console.log("selectedTab",this.selectedTab);
  }


  onTabSelect() {
    this.selectedTab=this.tabs.getSelected().index;
     //console.log(`Selected tab: `, this.selectedTab);
   }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  swipeEvent($e, selectedTab) {
    //var selectedTab;
    //console.log(selectedTab);
/*  //if we use pan event
    //set current pan timeStamp
    if(!this.panTimestamp) {
      this.panTimestamp=$e.timeStamp;
    }
    //check if delay is enogh to perform next swipe
    if(($e.timeStamp - this.panTimestamp)>100 && ($e.additionalEvent=="panright" || $e.additionalEvent=="panleft")) {
      console.log("swiped",$e);
      //console.log($e.timeStamp-this.panTimestamp )

      if($e.deltaX > 150){
        if(this.selectedTab<5){
          this.selectedTab+=1;
          this.tabs.select(this.selectedTab);
          console.log(this.selectedTab);
        }
      }else if($e.deltaX < -150){
        if(this.selectedTab>0) {
          this.selectedTab-=1;
          this.tabs.select(this.selectedTab);
          console.log(this.selectedTab);
        }
      }

      this.panTimestamp=0;
    }
*/

 //if we use swipe, no only pan
    switch ($e.direction) {
      case 2: {
        if(this.selectedTab<5){
          this.selectedTab+=1;
          this.tabs.select(this.selectedTab);
          //console.log(this.selectedTab);
        }
        break;
      }
      case 4: {
        if(this.selectedTab>0) {
          this.selectedTab-=1;
          this.tabs.select(this.selectedTab);
          //console.log(this.selectedTab);
        }
        break;
      }
    }

  }


}
