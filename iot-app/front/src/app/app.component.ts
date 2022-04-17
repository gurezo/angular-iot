import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'ngiot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** ボタンタイトル */
  labelBlink = '';
  /** LED点灯フラグ */
  isLedBlink = false;
  /** 自動フラグ */
  isAuto = true;
  /** Raspberry Pi 接続エラーフラグ */
  isConnectError = false;

  private destroy = new Subject<void>();

  constructor(private service: AppService) {}

  async ngOnInit() {
    this.init();
    // this.isLedBlink = false;
    // this.isAuto = true;
    // console.log('%cStop!', 'font-size: 100px; color: red; font-weight: bold');
  }

  private init() {
    this.service
      .init(16)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.isLedBlink = false;
          this.isAuto = true;
          console.log(
            '%cOK !!!',
            'font-size: 100px; color: blue; font-weight: bold'
          );
        },
        error: (error) => {
          console.log(
            '%cStop!',
            'font-size: 100px; color: red; font-weight: bold',
            error
          );
        },
      });
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
  }

  /**
   * LED点灯処理
   */
  private async blinkLED() {}

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
  private startNodeInterval() {}

  /**
   * LED自動点灯タイマー停止
   */
  private stopNodeInterval() {
    this.isLedBlink = false;
  }
}
