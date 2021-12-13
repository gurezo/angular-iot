import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GpioService } from './gpio.service';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [GpioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
