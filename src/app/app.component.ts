import { Component, OnInit } from '@angular/core';
import { MapLayer } from './model/map-layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Stamen from 'ol/source/Stamen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{
  layers: Array<MapLayer> = [{
    id: "osm",
    name: "OSM",
    active: true,
    layer: new TileLayer({
      source: new OSM(),
    })
  },
  {
    id: "satellite",
    name: "Satellite",
    active: false,
    layer: new TileLayer({
      source: new XYZ({
        attributions: ['Powered by Esri',
          'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
        attributionsCollapsible: false,
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 23
      })
    }),
  },
  {
    id: "watercolor",
    name: "Watercolor",
    active: false,
    layer: new TileLayer({
      source: new Stamen({
        layer: 'watercolor',
      }),
    }),
  }
  ];
  selectedLayer: TileLayer<any> = this.layers[0].layer;

  objectKeys = Object.keys;
  changeLayer(layer: MapLayer) {
    this.selectedLayer = layer.layer
  }
}
