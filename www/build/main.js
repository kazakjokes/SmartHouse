webpackJsonp([0],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_config__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ItemDetailsPage = (function () {
    function ItemDetailsPage(navCtrl, navParams, ajax, config) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ajax = ajax;
        this.config = config;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        this.priority = {
            'toggle': false
        };
        this.aircon = {
            'toggle': false
        };
    }
    ItemDetailsPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.ajax.getData(this.createUrl(this.selectedItem.params)).then(function (res) {
            console.log(res);
            _this.temperature = _this.assignParams(_this.selectedItem.params, _this.parseResult(res));
            console.log(_this.temperature);
        });
    };
    ItemDetailsPage.prototype.temperatureChange = function (event, item) {
        console.log(item);
        var data;
        if (event._componentName == "range") {
            if (item.params.level) {
                data = {
                    'slotType': 'property',
                    'path': '/app/objects' + item.path + 'SPcomf.in',
                    'type': 'float',
                    'value': item.params.level / 2,
                };
            }
        }
        else if (event._componentName == "toggle") {
            data = {
                'slotType': 'action',
                'path': '/app/objects' + item.path + '.set' + item.params.toggle.toString().charAt(0).toUpperCase() + item.params.toggle.toString().slice(1),
                'type': 'void',
                'enable': item.params.toggle,
            };
        }
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    ItemDetailsPage.prototype.priorityChange = function (event, item) {
        console.log(item);
        var data = {
            'slotType': 'action',
            'path': '/app/objects' + item.params.priorityPath + '.set' + item.params.priority.toString().charAt(0).toUpperCase() + item.params.priority.toString().slice(1),
            'type': 'void',
        };
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    ItemDetailsPage.prototype.airconChange = function (event, item) {
        console.log(item);
        var data = {
            'slotType': 'action',
            'path': '/app/objects/Modbus/ModbusS' + item.path + 'Leid.set' + item.params.conditioning.toString().charAt(0).toUpperCase() + item.params.conditioning.toString().slice(1),
            'type': 'void',
        };
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    ItemDetailsPage.prototype.assignParams = function (params, res) {
        var temperature = {};
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var path = params_1[_i];
            console.log(path.path);
            temperature.path = path.path;
        }
        temperature.params = {};
        for (var _a = 0, res_1 = res; _a < res_1.length; _a++) {
            var result = res_1[_a];
            console.log(result.path.substring("CurTemp"));
            if (result.path.indexOf("CurTemp") !== -1) {
                temperature.params.current = result.params.level;
            }
            else if (result.path.indexOf("SP") !== -1) {
                temperature.params.level = result.params.level;
            }
            else if (result.path.indexOf("Leid") !== -1) {
                temperature.params.conditioning = result.params.toggle;
            }
            else if (result.path.indexOf("Pagal") !== -1) {
                temperature.params.priority = result.params.toggle;
                temperature.params.priorityPath = result.path;
            }
        }
        console.log("Temperature object:");
        console.log(temperature);
        return temperature;
    };
    ItemDetailsPage.prototype.parseResult = function (res) {
        var temperatureArray = [];
        var path, name, level, current, toggle;
        var params;
        console.log(res);
        for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
            var entry = res_2[_i];
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            toggle = slot.value;
                        }
                        else if (slot.type == 'float') {
                            level = Math.round(slot.value * 10) / 10 * 2;
                        }
                        break;
                    }
                    case "status": {
                        toggle = slot.value;
                        break;
                    }
                    case "objName": {
                        name = slot.value;
                        break;
                    }
                }
            }
            params = {
                'path': path,
                'name': name,
                'params': {
                    'level': level,
                    'toggle': toggle
                }
            };
            temperatureArray.push(params);
            toggle = false;
        }
        return temperatureArray;
    };
    ItemDetailsPage.prototype.createUrl = function (objects) {
        console.log(objects);
        var urlParams = '';
        var paramsArray = new Array();
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var object = objects_1[_i];
            //Get current and setPoint temperature
            if (object.path !== 'undefined' && object.temperatuePaths !== 'undefined') {
                for (var _a = 0, _b = object.temperaturePaths; _a < _b.length; _a++) {
                    var tempPath = _b[_a];
                    paramsArray.push(object.path + tempPath + '.out');
                }
            }
            //Get air conditioning status
            if (object.path !== undefined && object.conditioningPaths !== undefined) {
                for (var _c = 0, _d = object.conditioningPaths; _c < _d.length; _c++) {
                    var condPath = _d[_c];
                    paramsArray.push('/Modbus/ModbusS' + object.path + condPath + '.out');
                }
            }
            //Get air conditioning priority
            if (object.priorityPaths !== undefined && object.priorities !== undefined) {
                for (var _e = 0, _f = object.priorityPaths; _e < _f.length; _e++) {
                    var prioPath = _f[_e];
                    paramsArray.push(prioPath + '.out');
                }
            }
        }
        //console.log("paramsArray:");
        //console.log(paramsArray);
        return paramsArray.join('~');
    };
    return ItemDetailsPage;
}());
ItemDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-item-details',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\item-details\item-details.html"*/'<ion-header>\n  <ion-navbar>\n    <button menuToggle *ngIf="!selectedItem">\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{selectedItem.title}}\n      <ion-icon [name]="selectedItem.icon"></ion-icon>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <!--\n  <h3 text-center *ngIf="selectedItem">\n\n  </h3>\n-->\n<!--\n  <h4 text-center *ngIf="selectedItem">\n    You navigated here from <b>{{selectedItem.title}}</b>\n  </h4>\n-->\n\n<ion-list>\n  <div *ngIf="this.temperature">\n  <ion-list-header>Temperatūra</ion-list-header>\n  <ion-item-group>\n    <ion-item-divider color="light">\n        <ion-label>{{this.temperature.params.current/2}}°</ion-label>\n        <ion-badge color="danger" item-end>{{this.temperature.params.level/2}}°</ion-badge>\n    </ion-item-divider>\n\n    <ion-item>\n      <ion-range min="32" max="60" color="danger" snaps="true" debounce="500" [(ngModel)]="this.temperature.params.level" (ionChange)="temperatureChange($event, temperature)">\n        <ion-icon range-left small color="danger" name="thermometer"></ion-icon>\n        <ion-icon range-right color="danger" name="thermometer"></ion-icon>\n      </ion-range>\n    </ion-item>\n\n  </ion-item-group>\n  <ion-item-group *ngIf="this.temperature.params.priority!==undefind">\n    <ion-item-divider color="light">\n        <ion-label>Prioritetas</ion-label>\n        <ion-badge item-end>{{selectedItem.params[0].priorities[0].label}}</ion-badge>\n        <ion-toggle checked="false" [(ngModel)]="this.temperature.params.priority" (ionChange)="priorityChange($event, this.temperature)"></ion-toggle>\n        <ion-badge item-end>{{selectedItem.params[0].priorities[1].label}}</ion-badge>\n    </ion-item-divider>\n  </ion-item-group>\n  <ion-item-group *ngIf="this.temperature.params.conditioning!==undefind">\n    <ion-item-divider color="light">\n        <ion-label>Kondicionieriai</ion-label>\n        <ion-badge item-end>Off</ion-badge>\n        <ion-toggle checked="false" [(ngModel)]="this.temperature.params.conditioning" (ionChange)="airconChange($event, this.temperature)"></ion-toggle>\n        <ion-badge item-end>Auto</ion-badge>\n    </ion-item-divider>\n  </ion-item-group>\n  </div>\n</ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\item-details\item-details.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__["a" /* AjaxProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_config_config__["a" /* ConfigProvider */]])
], ItemDetailsPage);

