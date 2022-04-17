import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { GpioService } from '../../chirimen-api/dist/api';
// import { GpioService } from '@chirimen-api';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private chirimen: GpioService) {}

  init(portNumber: number): Observable<any> {
    return forkJoin([
      this.chirimen.gpioAccess(),
      this.chirimen.gpioPortsGet(portNumber),
    ]);
  }

  // gpioAccess(): Observable<any> {
  //   return this.chirimen.gpioAccess();
  // }

  gpioPortWrite(writeValue: number): Observable<any> {
    return this.chirimen.gpioPortWrite(writeValue);
  }

  // gpioPortsGet(portNumber: number): Observable<any> {
  //   return this.chirimen.gpioPortsGet(portNumber);
  // }
}
