import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AjaxProvider } from '../../providers/ajax/ajax';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;
  temperature: any;
  priority: any;
  aircon: any;
  apiUrl: string;
  ipadress: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ajax: AjaxProvider, public config: ConfigProvider) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.priority= {
      'toggle':false
    }

    this.aircon= {
      'toggle':false
    }



  }

  ionViewDidLoad() {
      this.ajax.getData(this.createUrl(this.selectedItem.params)).then( res => {
          console.log(res);

          this.temperature=this.assignParams(this.selectedItem.params, this.parseResult(res));

          console.log(this.temperature);
        }
      );
  }

  temperatureChange(event, item) {
    console.log(item);
    let data : any;
    if(event._componentName=="range") {
      if(item.params.level) {
        data = {
              'slotType': 'property',
              'path' : '/app/objects'+item.path+'SPcomf.in',
              'type': 'float',
              'value': item.params.level/2,
        };
      }
    }
    else if (event._componentName=="toggle") {
          data= {
              'slotType': 'action',
              'path' : '/app/objects'+item.path+'.set'+item.params.toggle.toString().charAt(0).toUpperCase() + item.params.toggle.toString().slice(1),
              'type': 'void',
              'enable': item.params.toggle,
          };
    }

    // if data is set then do Post request
    if(data) {

      let params= {
          apiUrl : '',
          data : data
      };

      this.ajax.postAjax(params);
    }

  }

  priorityChange(event, item) {
    console.log(item);

    let data= {
        'slotType': 'action',
        'path' : '/app/objects'+item.params.priorityPath+'.set'+item.params.priority.toString().charAt(0).toUpperCase() + item.params.priority.toString().slice(1),
        'type': 'void',
    };

    // if data is set then do Post request
    if(data) {

      let params= {
          apiUrl : '',
          data : data
      };

      this.ajax.postAjax(params);
    }

  }

  airconChange(event, item) {
    console.log(item);

    let data= {
        'slotType': 'action',
        'path' : '/app/objects/Modbus/ModbusS'+item.path+'Leid.set'+item.params.conditioning.toString().charAt(0).toUpperCase() + item.params.conditioning.toString().slice(1),
        'type': 'void',
    };

    // if data is set then do Post request
    if(data) {

      let params= {
          apiUrl : '',
          data : data
      };

      this.ajax.postAjax(params);
    }
  }

  assignParams (params,res) {
    var temperature : {[k: string]: any} = {};

    for(let path of params) {
      console.log(path.path);
      temperature.path=path.path;
    }

    temperature.params= {};

    for (let result of res) {
      console.log(result.path.substring("CurTemp"));
      if(result.path.indexOf("CurTemp")!==-1) {
        temperature.params.current=result.params.level;
      }
      else if (result.path.indexOf("SP")!==-1) {
        temperature.params.level=result.params.level;

      }
      else if (result.path.indexOf("Leid")!==-1) {
        temperature.params.conditioning=result.params.toggle;
      }
      else if (result.path.indexOf("Pagal")!==-1) {
        temperature.params.priority=result.params.toggle;
        temperature.params.priorityPath=result.path;
      }
    }
    console.log("Temperature object:")
    console.log(temperature);
    return temperature;

  }

  parseResult(res){

    var temperatureArray = [];
    var path, name, level, current, toggle;
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
              toggle=slot.value;
            }
            else if (slot.type=='float') {
              level = Math.round(slot.value*10)/10*2;
            }
            break;
          }
          case "status": { // or enable
            toggle=slot.value;
            break;
          }
          case "objName": {
            name=slot.value;
            break;
          }
        }

      }

      params={
        'path':path,
        'name':name,
        'params': {
          'level':level,
          'toggle':toggle
        }
      };
      temperatureArray.push(params);
      toggle=false;
    }
    return temperatureArray;
  }


  createUrl (objects) {
    console.log(objects);

    var urlParams='';
    var paramsArray = new Array();
    for (let object of objects) {
        //Get current and setPoint temperature
        if(object.path!=='undefined' && object.temperatuePaths!=='undefined') {
          for (let tempPath of object.temperaturePaths) {
            paramsArray.push(object.path+tempPath+'.out');
          }
        }
       //Get air conditioning status
       if(object.path!==undefined && object.conditioningPaths!==undefined) {
          for (let condPath of object.conditioningPaths) {
            paramsArray.push('/Modbus/ModbusS'+object.path+condPath+'.out');
          }
        }
        //Get air conditioning priority
        if(object.priorityPaths!==undefined && object.priorities!==undefined) {
          for (let prioPath of object.priorityPaths) {
            paramsArray.push(prioPath+'.out');
          }
        }

      }

    //console.log("paramsArray:");
    //console.log(paramsArray);
    return paramsArray.join('~');
  }

}
