import { Component, OnInit } from '@angular/core';
declare var require: any;
const requestGPIOAccess = require('node-web-gpio');

@Component({
  selector: 'ngiot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLedBlink = false;
  requestGPIOAccess = requestGPIOAccess;

  title = '停止中';

  ngOnInit() {
    this.isLedBlink = false;
  }

  async onClickAuto() {
    this.isLedBlink = !this.isLedBlink;
    this.title = this.isLedBlink ? 'Lチカなう' : '停止中';
    const gpioAccess = await requestGPIOAccess();
    const port = gpioAccess.ports.get(26);
    await port?.export('out');
    setInterval(async () => await port?.export('out'), 1000);
    console.log('this.isLedBlink: ', this.isLedBlink);
  }

  onClickManual() {
    //
  }
}
