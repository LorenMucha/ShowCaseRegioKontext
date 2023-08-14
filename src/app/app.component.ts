import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MapLayers } from './components/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  layers = MapLayers
  selectedMap: string = "osm";
  objectKeys = Object.keys;
  onTabChange($event: MatTabChangeEvent) {
    this.selectedMap = $event.tab.textLabel.toLowerCase()
  }
}
