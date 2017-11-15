import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';


/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  constructor(public http: Http, public storage: Storage) {
  //  console.log('Hello ConfigProvider Provider');
  }

  public getApiUrl(){
    return new Promise((resolve, reject) =>{
      this.storage.get('ipaddress')
        .then((res) => {
              //console.log(res);
              resolve('http://'+res+'/sdcard/cpt/app/data_api2.php');
           },
           err => {
             console.log("Whoops!" + err);
           }
         );
       });

  }



}
