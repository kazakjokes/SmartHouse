import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { LightsDetailsPage } from '../lights-details/lights-details';

@Component({
  selector: 'page-lights',
  templateUrl: 'lights.html'
})
export class LightsPage {
  //lights : any;
  items: Array<{title: string, note: string, icon: string}>;
  premises: Array<{title: string, icon: string, note: string, scenes: any, lights: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.premises=[];

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
            path:'/Modbus/ModbusS/DalBdim/Dim6.in',
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

  itemTapped(event, item) {
    this.navCtrl.push(LightsDetailsPage, {
      item: item
    });
  }
}
