import { Injectable } from '@angular/core';
import { GPIOAccess } from 'node-web-gpio/dist';

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  // gpioAccess: GPIOAccess;

  constructor() {
    // this.gpioAccess = new GPIOAccess();
  }

  // FIXME: rxjs で、ストリームを作成して、流す


}
