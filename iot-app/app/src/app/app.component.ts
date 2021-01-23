import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'ngiot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLedBlink = false;

  title = '停止中';

  async ngOnInit() {
    this.isLedBlink = false;
  }

  onClick() {
    this.isLedBlink = !this.isLedBlink;
    this.title = this.isLedBlink ? 'Lチカなう' : '停止中';
    console.log('this.isLedBlink: ', this.isLedBlink);
  }
}
