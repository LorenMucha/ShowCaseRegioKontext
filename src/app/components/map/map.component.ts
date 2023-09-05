import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile';

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
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        this.layer!
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
  }
}
