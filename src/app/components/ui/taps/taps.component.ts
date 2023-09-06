import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapLayer } from 'src/app/model/map-layer';

@Component({
  selector: 'app-taps',
  templateUrl: './taps.component.html',
  styleUrls: ['./taps.component.css']
})
export class TapsComponent {
  @Input({ required: true }) mapLayers: Array<MapLayer> = []
  private selectedLayer: MapLayer | undefined
  @Output() layerChangeEvent = new EventEmitter<MapLayer>();

  changeMap(mapLayer: MapLayer) {
    this.selectedLayer = mapLayer
    this.mapLayers.forEach((map) => { map.active = false })
    this.selectedLayer.active = !this.selectedLayer.active
    console.log(this.selectedLayer)
    this.layerChangeEvent.emit(this.selectedLayer);
  }
}
