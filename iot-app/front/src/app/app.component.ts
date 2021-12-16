import { Component, OnInit } from '@angular/core';
import { GPIOAccess, GPIOPort, requestGPIOAccess } from 'node-web-gpio';

@Component({
  selector: 'ngiot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** requestGPIOAccess 割当 */
  requestGPIOAccess = requestGPIOAccess;
  /** GPIOAccess 定義 */
  gpioAccess: GPIOAccess | undefined;
  /** GPIOPort 定義 */
  port: GPIOPort | undefined;

  /** ボタンタイトル */
  title = '停止中';
  /** LED点灯フラグ */
  isLedBlink = false;
  /** setInterval 用ID */
  nodeInterval: NodeJS.Timeout | null;

  isAuto = true;

  constructor() {
    this.nodeInterval = null;
  }

  async ngOnInit() {
    this.isLedBlink = false;
    this.isAuto = true;
    this.gpioAccess = await requestGPIOAccess();
    // GPIOピン割当
    this.port = this.gpioAccess.ports.get(26);
    // GPIOピン出力モード
    await this.port?.export('out');
  }

  onClickAutoStart() {
    this.isLedBlink ? this.stopNodeInterval() : this.startNodeInterval();
  }

  onClickAutoStop() {
    this.stopNodeInterval();
  }

  onClickManual() {
    //
  }

  onClickMode(mode: boolean) {
    this.isAuto = mode;
  }

  private startNodeInterval() {
    this.nodeInterval = setInterval(async () => {
      this.isLedBlink = !this.isLedBlink;
      this.title = this.isLedBlink ? 'Lチカなう' : '停止中';
      await this.port?.write(1);
    }, 1000);
  }

  private stopNodeInterval() {
    if (this.nodeInterval !== null) {
      clearInterval(this.nodeInterval);
    }
    this.isLedBlink = false;
  }
}
