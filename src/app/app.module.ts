import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TapsComponent } from './components/ui/taps/taps.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './components/table/table.component';
import { DataService } from './services/data.service';
import { TimesliderComponent } from './components/ui/timeslider/timeslider.component';
import { MatSortModule } from '@angular/material/sort';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    TapsComponent,
    TableComponent,
    TimesliderComponent,
  ],
  imports: [
    MapComponent,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSortModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTableModule, MatIconModule, MatCheckboxModule
  ],
  providers: [DataService, {
    provide: 'mapId',
    useValue: 'ol-map'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
