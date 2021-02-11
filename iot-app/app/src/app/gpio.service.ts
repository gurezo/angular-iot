import { Injectable } from '@angular/core';
// import { GPIOAccess } from 'node-web-gpio';

// declare var require: any;
// const { requestGPIOAccess } = require('node-web-gpio');
// const { promisify } = require("util");
// const sleep = promisify(setTimeout);

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  gpioAccess: any;

  constructor() {}

  // FIXME: rxjs で、ストリームを作成して、流す

  // async init(gpioAccess: any) {
  //   gpioAccess = await requestGPIOAccess();

  // }

}