//# sourceMappingURL=item-details.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_config_config__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__item_details_item_details__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ListPage = (function () {
    function ListPage(navCtrl, navParams, storage, ajax, config) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.ajax = ajax;
        this.config = config;
        this.premises = [];
        this.premises.push({
            title: 'Virtuvė',
            icon: 'restaurant',
            note: '',
            params: [{
                    path: '/Pat2/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    priorityPaths: ['/Pat89/Pagal2'],
                    priorities: [{ 'label': 'Svetainė', 'value': false }, { 'label': 'Virtuvė', 'value': true }]
                }]
        });
        this.premises.push({
            title: 'Svetainė',
            icon: 'wine',
            note: '',
            params: [{
                    path: '/Pat89/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    conditioningPaths: ['Leid'],
                    priorityPaths: ['/Pat89/Pagal2'],
                    priorities: [{ 'label': 'Svetainė', 'value': false }, { 'label': 'Virtuvė', 'value': true }]
                }]
        });
        this.premises.push({
            title: 'Miegamasis',
            icon: 'cloudy-night',
            note: '',
            params: [{
                    path: '/Pat12/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    conditioningPaths: ['Leid'],
                    priorityPaths: ['/Pat12/Pagal2A'],
                    priorities: [{ 'label': 'Miegamasis', 'value': false }, { 'label': 'Biblioteka', 'value': true }]
                }]
        });
        this.premises.push({
            title: 'Gabrielės kambarys',
            icon: 'bowtie',
            note: '',
            params: [{
                    path: '/Pat6/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    conditioningPaths: ['Leid']
                }]
        });
        this.premises.push({
            title: 'Daumanto kambarys',
            icon: 'basketball',
            note: '',
            params: [{
                    path: '/Pat7/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    conditioningPaths: ['Leid']
                }]
        });
        this.premises.push({
            title: 'Biblioteka',
            icon: 'book',
            note: '',
            params: [{
                    path: '/Pat2A/',
                    temperaturePaths: ['CurTemp', 'SP'],
                    priorityPaths: ['/Pat12/Pagal2A'],
                    priorities: [{ 'label': 'Miegamasis', 'value': false }, { 'label': 'Biblioteka', 'value': true }]
                }]
        });
        this.premises.push({
            title: 'Vaikų vonia',
            icon: 'happy',
            note: '',
            params: [{
                    path: '/Pat5/',
                    temperaturePaths: ['CurTemp', 'SP']
                }]
        });
        this.premises.push({
            title: 'Tėvų vonia',
            icon: 'water',
            note: '',
            params: [{
                    path: '/Pat10/',
                    temperaturePaths: ['CurTemp', 'SP']
                }]
        });
        this.premises.push({
            title: 'Bibliotekos vonia',
            icon: 'school',
            note: '',
            params: [{
                    path: '/Pat2WC/',
                    temperaturePaths: ['CurTemp', 'SP']
                }]
        });
    }
    ListPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.ajax.getData(this.createUrl(this.premises)).then(function (res) {
            console.log(res);
            _this.assignParams(_this.premises, _this.parseResult(res));
            _this.temperature = _this.premises;
            console.log(_this.temperature);
        });
    };
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
    ListPage.prototype.assignParams = function (objects, params) {
        //console.log(params);
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            this.updateObjectsItem(param);
        }
    };
    ListPage.prototype.updateObjectsItem = function (newItem) {
        var _this = this;
        this.premises.forEach(function (objectsArray, i) {
            //console.log(objectsArray.params);
            var updateItem = objectsArray.params.find(_this.findIndexToUpdate, newItem.path);
            //console.log(updateItem);
            var index = objectsArray.params.indexOf(updateItem);
            //console.log(index);
            if (index >= 0) {
                _this.premises[i].params[index].current = newItem.params.value;
                //console.log(this.premises[i].params[index].current);
            }
        });
    };
    ListPage.prototype.findIndexToUpdate = function (newItem) {
        return newItem.path === this;
    };
    ListPage.prototype.parseResult = function (res) {
        var temperatureArray = [];
        var path, name, value, current, toggle, level;
        var params;
        console.log(res);
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var entry = res_1[_i];
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            value = slot.value;
                        }
                        else if (slot.type == 'float') {
                            value = Math.round(slot.value * 10) / 10 * 2;
                        }
                        break;
                    }
                    case "objName": {
                        name = slot.value;
                        break;
                    }
                }
            }
            params = {
                'path': path.replace('CurTemp', ""),
                'name': name,
                'params': {
                    'value': value,
                }
            };
            temperatureArray.push(params);
            toggle = false;
        }
        return temperatureArray;
    };
    ListPage.prototype.createUrl = function (objects) {
        //console.log(objects);
        var urlParams = '';
        var paramsArray = new Array();
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var object = objects_1[_i];
            //Get current and setPoint temperature
            //console.log(object);
            for (var _a = 0, _b = object.params; _a < _b.length; _a++) {
                var params = _b[_a];
                if (params.path !== 'undefined' && params.temperatuePaths !== 'undefined') {
                    for (var _c = 0, _d = params.temperaturePaths; _c < _d.length; _c++) {
                        var tempPath = _d[_c];
                        switch (tempPath) {
                            case 'CurTemp': {
                                paramsArray.push(params.path + tempPath + '.out');
                            }
                        }
                    }
                }
            }
        }
        //console.log(paramsArray);
        return paramsArray.join('~');
    };
    ListPage.prototype.itemTapped = function (event, item) {
        console.log(item);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__item_details_item_details__["a" /* ItemDetailsPage */], {
            item: item
        });
    };
    return ListPage;
}());
ListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-list',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\list\list.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Šildymas / vėdinimas</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item *ngFor="let item of premises" (click)="itemTapped($event, item)">\n      <ion-icon name="{{item.icon}}" item-left></ion-icon>\n      {{item.title}}\n      <ion-badge *ngIf="item.params[0].current" item-end color="danger">{{item.params[0].current/2}}°</ion-badge>\n    </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\list\list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__providers_ajax_ajax__["a" /* AjaxProvider */],
        __WEBPACK_IMPORTED_MODULE_4__providers_config_config__["a" /* ConfigProvider */]])
], ListPage);

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LightsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lights_details_lights_details__ = __webpack_require__(203);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LightsPage = (function () {
    function LightsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.premises = [];
        this.premises.push({
            title: 'Didysis kambarys',
            icon: 'desktop',
            note: '',
            scenes: [
                {
                    title: 'Ambience',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser0.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG0.pulse'
                        }
                    ]
                },
                {
                    title: 'Valgomasis',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser1.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG1.pulse'
                        }
                    ]
                },
                {
                    title: 'Budinti',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser2.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG2.pulse'
                        }
                    ]
                },
                {
                    title: 'TV',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser3.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG3.pulse'
                        }
                    ]
                },
                {
                    title: 'Poilsio',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser4.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG4.pulse'
                        }
                    ]
                },
                {
                    title: 'Virtuali 1',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DalScCh/ONsc8.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG8.pulse'
                        }
                    ]
                },
                {
                    title: 'Virtuali 2',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DalScCh/ONsc9.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG9.pulse'
                        }
                    ]
                },
                {
                    title: 'Virtuali 3',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DalScCh/ONsc11.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG11.pulse'
                        }
                    ]
                },
                {
                    title: 'Virtuali 4',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DalScCh/ONsc12.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG12.pulse'
                        }
                    ]
                },
                {
                    title: 'Virtuali 5',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DalScCh/ONsc13.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG13.pulse'
                        }
                    ]
                }
            ],
            lights: [
                {
                    title: 'Pastatomi TV',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal0.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal0.pulse'
                        }
                    ]
                },
                {
                    title: 'Paveikslai',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal2.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal2.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim2.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Sieniniai židinio',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal6.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal6.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim6.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Palangių šv.',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal4.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal4.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim4.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Pakabinamas',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal12.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal12.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim12.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Įleidžiami poilsio',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal5.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal5.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim5.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Įleidžiami TV',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal3.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal3.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim3.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                }
            ]
        });
        this.premises.push({
            title: 'Virtuvė',
            icon: 'restaurant',
            note: '',
            scenes: [
                {
                    title: 'Virtuvės',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser5.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG5.pulse'
                        }
                    ]
                }
            ],
            lights: [
                {
                    title: 'Įleidžiami TV',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal9.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal9.pulse'
                        }
                    ]
                },
                {
                    title: 'Darbo zona',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal10.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal10.pulse'
                        }
                    ]
                },
                {
                    title: 'Po spintele',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal13.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal13.pulse'
                        }
                    ]
                },
                {
                    title: 'Pakabinamas',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal8.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal8.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim8.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                }
            ]
        });
        this.premises.push({
            title: 'Prieškambaris',
            icon: 'umbrella',
            note: '',
            scenes: [
                {
                    title: 'Įėjimo',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliSce/Pulser5.pulse',
                            off: '/Modbus/ModbusS/DaliGro/OFG5.pulse'
                        }
                    ]
                }
            ],
            lights: [
                {
                    title: 'Įleidžiami',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal11.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal11.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim11.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                },
                {
                    title: 'Konsolės',
                    objects: [
                        {
                            type: 'pulse',
                            on: '/Modbus/ModbusS/DaliBal/ONBal7.pulse',
                            off: '/Modbus/ModbusS/DaliBal/OfBal7.pulse'
                        },
                        {
                            type: 'float',
                            path: '/Modbus/ModbusS/DalBdim/Dim7.in',
                            slotType: 'property',
                            value: ''
                        }
                    ]
                }
            ]
        });
    }
    LightsPage.prototype.itemTapped = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__lights_details_lights_details__["a" /* LightsDetailsPage */], {
            item: item
        });
    };
    return LightsPage;
}());
LightsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-lights',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\lights\lights.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Šviesos</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item *ngFor="let item of premises" (click)="itemTapped($event, item)">\n      <ion-icon name="{{item.icon}}" item-left></ion-icon>\n      {{item.title}}\n      <div class="item-note" item-right>\n        {{item.note}}\n      </div>\n    </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\lights\lights.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
], LightsPage);

