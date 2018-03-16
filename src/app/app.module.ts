import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { D3Service } from 'd3-ng2-service';

import { APP_SERVICES } from './core/services';
import { AppComponent } from './app.component';
import { ChartComponent } from './core/components/chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    APP_SERVICES,
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
