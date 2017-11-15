import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { AjaxProvider } from '../../providers/ajax/ajax';
import { ConfigProvider } from '../../providers/config/config';

import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: Array<{title: string, note: string, icon: string}>;
  premises: Array<{title: string, icon: string, note: string, params: any}>;
  temperature: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public ajax: AjaxProvider,
              public config: ConfigProvider
            ) {


    this.premises=[];

    this.premises.push({
      title: 'Virtuvė',
      icon: 'restaurant',
      note: '',
      params: [{
        path: '/Pat2/',
        temperaturePaths: ['CurTemp','SP'],
        priorityPaths: ['/Pat89/Pagal2'],
        priorities: [ {'label':'Svetainė','value':false }, {'label':'Virtuvė','value':true}]
      }]
    });

    this.premises.push({
      title: 'Svetainė',
      icon: 'wine',
      note: '',
      params: [{
        path: '/Pat89/',
        temperaturePaths: ['CurTemp','SP'],
        conditioningPaths: ['Leid'],
        priorityPaths: ['/Pat89/Pagal2'],
        priorities: [ {'label':'Svetainė','value':false }, {'label':'Virtuvė','value':true} ]
      }]
    });

    this.premises.push({
      title: 'Miegamasis',
      icon: 'cloudy-night',
      note: '',
      params: [{
        path: '/Pat12/',
        temperaturePaths: ['CurTemp','SP'],
        conditioningPaths: ['Leid'],
        priorityPaths: ['/Pat12/Pagal2A'],
        priorities: [{'label':'Miegamasis','value':false}, {'label':'Biblioteka','value':true }]
      }]
    });

    this.premises.push({
      title: 'Gabrielės kambarys',
      icon: 'bowtie',
      note: '',
      params: [{
        path: '/Pat6/',
        temperaturePaths: ['CurTemp','SP'],
        conditioningPaths: ['Leid']
      }]
    });

    this.premises.push({
      title: 'Daumanto kambarys',
      icon: 'basketball',
      note: '',
      params: [{
        path: '/Pat7/',
        temperaturePaths: ['CurTemp','SP'],
        conditioningPaths: ['Leid']
      }]
    });

    this.premises.push({
      title: 'Biblioteka',
      icon: 'book',
      note: '',
      params: [{
        path: '/Pat2A/',
        temperaturePaths: ['CurTemp','SP'],
        priorityPaths: ['/Pat12/Pagal2A'],
        priorities: [{'label':'Miegamasis','value':false}, {'label':'Biblioteka','value':true }]
      }]
    });

    this.premises.push({
      title: 'Vaikų vonia',
      icon: 'happy',
      note: '',
      params: [{
        path: '/Pat5/',
        temperaturePaths: ['CurTemp','SP']
      }]
    });

    this.premises.push({
      title: 'Tėvų vonia',
      icon: 'water',
      note: '',
      params: [{
        path: '/Pat10/',
        temperaturePaths: ['CurTemp','SP']
      }]
    });

    this.premises.push({
      title: 'Bibliotekos vonia',
      icon: 'school',
      note: '',
      params: [{
          path: '/Pat2WC/',
          temperaturePaths: ['CurTemp','SP']
        }]
    });


  }

  ionViewDidLoad() {
      this.ajax.getData(this.createUrl(this.premises)).then( res => {
          console.log(res);

          this.assignParams(this.premises, this.parseResult(res));
          this.temperature=this.premises;
          console.log(this.temperature);
        }
      );
  }

/*  assignParams (objects,res) {
    var temperature : {[k: string]: any} = {};

    for(let object of objects) {
      for(let params of object.params) {
        console.log(params.path);
        //temperature.path=params.path;

      }
    }

    temperature.params= {};

    for (let result of res) {
      console.log(result.path.substring("CurTemp"));
      if(result.path.indexOf("CurTemp")!==-1) {
        temperature.params.current=result.params.level;
      }
    }
    console.log("Temperature object:")
    console.log(temperature);
    return temperature;

  }
*/

  assignParams(objects,params){
    //console.log(params);
    for(let param of params){
      this.updateObjectsItem(param);
    }
  }

  updateObjectsItem(newItem){

    this.premises.forEach((objectsArray, i) => {
      //console.log(objectsArray.params);
      let updateItem = objectsArray.params.find(this.findIndexToUpdate, newItem.path);
      //console.log(updateItem);
      let index = objectsArray.params.indexOf(updateItem);
      //console.log(index);
      if(index>=0) {
        this.premises[i].params[index].current = newItem.params.value;
        //console.log(this.premises[i].params[index].current);
      }

    });
  }

  findIndexToUpdate(newItem) {
        return newItem.path === this;
  }

  parseResult(res){

    var temperatureArray = [];
    var path, name, value, current, toggle, level;
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
              value = Math.round(slot.value*10)/10*2;
            }
            break;
          }
          case "objName": {
            name=slot.value;
            break;
          }
        }

      }

      params={
        'path':path.replace('CurTemp', ""),
        'name':name,
        'params': {
          'value':value,
        }
      };
      temperatureArray.push(params);
      toggle=false;
    }
    return temperatureArray;
  }

  createUrl (objects) {
    //console.log(objects);

    var urlParams='';
    var paramsArray = new Array();
    for (let object of objects) {
        //Get current and setPoint temperature
        //console.log(object);
        for(let params of object.params) {
          if(params.path!=='undefined' && params.temperatuePaths!=='undefined') {
            for (let tempPath of params.temperaturePaths) {
              switch(tempPath) {
                case 'CurTemp' : {
                  paramsArray.push(params.path+tempPath+'.out');
                }
              }
            }
          }
        }
    }
    //console.log(paramsArray);
    return paramsArray.join('~');
  }

  itemTapped(event, item) {
    console.log(item);
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }


}