//# sourceMappingURL=lights.js.map

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HumidifierPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_config__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the HumidifierPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var HumidifierPage = (function () {
    function HumidifierPage(navCtrl, navParams, ajax, config) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ajax = ajax;
        this.config = config;
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
    HumidifierPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad HumidifierPage');
        console.log(this.createUrl(this.object));
        this.ajax.getData(this.createUrl(this.object)).then(function (res) {
            _this.humidifier = _this.assignParams(_this.parseResult(res));
            console.log(_this.humidifier);
        });
    };
    HumidifierPage.prototype.humidityChange = function (event, item) {
        console.log(item);
        var data;
        if (event._componentName == "range") {
            if (item.params.level.value) {
                data = {
                    'slotType': 'property',
                    'path': '/app/objects' + item.params.level.path + '.in',
                    'type': 'float',
                    'value': item.params.level.value,
                };
            }
        }
        else if (event._componentName == "toggle") {
            data = {
                'slotType': 'action',
                'path': '/app/objects' + item.params.toggle.path + '.set' + item.params.toggle.value.toString().charAt(0).toUpperCase() + item.params.toggle.value.toString().slice(1),
                'type': 'void',
            };
        }
        console.log(data);
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    HumidifierPage.prototype.assignParams = function (res) {
        var data = {};
        data.params = {};
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var result = res_1[_i];
            //console.log(result.path.substring("MainPro"));
            if (result.path.indexOf("MainPro") !== -1) {
                data.params.current = {
                    'path': '',
                    'value': result.params.value
                };
            }
            else if (result.path.indexOf("SP") !== -1) {
                data.params.level = {
                    'path': this.object.params.path + this.object.params.floatPath,
                    'value': result.params.value
                };
            }
            else if (result.path.indexOf("OnOff") !== -1) {
                data.params.toggle = {
                    'path': this.object.params.path + this.object.params.voidPath,
                    'value': result.params.value
                };
            }
        }
        //console.log("Humidifier object:")
        //console.log(data);
        return data;
    };
    HumidifierPage.prototype.parseResult = function (res) {
        var dataArray = [];
        var path, name, value;
        var params;
        console.log(res);
        for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
            var entry = res_2[_i];
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            value = slot.value;
                        }
                        else if (slot.type == 'float') {
                            value = Math.round(slot.value);
                        }
                        break;
                    }
                }
            }
            params = {
                'path': path,
                'params': {
                    'value': value,
                }
            };
            dataArray.push(params);
            value = false;
        }
        return dataArray;
    };
    HumidifierPage.prototype.createUrl = function (object) {
        //console.log(objects);
        var paramsArray = new Array();
        //console.log(object);
        //Get float value
        if (object.params.path !== 'undefined' && object.params.floatPath !== 'undefined') {
            paramsArray.push(object.params.path + object.params.floatPath + '.out');
        }
        //Get current float value
        if (object.params.path !== 'undefined' && object.params.currentPath !== 'undefined') {
            paramsArray.push('/Modbus/ModbusS' + object.params.path + object.params.currentPath + '.out');
        }
        //Get onOff value
        if (object.params.path !== 'undefined' && object.params.voidPath !== 'undefined') {
            paramsArray.push(object.params.path + object.params.voidPath + '.out');
        }
        //console.log("paramsArray:");
        //console.log(paramsArray);
        return paramsArray.join('~');
    };
    return HumidifierPage;
}());
HumidifierPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-humidifier',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\humidifier\humidifier.html"*/'<!--\n  Generated template for the HumidifierPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Drėkintuvas\n      <ion-icon name="color-fill"></ion-icon>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div *ngIf="this.humidifier">\n  <ion-item-group>\n    <ion-item-divider color="light">\n        <ion-label>{{this.humidifier.params.current.value}}%</ion-label>\n        <ion-toggle checked="false" [(ngModel)]="this.humidifier.params.toggle.value" (ionChange)="humidityChange($event, this.humidifier)"></ion-toggle>\n        <ion-badge color="primary" item-end>{{this.humidifier.params.level.value}}%</ion-badge>\n    </ion-item-divider>\n\n    <ion-item>\n      <ion-range min="0" max="100" color="primary" debounce="500" [(ngModel)]="this.humidifier.params.level.value" (ionChange)="humidityChange($event, this.humidifier)">\n        <ion-icon range-left small color="primary" name="water"></ion-icon>\n        <ion-icon range-right color="primary" name="water"></ion-icon>\n      </ion-range>\n    </ion-item>\n  </ion-item-group>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\humidifier\humidifier.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__["a" /* AjaxProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_config_config__["a" /* ConfigProvider */]])
], HumidifierPage);

