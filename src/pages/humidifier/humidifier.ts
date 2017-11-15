import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AjaxProvider } from '../../providers/ajax/ajax';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the HumidifierPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-humidifier',
  templateUrl: 'humidifier.html',
})
export class HumidifierPage {
  object : any;
  humidifier : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ajax: AjaxProvider, public config: ConfigProvider) {
    this.object =
      {
        title: 'Drėkintuvas',

        params: {
          path: '/Drekint/',
          floatPath: 'SP',
          voidPath: 'OnOff',
          currentPath: 'MainPro'
        }
      };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HumidifierPage');
    console.log(this.createUrl(this.object));

    this.ajax.getData(this.createUrl(this.object)).then( res => {
        this.humidifier=this.assignParams(this.parseResult(res));
        console.log(this.humidifier);
    });
  }

  humidityChange(event, item) {
    console.log(item);
    let data : any;
    if(event._componentName=="range") {
      if(item.params.level.value) {
        data = {
          'slotType': 'property',
          'path' : '/app/objects'+item.params.level.path+'.in',
          'type': 'float',
          'value': item.params.level.value,
        };
      }
    }
    else if (event._componentName=="toggle") {
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
      if(result.path.indexOf("MainPro")!==-1) {
        data.params.current= {
          'path': '',
          'value': result.params.value
        };
      }
      else if (result.path.indexOf("SP")!==-1) {
        data.params.level= {
          'path': this.object.params.path+this.object.params.floatPath,
           'value': result.params.value
         };
      }
      else if (result.path.indexOf("OnOff")!==-1) {
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


    console.log(res);
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

    //Get float value
    if(object.params.path!=='undefined' && object.params.floatPath!=='undefined') {
      paramsArray.push(object.params.path+object.params.floatPath+'.out');
    }

    //Get current float value
    if(object.params.path!=='undefined' && object.params.currentPath!=='undefined') {
      paramsArray.push('/Modbus/ModbusS'+object.params.path+object.params.currentPath+'.out');
    }

    //Get onOff value
    if(object.params.path!=='undefined' && object.params.voidPath!=='undefined') {
      paramsArray.push(object.params.path+object.params.voidPath+'.out');
    }



    //console.log("paramsArray:");
    //console.log(paramsArray);
    return paramsArray.join('~');
  }

}
