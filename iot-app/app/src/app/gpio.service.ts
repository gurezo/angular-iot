import { Injectable } from '@angular/core';
// import { GPIOAccess } from '@chirimen-raspi/polyfill';

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  gpioAccess: any;

  constructor() {}

  // FIXME: rxjs で、ストリームを作成して、流す


}