//# sourceMappingURL=humidifier.js.map

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VentilationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_config__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the VentilationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var VentilationPage = (function () {
    function VentilationPage(navCtrl, navParams, ajax, config) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ajax = ajax;
        this.config = config;
        this.object =
            {
                title: 'Priverstinis vėdinimas',
                params: {
                    path: '/VentKam/',
                    floatPath: 'FANpr',
                    voidPath: 'ON',
                }
            };
    }
    VentilationPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log(this.createUrl(this.object));
        this.ajax.getData(this.createUrl(this.object)).then(function (res) {
            _this.fan = _this.assignParams(_this.parseResult(res));
            console.log(_this.fan);
        });
    };
    VentilationPage.prototype.fanChange = function (event, item) {
        console.log(item);
        var data;
        if (event._componentName == "range") {
            if (item.params.level.value) {
                data = {
                    'slotType': 'property',
                    'path': '/app/objects' + item.params.level.path + '.in',
                    'type': 'float',
                    'value': item.params.level.value,
                };
            }
        }
        else if (event._componentName == "toggle") {
            data = {
                'slotType': 'action',
                'path': '/app/objects' + item.params.toggle.path + '.set' + item.params.toggle.value.toString().charAt(0).toUpperCase() + item.params.toggle.value.toString().slice(1),
                'type': 'void',
            };
        }
        console.log(data);
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    VentilationPage.prototype.assignParams = function (res) {
        var data = {};
        data.params = {};
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var result = res_1[_i];
            //console.log(result.path.substring("MainPro"));
            if (result.path.indexOf("FANpr") !== -1) {
                data.params.level = {
                    'path': this.object.params.path + this.object.params.floatPath,
                    'value': result.params.value
                };
            }
            else if (result.path.indexOf("ON") !== -1) {
                data.params.toggle = {
                    'path': this.object.params.path + this.object.params.voidPath,
                    'value': result.params.value
                };
            }
        }
        //console.log("Humidifier object:")
        //console.log(data);
        return data;
    };
    VentilationPage.prototype.parseResult = function (res) {
        var dataArray = [];
        var path, name, value;
        var params;
        console.log(res);
        for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
            var entry = res_2[_i];
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            value = slot.value;
                        }
                        else if (slot.type == 'float') {
                            value = Math.round(slot.value);
                        }
                        break;
                    }
                }
            }
            params = {
                'path': path,
                'params': {
                    'value': value,
                }
            };
            dataArray.push(params);
            value = false;
        }
        return dataArray;
    };
    VentilationPage.prototype.createUrl = function (object) {
        //console.log(objects);
        var paramsArray = new Array();
        //console.log(object);
        //Get float value
        if (object.params.path !== 'undefined' && object.params.floatPath !== 'undefined') {
            paramsArray.push(object.params.path + object.params.floatPath + '.out');
        }
        //Get onOff value
        if (object.params.path !== 'undefined' && object.params.voidPath !== 'undefined') {
            paramsArray.push(object.params.path + object.params.voidPath + '.out');
        }
        //console.log("paramsArray:");
        //console.log(paramsArray);
        return paramsArray.join('~');
    };
    return VentilationPage;
}());
VentilationPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-ventilation',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\ventilation\ventilation.html"*/'<!--\n  Generated template for the VentilationPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Vėdinimo kamera\n      <ion-icon name="sync"></ion-icon>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div *ngIf="this.fan">\n  <ion-list-header>{{this.object.title}}</ion-list-header>\n  <ion-item-group>\n    <ion-item-divider color="light">\n        <ion-toggle checked="false" item-start [(ngModel)]="this.fan.params.toggle.value" (ionChange)="fanChange($event, this.fan)"></ion-toggle>\n        <ion-badge color="primary" item-end>Greitis {{this.fan.params.level.value}}</ion-badge>\n    </ion-item-divider>\n\n    <ion-item>\n      <ion-range min="1" max="3" color="primary" debounce="500" [(ngModel)]="this.fan.params.level.value" (ionChange)="fanChange($event, this.fan)">\n        <ion-label range-left>1</ion-label>\n        <ion-label range-right>3</ion-label>\n      </ion-range>\n    </ion-item>\n  </ion-item-group>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\ventilation\ventilation.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__["a" /* AjaxProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_config_config__["a" /* ConfigProvider */]])
], VentilationPage);

