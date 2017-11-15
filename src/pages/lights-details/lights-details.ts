import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
/*import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
*/
import {AjaxProvider} from '../../providers/ajax/ajax';
//import {ConfigProvider} from '../../providers/config/config';

/**
 * Generated class for the LightsDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-lights-details',
  templateUrl: 'lights-details.html',
})
export class LightsDetailsPage {
  selectedItem : any;
  apiUrl : any;
  lights : any;
  arrayResults: any;
  objects : any;
  badge : any;
  display : Array<string>;
  lightstype : string;
  segmentMenu : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ajax: AjaxProvider) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.arrayResults=
      [
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim2.in", slotType: "property", value: 81},
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim6.in", slotType: "property", value: 79},
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim4.in", slotType: "property", value: 80},
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim12.in", slotType: "property", value: 66},
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim5.in", slotType: "property", value: 85},
        {type: "float", path: "/Modbus/ModbusS/DalBdim/Dim3.in", slotType: "property", value: 80}
      ];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LightsDetailsPage');
    console.log(this.selectedItem);

      this.objects = this.selectedItem;
      //console.log(this.lights);

      if(this.objects.scenes.length>2) {
        this.display=['scenes'];
        this.lightstype='scenes';
        this.segmentMenu=1;
      }
      else {
        this.display=['scenes','lights'];
      }

      console.log(this.display);

      this.ajax.getData(this.createUrl(this.objects.lights)).then( res => {
          console.log(res);
          //this.lights = this.objects;
          this.assignParams(this.objects, this.parseLights(res));
          //this.lights = this.assignParams(this.objects, this.parseLights(res));
          this.lights=this.objects;
          console.log(this.objects);

      });

  }

  segmentChanged(event) {
    //console.log(event.value);
    this.display=[event.value];
  }

  createUrl (objects) {
    //var urlParams='';
    var paramsArray = new Array();
    for (let objectsArray of objects) {
      for (let object of objectsArray.objects) {
        if(object.type==='float') {
          //urlParams+=object.path+'.out%2B~';
          paramsArray.push(object.path+'%2Bout');
        }
      }
    }
    return paramsArray.join('~');
  }

  assignParams (objects, params) {
      for(let param of params){
        this.updateObjectsItem(param);
      }
  }

  updateObjectsItem(newItem){
    //console.log(newItem);
    this.objects.lights.forEach((objectsArray, i) => {
      //console.log(objectsArray);
      let updateItem = objectsArray.objects.find(this.findIndexToUpdate, newItem.path);

      let index = objectsArray.objects.indexOf(updateItem);
      //console.log(index);
      if(index>0) {
        this.objects.lights[i].objects[index].value = newItem.value;
      }

    });

  }

  findIndexToUpdate(newItem) {
        return newItem.path === this;
  }

  parseLights(res){
    console.log(res);
    var lightsArray = [];
    var path, name, level, toggle;
    let params: any;
      for (let entry of res) {
      //console.log(entry);
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
              level = Math.round(slot.value);
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
          type: 'float',
          path: path+'.in',
          slotType: 'property',
          value: level
        };
      lightsArray.push(params);
      toggle=false;
    }
    //console.log(lightsArray);
    return lightsArray;
  }

  lightsChange (event, item) {
    console.log(event);
    console.log(item);
    //send different ligths float postdata
    if(item.value) {
        let params : any;
        params = {
          //apiUrl : this.apiUrl,
          data : {
            'slotType': 'property',
            'path' : '/app/objects'+item.path,
            'type': 'float',
            'value': item.value,
          }
        };
        // if data is set then do Post request
        if(params.data) {
          this.ajax.postAjax(params);
        }
      }
    }

    lightsButton (event, item) {
        console.log(event);
        console.log(item);

        //send different ligths pulse postdata
        if(item) {
          let params : any;
          params = {
            //apiUrl : this.apiUrl,
            data : {
                'slotType': 'action',
                'path' : '/app/objects'+item,
                'type': 'void',
            }
          };

            // if data is set then do Post request
          if(params.data) {
            this.ajax.postAjax(params);
          }
        }
      }

}
