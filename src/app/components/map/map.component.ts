import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj.js'
import Select from 'ol/interaction/Select'
import { MapService } from 'src/app/services/map.service'
import VectorLayer from 'ol/layer/Vector'


const berlinLonLat = [13.404954, 52.520008]
const mapCenter = fromLonLat(berlinLonLat)

@Component({
  selector: 'app-map',
  template: '<div class="h-full"><div div id="ol-map" class="h-full w-full"> </div>'
})
export class MapComponent implements OnInit, AfterViewInit {
  map: OlMap = new OlMap
  gemBerlin!: VectorLayer<any>
  layers: Array<any> | undefined
  @Input({ required: true }) layer: TileLayer<any> | undefined
  private currentLayer: TileLayer<any> | undefined

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.map = new OlMap({
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [this.layer!],
      target: 'ol-map'
    })
    //FIXME: simplify
    this.mapService.addLayerBerlin(this.map)
    this.mapService.addLayerBrB(this.map)
  }

  ngOnChanges(changes: SimpleChanges) {
    const newLayer = changes['layer'].currentValue

    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer)
    }
    this.map.getLayers().insertAt(0, newLayer)
    this.currentLayer = newLayer
  }

  ngAfterViewInit(): void {
    var selectSingleClick = new Select()
    this.map.addInteraction(selectSingleClick)

    this.map.on('singleclick', (event) => {
      this.gemBerlin!.on('prerender', (event) => {
        var feature = selectSingleClick.getFeatures()
        console.log(feature.item(0))
      })
    })
  }
}