//# sourceMappingURL=ventilation.js.map

/***/ }),

/***/ 118:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 118;

/***/ }),

/***/ 160:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 160;

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelloIonicPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__item_details_item_details__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__list_list__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lights_lights__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__humidifier_humidifier__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ventilation_ventilation__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HelloIonicPage = (function () {
    function HelloIonicPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.page1 = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.page2 = __WEBPACK_IMPORTED_MODULE_4__list_list__["a" /* ListPage */];
        this.page3 = __WEBPACK_IMPORTED_MODULE_5__lights_lights__["a" /* LightsPage */];
        this.page4 = __WEBPACK_IMPORTED_MODULE_6__humidifier_humidifier__["a" /* HumidifierPage */];
        this.page5 = __WEBPACK_IMPORTED_MODULE_7__ventilation_ventilation__["a" /* VentilationPage */];
        this.selectedTab = 0;
        if (navParams.get("tabIndex") >= 0) {
            this.selectedTab = navParams.get("tabIndex");
        }
        this.pages = navParams.get("pages");
        //console.log("selectedTab",this.selectedTab);
    }
    HelloIonicPage.prototype.onTabSelect = function () {
        this.selectedTab = this.tabs.getSelected().index;
        //console.log(`Selected tab: `, this.selectedTab);
    };
    HelloIonicPage.prototype.itemTapped = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__item_details_item_details__["a" /* ItemDetailsPage */], {
            item: item
        });
    };
    HelloIonicPage.prototype.swipeEvent = function ($e, selectedTab) {
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
                if (this.selectedTab < 5) {
                    this.selectedTab += 1;
                    this.tabs.select(this.selectedTab);
                    //console.log(this.selectedTab);
                }
                break;
            }
            case 4: {
                if (this.selectedTab > 0) {
                    this.selectedTab -= 1;
                    this.tabs.select(this.selectedTab);
                    //console.log(this.selectedTab);
                }
                break;
            }
        }
    };
    return HelloIonicPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('myTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Tabs */])
], HelloIonicPage.prototype, "tabs", void 0);
HelloIonicPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-hello-ionic',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\hello-ionic\hello-ionic.html"*/'<!--\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Pradžia</ion-title>\n  </ion-navbar>\n</ion-header>\n-->\n\n\n<!--\n<ion-content  >\n\n<super-tabs scrollTabs>\n  <super-tab [root]="page1" icon="home"></super-tab>\n  <super-tab [root]="page2" icon=\'thermometer\'></super-tab>\n  <super-tab [root]="page3" icon=\'bulb\'></super-tab>\n  <super-tab [root]="page4" icon=\'color-fill\'></super-tab>\n  <super-tab [root]="page5" icon=\'sync\'></super-tab>\n</super-tabs>\n\n\n-->\n<div style="height:100%; width:100%;" (swipe)="swipeEvent($event, this.selectedTab)">\n\n<ion-tabs #myTabs selectedIndex="{{this.selectedTab}}" (click)="onTabSelect($event)">\n  <ion-tab [root]="page1" tabIcon="home"></ion-tab>\n  <ion-tab [root]="page2" tabIcon=\'thermometer\'></ion-tab>\n  <ion-tab [root]="page3" tabIcon=\'bulb\'></ion-tab>\n  <ion-tab [root]="page4" tabIcon=\'color-fill\'></ion-tab>\n  <ion-tab [root]="page5" tabIcon=\'sync\'></ion-tab>\n</ion-tabs>\n</div>\n\n\n<!--\n<ion-slides pager color="primary">\n\n\n  <ion-slide>\n    <div *ngIf="this.all">\n    <ion-item-group>\n      <ion-item-divider color="light">\n          <ion-label>{{this.object.title}}</ion-label>\n          <ion-toggle checked="false" item-end [(ngModel)]="this.all.params.toggle.value" (ionChange)="allChange($event, this.all)"></ion-toggle>\n      </ion-item-divider>\n\n    </ion-item-group>\n    </div>\n    <p>\n      <img width="100%" src="/assets/img/bg.jpg" />\n    </p>\n    <p>\n      <button ion-button color="primary" menuToggle>Menu</button>\n\n    </p>\n  </ion-slide>\n\n  <ion-slide>\n\n    <ion-list>\n      <ion-list-header>Temperatūra patalpose</ion-list-header>\n      <button ion-item *ngFor="let item of premises" (click)="itemTapped($event, item)">\n        <ion-icon name="{{item.icon}}" item-left></ion-icon>\n        {{item.title}}\n        <ion-badge color="danger" item-end>19.0°</ion-badge>\n      </button>\n    </ion-list>\n  </ion-slide>\n\n</ion-slides>\n-->\n<!--\n  <ion-img width="100%" height="100%" src="/assets/img/bg.jpg"></ion-img>\n</ion-content>\n-->\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\hello-ionic\hello-ionic.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
], HelloIonicPage);

