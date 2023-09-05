import { Component } from '@angular/core';
import { MapLayers } from './components/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  layers = MapLayers
  selectedMap: string = "osm";
  maps: Array<any> = [{
    id: "osm",
    name: "OSM",
    active: true
  },
  {
    id: "satellite",
    name: "Satellite",
    active: false
  },
  {
    id: "watercolor",
    name: "Watercolor",
    active: false
  }
  ];
  objectKeys = Object.keys;
  changeMap(map: any) {
    this.selectedMap = map.id
    this.maps.forEach((map) => { map.active = false })
    map.active = !map.active
  }
}
