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
  labelBlink = '';
  /** LED点灯フラグ */
  isLedBlink = false;
  /** setInterval 用ID */
  nodeInterval: NodeJS.Timeout | null;
  /** 自動フラグ */
  isAuto = true;
  /** Raspberry Pi 接続エラーフラグ */
  isConnectError = false;

  constructor() {
    this.nodeInterval = null;
  }

  async ngOnInit() {
    this.isLedBlink = false;
    this.isAuto = true;
    this.labelBlink = 'LED消灯';
    await this.connectRaspberryPi();
  }

  /**
   * 自動LED点滅・点灯開始
   */
  onClickAutoStart() {
    this.startNodeInterval();
  }

  /**
   * 自動LED点滅・点灯終了
   */
  onClickAutoStop() {
    this.stopNodeInterval();
  }

  /**
   * 手動LED点滅・点灯
   */
  async onClickManual() {
    this.blinkLED();
  }

  /**
   * Raspberry Pi 手動接続
   */
  async onClickManualConnect() {
    await this.connectRaspberryPi();
  }

  /**
   * Raspberry Pi 接続処理
   */
  private async connectRaspberryPi() {
    this.isConnectError = false;
    try {
      this.gpioAccess = await requestGPIOAccess();
      // GPIOピン割当
      this.port = this.gpioAccess.ports.get(26);
      // GPIOピン出力モード
      await this.port?.export('out');
    } catch (error) {
      this.isConnectError = true;
    }
  }

  /**
   * LED点灯処理
   */
  private async blinkLED() {
    this.isLedBlink = !this.isLedBlink;
    this.labelBlink = this.isLedBlink ? 'LED点灯中' : 'LED消灯';
    this.isLedBlink ? await this.port?.write(1) : await this.port?.write(0);
  }

  /**
   * 自動・手動モード変更
   * @param mode
   */
  onClickMode(mode: boolean) {
    this.isAuto = mode;
    if (!this.isAuto) {
      this.stopNodeInterval();
    }
  }

  /**
   * LED自動点灯タイマー開始
   */
  private startNodeInterval() {
    this.nodeInterval = setInterval(async () => {
      await this.blinkLED();
    }, 1000);
  }

  /**
   * LED自動点灯タイマー停止
   */
  private stopNodeInterval() {
    if (this.nodeInterval !== null) {
      clearInterval(this.nodeInterval);
    }
    this.isLedBlink = false;
  }
}