//# sourceMappingURL=hello-ionic.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_config__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomePage = (function () {
    function HomePage(navCtrl, navParams, ajax, config) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ajax = ajax;
        this.config = config;
        this.object =
            {
                title: 'Visos įrangos išjungimas',
                params: {
                    path: '/VentKam/',
                    voidPath: 'ALLauto'
                }
            };
    }
    HomePage.prototype.ionViewDidLoad = function () {
        //console.log(this.createUrl(this.object));
        var _this = this;
        this.ajax.getData(this.createUrl(this.object)).then(function (res) {
            _this.all = _this.assignParams(_this.parseResult(res));
            console.log(_this.all);
        });
    };
    HomePage.prototype.allChange = function (event, item) {
        //console.log(item);
        var data;
        if (event._componentName == "toggle") {
            data = {
                'slotType': 'action',
                'path': '/app/objects' + item.params.toggle.path + '.set' + item.params.toggle.value.toString().charAt(0).toUpperCase() + item.params.toggle.value.toString().slice(1),
                'type': 'void',
            };
        }
        console.log(data);
        // if data is set then do Post request
        if (data) {
            var params = {
                apiUrl: '',
                data: data
            };
            this.ajax.postAjax(params);
        }
    };
    HomePage.prototype.assignParams = function (res) {
        var data = {};
        data.params = {};
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var result = res_1[_i];
            //console.log(result.path.substring("MainPro"));
            if (result.path.indexOf("ALLauto") !== -1) {
                data.params.toggle = {
                    'path': this.object.params.path + this.object.params.voidPath,
                    'value': result.params.value
                };
            }
        }
        //console.log("Humidifier object:")
        //console.log(data);
        return data;
    };
    HomePage.prototype.parseResult = function (res) {
        var dataArray = [];
        var path, name, value;
        var params;
        //console.log(res);
        for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
            var entry = res_2[_i];
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            value = slot.value;
                        }
                        else if (slot.type == 'float') {
                            value = Math.round(slot.value);
                        }
                        break;
                    }
                }
            }
            params = {
                'path': path,
                'params': {
                    'value': value,
                }
            };
            dataArray.push(params);
            value = false;
        }
        return dataArray;
    };
    HomePage.prototype.createUrl = function (object) {
        //console.log(objects);
        var paramsArray = new Array();
        //console.log(object);
        //Get onOff value
        if (object.params.path !== 'undefined' && object.params.voidPath !== 'undefined') {
            paramsArray.push(object.params.path + object.params.voidPath + '.out');
        }
        //console.log("paramsArray:");
        //console.log(paramsArray);
        return paramsArray.join('~');
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Pradžia</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n<!--\n\n-->\n    <div>\n    <ion-item-group>\n      <ion-item-divider color="light">\n          <ion-label>{{this.object.title}}</ion-label>\n          <ion-toggle *ngIf="this.all" checked="false" item-end [(ngModel)]="this.all.params.toggle.value" (ionChange)="allChange($event, this.all)"></ion-toggle>\n      </ion-item-divider>\n\n    </ion-item-group>\n    </div>\n    <p>\n      <img width="100%" src="/assets/img/bg.jpg" />\n    </p>\n    <p>\n      <button ion-button color="primary" menuToggle>Menu</button>\n\n    </p>\n<!--\n  <ion-img width="100%" height="100%" src="/assets/img/bg.jpg"></ion-img>\n-->\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__["a" /* AjaxProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_config_config__["a" /* ConfigProvider */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LightsDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
*/

//import {ConfigProvider} from '../../providers/config/config';
/**
 * Generated class for the LightsDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var LightsDetailsPage = (function () {
    function LightsDetailsPage(navCtrl, navParams, ajax) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ajax = ajax;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        this.arrayResults =
            [
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim2.in", slotType: "property", value: 81 },
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim6.in", slotType: "property", value: 79 },
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim4.in", slotType: "property", value: 80 },
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim12.in", slotType: "property", value: 66 },
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim5.in", slotType: "property", value: 85 },
                { type: "float", path: "/Modbus/ModbusS/DalBdim/Dim3.in", slotType: "property", value: 80 }
            ];
    }
    LightsDetailsPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        //console.log('ionViewDidLoad LightsDetailsPage');
        console.log(this.selectedItem);
        this.objects = this.selectedItem;
        //console.log(this.lights);
        if (this.objects.scenes.length > 2) {
            this.display = ['scenes'];
            this.lightstype = 'scenes';
            this.segmentMenu = 1;
        }
        else {
            this.display = ['scenes', 'lights'];
        }
        console.log(this.display);
        this.ajax.getData(this.createUrl(this.objects.lights)).then(function (res) {
            console.log(res);
            //this.lights = this.objects;
            _this.assignParams(_this.objects, _this.parseLights(res));
            //this.lights = this.assignParams(this.objects, this.parseLights(res));
            _this.lights = _this.objects;
            console.log(_this.objects);
        });
    };
    LightsDetailsPage.prototype.segmentChanged = function (event) {
        //console.log(event.value);
        this.display = [event.value];
    };
    LightsDetailsPage.prototype.createUrl = function (objects) {
        //var urlParams='';
        var paramsArray = new Array();
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var objectsArray = objects_1[_i];
            for (var _a = 0, _b = objectsArray.objects; _a < _b.length; _a++) {
                var object = _b[_a];
                if (object.type === 'float') {
                    //urlParams+=object.path+'.out%2B~';
                    paramsArray.push(object.path + '%2Bout');
                }
            }
        }
        return paramsArray.join('~');
    };
    LightsDetailsPage.prototype.assignParams = function (objects, params) {
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            this.updateObjectsItem(param);
        }
    };
    LightsDetailsPage.prototype.updateObjectsItem = function (newItem) {
        var _this = this;
        //console.log(newItem);
        this.objects.lights.forEach(function (objectsArray, i) {
            //console.log(objectsArray);
            var updateItem = objectsArray.objects.find(_this.findIndexToUpdate, newItem.path);
            var index = objectsArray.objects.indexOf(updateItem);
            //console.log(index);
            if (index > 0) {
                _this.objects.lights[i].objects[index].value = newItem.value;
            }
        });
    };
    LightsDetailsPage.prototype.findIndexToUpdate = function (newItem) {
        return newItem.path === this;
    };
    LightsDetailsPage.prototype.parseLights = function (res) {
        console.log(res);
        var lightsArray = [];
        var path, name, level, toggle;
        var params;
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var entry = res_1[_i];
            //console.log(entry);
            path = entry.path;
            for (var _a = 0, _b = entry.slots; _a < _b.length; _a++) {
                var slot = _b[_a];
                //console.log(slot);
                switch (slot.name) {
                    case "out": {
                        // check if it is dimmer or swithcher
                        if (slot.type == 'bool') {
                            toggle = slot.value;
                        }
                        else if (slot.type == 'float') {
                            level = Math.round(slot.value);
                        }
                        break;
                    }
                    case "status": {
                        toggle = slot.value;
                        break;
                    }
                    case "objName": {
                        name = slot.value;
                        break;
                    }
                }
            }
            params = {
                type: 'float',
                path: path + '.in',
                slotType: 'property',
                value: level
            };
            lightsArray.push(params);
            toggle = false;
        }
        //console.log(lightsArray);
        return lightsArray;
    };
    LightsDetailsPage.prototype.lightsChange = function (event, item) {
        console.log(event);
        console.log(item);
        //send different ligths float postdata
        if (item.value) {
            var params = void 0;
            params = {
                //apiUrl : this.apiUrl,
                data: {
                    'slotType': 'property',
                    'path': '/app/objects' + item.path,
                    'type': 'float',
                    'value': item.value,
                }
            };
            // if data is set then do Post request
            if (params.data) {
                this.ajax.postAjax(params);
            }
        }
    };
    LightsDetailsPage.prototype.lightsButton = function (event, item) {
        console.log(event);
        console.log(item);
        //send different ligths pulse postdata
        if (item) {
            var params = void 0;
            params = {
                //apiUrl : this.apiUrl,
                data: {
                    'slotType': 'action',
                    'path': '/app/objects' + item,
                    'type': 'void',
                }
            };
            // if data is set then do Post request
            if (params.data) {
                this.ajax.postAjax(params);
            }
        }
    };
    return LightsDetailsPage;
}());
LightsDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-lights-details',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\lights-details\lights-details.html"*/'<!--\n  Generated template for the LightsDetailsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button menuToggle *ngIf="!selectedItem">\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{selectedItem.title}}\n      <ion-icon [name]="selectedItem.icon"></ion-icon>\n    </ion-title>\n  </ion-navbar>\n  <div *ngIf="this.segmentMenu===1">\n    <ion-segment [(ngModel)]="lightstype" (ionChange)="segmentChanged($event)">\n      <ion-segment-button value="scenes">\n        <ion-icon name="color-wand"></ion-icon>\n        Scenos\n      </ion-segment-button>\n      <ion-segment-button value="lights">\n        <ion-icon name="bulb"></ion-icon>\n        Šviesos\n      </ion-segment-button>\n    </ion-segment>\n  </div>\n</ion-header>\n\n\n<ion-content padding>\n  <ion-list>\n    <ion-item-group>\n      <ion-item-divider color="light">\n          <ion-label>Viskas OFF</ion-label>\n            <button ion-button class="on-off-button" large item-end color="danger" (click)="lightsButton($event,\'/Modbus/ModbusS/DaliSce/Pulser.pulse\')">\n              <!--<ion-icon name="close"></ion-icon>-->\n              <ion-icon name="power"></ion-icon>\n            </button>\n      </ion-item-divider>\n    </ion-item-group>\n  </ion-list>\n  <div *ngFor="let lightstype of this.display; let j=index">\n    <div *ngIf="this.lights">\n      <ion-list *ngFor="let data of this.lights[lightstype]; let i = index">\n\n\n        <ion-item-group *ngFor="let object of data.objects; let j = index">\n          <ion-item-divider color="light" *ngIf="object.type === \'pulse\'">\n              <ion-label>{{data.title}}</ion-label>\n                <button ion-button large class="on-off-button" item-end color="secondary" (click)="lightsButton($event,object.on)">\n                  <!--\n                  <ion-icon *ngIf="this.lightstype === \'scenes\'" name="checkmark"></ion-icon>\n                  <ion-icon *ngIf="this.lightstype === \'lights\'" name="bulb"></ion-icon>\n                -->\n                  ON\n                </button>\n                <button ion-button large class="on-off-button" item-end color="danger" (click)="lightsButton($event,object.off)">\n                  <!--\n                  <ion-icon *ngIf="this.lightstype === \'scenes\'" name="close"></ion-icon>\n                  <ion-icon *ngIf="this.lightstype === \'lights\'" name="bulb-outline"></ion-icon>\n                -->OFF\n                </button>\n          </ion-item-divider>\n          <ion-item-divider *ngIf="object.type === \'float\'">\n            <ion-range [(ngModel)]="object.value" debounce="500" (ionChange)="lightsChange($event, object)">\n              <ion-icon range-left small name="sunny"></ion-icon>\n              <ion-icon range-right name="sunny"></ion-icon>\n            </ion-range>\n            <ion-badge item-end>{{object.value}}</ion-badge>\n          </ion-item-divider>\n        </ion-item-group>\n\n      </ion-list>\n    </div>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\lights-details\lights-details.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_ajax_ajax__["a" /* AjaxProvider */]])
], LightsDetailsPage);

