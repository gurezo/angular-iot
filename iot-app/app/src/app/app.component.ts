import { Component, OnInit } from '@angular/core';

declare var require: any;
const { requestGPIOAccess } = require('node-web-gpio');
// const { promisify } = require("util");
// const sleep = promisify(setTimeout);

@Component({
  selector: 'ngiot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLedBlink = false;

  title = '停止中';

  // constructor(private polyfull: chirimen) {}

  async ngOnInit() {
    this.isLedBlink = false;
    const gpioAccess = await requestGPIOAccess();
  }

  onClick() {
    this.isLedBlink = !this.isLedBlink;
    this.title = this.isLedBlink ? 'Lチカなう' : '停止中';
    console.log('this.isLedBlink: ', this.isLedBlink);

    // FIXME: rxjs で、ストリームを作成して、流す
  }
}
