import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import Stamen from 'ol/source/Stamen'

export const MapLayers = new Map<string, any>([
  [
    "osm", new TileLayer({
      source: new OSM(),
    })
  ],
  ["satellite", new TileLayer({
    source: new XYZ({
      attributions: ['Powered by Esri',
        'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
      attributionsCollapsible: false,
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 23
    })
  })],
  ["watercolor", new TileLayer({
    source: new Stamen({
      layer: 'watercolor',
    }),
  }),]
]);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: OlMap = new OlMap;
  layers = MapLayers;

  @Input() layerName = "osm";
  currentLayer = this.layers.get(this.layerName)

  ngOnInit(): void {
    this.map = new OlMap({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        this.layers.get(this.layerName)
      ],
      target: 'ol-map'
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let newLayer = this.layers.get(this.layerName);
    this.map.removeLayer(this.currentLayer)
    this.map.getLayers().insertAt(0, newLayer);
    this.currentLayer = newLayer
  }
}