//# sourceMappingURL=lights-details.js.map

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var AboutPage = (function () {
    function AboutPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    AboutPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AboutPage');
    };
    return AboutPage;
}());
AboutPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-about',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\about\about.html"*/'<!--\n  Generated template for the AboutPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Apie</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div padding>\n    <h3>Informacija</h3>\n    <p>\n      Šia programėle galima valdyti apšvietimo, temperatūros, drėgmės ir vedinimo nustatymus.\n    </p>\n  </div>\n  <ion-list>\n    <ion-item>\n      <p>Author</p>\n      <h3>Dmitrij Noskov</h3>\n    </ion-item>\n    <ion-item>\n      <p>Company</p>\n      <h3>PRO Solutions, UAB</h3>\n    </ion-item>\n    <ion-item>\n      <p>Email</p>\n      <a href="mailto:dmitrij@prosolutions.lt">dmitrij@prosolutions.lt</a>\n    </ion-item>\n    <ion-item>\n      <p>Version</p>\n      <h3>0.1.0</h3>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\about\about.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
], AboutPage);

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(51);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
var SettingsPage = (function () {
    function SettingsPage(navCtrl, navParams, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.storage.get('ipaddress').then(function (val) {
            console.log(val);
            _this.settings = {
                'ipaddress': val
            };
        });
    }
    SettingsPage.prototype.saveSettings = function (data) {
        console.log(data);
        this.storage.set('ipaddress', data.ipaddress);
    };
    return SettingsPage;
}());
SettingsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-settings',template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\settings\settings.html"*/'<!--\n  Generated template for the SettingsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n<ion-header>\n\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Nustatymai</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <ion-item *ngIf="this.settings">\n    <ion-label color="primary">IP adresas</ion-label>\n    <ion-input [(ngModel)]="this.settings.ipaddress" placeholder="pvz., 192.168.2.2"></ion-input>\n  </ion-item>\n  <ion-item>\n    <button ion-button (click)="saveSettings(settings)">Išsaugoti</button>\n  </ion-item>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\pages\settings\settings.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
], SettingsPage);

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(234);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_hello_ionic_hello_ionic__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_about_about__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_item_details_item_details__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_lights_details_lights_details__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_lights_lights__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_list_list__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_humidifier_humidifier__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_ventilation_ventilation__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_status_bar__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_splash_screen__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_ajax_ajax__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__providers_config_config__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ionic2_super_tabs__ = __webpack_require__(285);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_6__pages_hello_ionic_hello_ionic__["a" /* HelloIonicPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_about_about__["a" /* AboutPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_item_details_item_details__["a" /* ItemDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_lights_details_lights_details__["a" /* LightsDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_lights_lights__["a" /* LightsPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_list_list__["a" /* ListPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_humidifier_humidifier__["a" /* HumidifierPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_ventilation_ventilation__["a" /* VentilationPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__["a" /* SettingsPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* JsonpModule */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */]),
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_20_ionic2_super_tabs__["a" /* SuperTabsModule */].forRoot()
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_6__pages_hello_ionic_hello_ionic__["a" /* HelloIonicPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_about_about__["a" /* AboutPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_item_details_item_details__["a" /* ItemDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_lights_details_lights_details__["a" /* LightsDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_lights_lights__["a" /* LightsPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_list_list__["a" /* ListPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_humidifier_humidifier__["a" /* HumidifierPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_ventilation_ventilation__["a" /* VentilationPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__["a" /* SettingsPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_16__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_splash_screen__["a" /* SplashScreen */],
            { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_18__providers_ajax_ajax__["a" /* AjaxProvider */],
            __WEBPACK_IMPORTED_MODULE_19__providers_config_config__["a" /* ConfigProvider */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_hello_ionic_hello_ionic__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_about_about__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_lights_lights__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_humidifier_humidifier__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_ventilation_ventilation__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_settings_settings__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(210);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MyApp = (function () {
    function MyApp(platform, menu, statusBar, splashScreen) {
        this.platform = platform;
        this.menu = menu;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        // make HelloIonicPage the root (or first) page
        this.rootPage = __WEBPACK_IMPORTED_MODULE_2__pages_hello_ionic_hello_ionic__["a" /* HelloIonicPage */];
        this.initializeApp();
        // set our app's pages
        this.pages = [
            { title: 'Pradžia', icon: 'home', component: __WEBPACK_IMPORTED_MODULE_2__pages_hello_ionic_hello_ionic__["a" /* HelloIonicPage */], tab: 0 },
            { title: 'Šviesos', icon: 'bulb', component: __WEBPACK_IMPORTED_MODULE_4__pages_lights_lights__["a" /* LightsPage */], tab: 2 },
            { title: 'Šildymas / vėdinimas', icon: 'thermometer', component: __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */], tab: 1 },
            { title: 'Drėkintuvas', icon: 'color-fill', component: __WEBPACK_IMPORTED_MODULE_6__pages_humidifier_humidifier__["a" /* HumidifierPage */], tab: 3 },
            { title: 'Vėdinimo kamera', icon: 'sync', component: __WEBPACK_IMPORTED_MODULE_7__pages_ventilation_ventilation__["a" /* VentilationPage */], tab: 4 },
            { title: 'Nustatymai', icon: 'settings', component: __WEBPACK_IMPORTED_MODULE_8__pages_settings_settings__["a" /* SettingsPage */], tab: null },
            { title: 'Apie', icon: 'information-circle', component: __WEBPACK_IMPORTED_MODULE_3__pages_about_about__["a" /* AboutPage */], tab: null }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        //extra navigation logic via tabs
        if (page.tab !== null) {
            this.nav.setRoot(this.rootPage, {
                tabIndex: page.tab,
                pages: this.pages
            });
        }
        else {
            // navigate to the new page if it is not the current page
            this.nav.setRoot(page.component);
        }
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\Users\dmitr\cordova\MyIonicProject\src\app\app.html"*/'<ion-menu [content]="content" [swipeEnabled]="false">\n\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        <ion-icon color="dark" name="{{p.icon}}"></ion-icon>\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"C:\Users\dmitr\cordova\MyIonicProject\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* MenuController */],
        __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AjaxProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_config__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*
  Generated class for the AjaxProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
var AjaxProvider = (function () {
    function AjaxProvider(http, config) {
        this.http = http;
        this.config = config;
        //console.log('Hello AjaxProvider Provider');
    }
    AjaxProvider.prototype.getData = function (urlParams) {
        var _this = this;
        var params;
        return new Promise(function (resolve, reject) {
            _this.config.getApiUrl()
                .then(function (res) {
                var apiUrl = res;
                console.log(apiUrl);
                params = {
                    apiUrl: apiUrl,
                    urlParams: urlParams
                };
                resolve(_this.getAjax(params));
            }, function (err) {
                console.log("Whoops!" + err);
            });
        });
    };
    AjaxProvider.prototype.getAjax = function (params) {
        var _this = this;
        console.log(params);
        var urlParams = params.urlParams;
        var baseUrl = params.apiUrl;
        var url = baseUrl + '?url=/app/objects' + urlParams;
        //console.log(url);
        return new Promise(function (resolve, reject) {
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res.response.data);
            }, function (err) {
                console.log("Whoops!" + err);
            });
        });
    };
    AjaxProvider.prototype.postAjax = function (params) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]();
        //headers.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        headers.append('Content-Type', 'application/json');
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({ headers: headers });
        this.config.getApiUrl().then(function (url) {
            //console.log(url);
            if (params) {
                params.apiUrl = url.toString();
                //console.log(params);
                _this.http.post(params.apiUrl, params.data, options)
                    .map(function (res) { return res.json(); })
                    .subscribe(function (res) {
                    console.log(res.response);
                }, function (err) {
                    console.log("failed: " + err);
                });
            }
        });
    };
    return AjaxProvider;
}());
AjaxProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_3__providers_config_config__["a" /* ConfigProvider */]])
], AjaxProvider);

//# sourceMappingURL=ajax.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
var ConfigProvider = (function () {
    function ConfigProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        //  console.log('Hello ConfigProvider Provider');
    }
    ConfigProvider.prototype.getApiUrl = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.get('ipaddress')
                .then(function (res) {
                //console.log(res);
                resolve('http://' + res + '/sdcard/cpt/app/data_api2.php');
            }, function (err) {
                console.log("Whoops!" + err);
            });
        });
    };
    return ConfigProvider;
}());
ConfigProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
], ConfigProvider);

//# sourceMappingURL=config.js.map

/***/ })

},[216]);
//# sourceMappingURL=main.js.map