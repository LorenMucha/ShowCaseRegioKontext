import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import XYZ from 'ol/source/XYZ';
import { MapLayer } from '../model/map-layer';

/* This is just a helper service for the fake data 
TODO: create Test
*/

@Injectable({
  providedIn: 'root'
})
export class InitService {
  osm: TileLayer<any> = new TileLayer({
    source: new OSM(),
  })
  satelliteLayer: TileLayer<any> = new TileLayer({
    source: new XYZ({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 23
    })
  })
  watercolorLayer: TileLayer<any> = new TileLayer({
    source: new Stamen({
      layer: 'watercolor',
    }),
  })
  constructor() { }
  createLayer(indicatorList: Array<string>): Array<MapLayer> {
    return [{
      id: "osm",
      name: indicatorList.at(0) as string,
      active: true,
      layer: this.osm
    },
    {
      id: "satellite",
      name: indicatorList.at(1) as string,
      active: false,
      layer: this.satelliteLayer
    },
    {
      id: "watercolor",
      name: indicatorList.at(2) as string,
      active: false,
      layer: this.watercolorLayer
    }
    ]
  }
}
