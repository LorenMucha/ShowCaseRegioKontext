import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj.js'
import VectorSource from 'ol/source/Vector';
import GML3 from 'ol/format/GML3'
import WFS from 'ol/format/WFS'
import VectorLayer from 'ol/layer/Vector';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';


const berlinLonLat = [13.404954, 52.520008];
const mapCenter = fromLonLat(berlinLonLat);

const vectorSource = new VectorSource({
  format: new WFS({ version: '2.0.0', gmlFormat: new GML3() }),
  url: function (extent) {
    return (
      'https://isk.geobasis-bb.de/ows/vg_historisch_wfs?service=WFS&' +
      'version=2.0.0&request=GetFeature&typename=app:ge_2022&' +
      'outputFormat=GML3&srsname=EPSG:3857&' +
      'bbox=' +
      extent.join(',') +
      ',EPSG:3857'
    );
  },
  strategy: bboxStrategy,
});

const vector = new VectorLayer({
  source: vectorSource,
  style: {
    'stroke-width': 0.75,
    'stroke-color': 'black',
    'fill-color': 'rgba(255, 255, 0, 0.63)',
  },
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: OlMap = new OlMap;
  layers = null;


  @Input({ required: true }) layer: TileLayer<any> | undefined;
  private currentLayer: TileLayer<any> | undefined;
  ngOnInit(): void {
    this.map = new OlMap({
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [
        this.layer!, vector
      ],
      target: 'ol-map'
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const newLayer = changes['layer'].currentValue

    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer)
    }
    this.map.getLayers().insertAt(0, newLayer);
    this.currentLayer = newLayer
    setTimeout(() => { this.map.updateSize(); });
  }
}
