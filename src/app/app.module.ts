import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import { TapsComponent } from './components/ui/taps/taps.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { InitService } from './services/init.service';
import { MapService } from './services/map.service';



@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TapsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTableModule, MatIconModule
  ],
  providers: [InitService, MapService, {
    provide: 'mapId',
    useValue: 'ol-map'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
