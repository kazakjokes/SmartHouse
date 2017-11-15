import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AjaxProvider } from '../../providers/ajax/ajax';
import { ConfigProvider } from '../../providers/config/config';

import { ItemDetailsPage } from '../item-details/item-details';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  object : any;
  all : any;
  premises : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ajax: AjaxProvider, public config: ConfigProvider) {
    this.object =
      {
        title: 'Visos įrangos išjungimas',

        params: {
          path: '/VentKam/',
          voidPath: 'ALLauto'
        }
      };

  }

  ionViewDidLoad() {
    //console.log(this.createUrl(this.object));

    this.ajax.getData(this.createUrl(this.object)).then( res => {
        this.all=this.assignParams(this.parseResult(res));
        console.log(this.all);
    });
  }

  allChange(event, item) {
    //console.log(item);
    let data : any;
    if (event._componentName=="toggle") {
      data= {
        'slotType': 'action',
        'path' : '/app/objects'+item.params.toggle.path+'.set'+item.params.toggle.value.toString().charAt(0).toUpperCase() + item.params.toggle.value.toString().slice(1),
        'type': 'void',
      };
    }
    console.log(data);
    // if data is set then do Post request
    if(data) {
      let params= {
          apiUrl : '',
          data : data
      };
      this.ajax.postAjax(params);
    }
  }

  assignParams (res) {
    var data : {[k: string]: any} = {};

    data.params= {};

    for (let result of res) {
      //console.log(result.path.substring("MainPro"));
      if (result.path.indexOf("ALLauto")!==-1) {
        data.params.toggle= {
          'path': this.object.params.path+this.object.params.voidPath,
          'value': result.params.value
        };
      }
    }
    //console.log("Humidifier object:")
    //console.log(data);
    return data;

  }


  parseResult(res){

    var dataArray = [];
    var path, name, value;
    let params: any;


    //console.log(res);
      for (let entry of res) {
      path=entry.path;
      for (let slot of entry.slots) {
        //console.log(slot);

        switch(slot.name) {
          case "out": {
            // check if it is dimmer or swithcher
            if(slot.type=='bool') {
              value=slot.value;
            }
            else if (slot.type=='float') {
              value = Math.round(slot.value);
            }
            break;
          }
        }

      }

      params={
        'path':path,
        'params': {
          'value':value,
        }
      };
      dataArray.push(params);
      value=false;
    }
    return dataArray;
  }


  createUrl (object) {
    //console.log(objects);

    var paramsArray = new Array();

    //console.log(object);

    //Get onOff value
    if(object.params.path!=='undefined' && object.params.voidPath!=='undefined') {
      paramsArray.push(object.params.path+object.params.voidPath+'.out');
    }

    //console.log("paramsArray:");
    //console.log(paramsArray);
    return paramsArray.join('~');
  }



}
