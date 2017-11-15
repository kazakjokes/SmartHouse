import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import {ConfigProvider} from '../../providers/config/config';


/*
  Generated class for the AjaxProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AjaxProvider {

  constructor(public http: Http, public config: ConfigProvider) {
    //console.log('Hello AjaxProvider Provider');
  }

  public getData(urlParams) {
    let params : any;

    return new Promise((resolve, reject) =>{
      this.config.getApiUrl()
        .then((res) => {

          var apiUrl=res;
          console.log(apiUrl);

          params = {
            apiUrl : apiUrl,
            urlParams : urlParams
          };

          resolve(this.getAjax(params));
        },
        err => {
             console.log("Whoops!" + err);
           }
         );
       });
  }

  getAjax(params) {
    console.log(params);
    var urlParams=params.urlParams;
    var baseUrl=params.apiUrl;

    var url=baseUrl+'?url=/app/objects'+urlParams;
    //console.log(url);
    return new Promise((resolve, reject) =>{
      this.http.get(url)
        .map(res => res.json())
        .subscribe(
           res => {
               resolve(res.response.data);
           },
           err => {
             console.log("Whoops!" + err);
           }
         );
       });
    }

    postAjax(params) {
      let headers = new Headers();
      //headers.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({ headers: headers });
      this.config.getApiUrl().then(
        (url) => {
          //console.log(url);
          if(params) {
            params.apiUrl=url.toString();
            //console.log(params);
            this.http.post(params.apiUrl, params.data, options)
            .map(res => res.json())
            .subscribe(res => {
            console.log(res.response);
            }, (err) => {
            console.log("failed: "+err);
            });
          }
        }
      );
    }

}
