import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj.js'
import Select from 'ol/interaction/Select'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM';
import { LayerState } from 'src/app/store'
import { Store } from '@ngrx/store'
import * as fromLayerStore from '../../store'


const berlinLonLat = [13.404954, 52.520008]
const mapCenter = fromLonLat(berlinLonLat)

@Component({
  selector: 'app-map',
  template: '<div class="h-full"><div div id="ol-map" class="h-full w-full"> </div>'
})
export class MapComponent implements OnInit, AfterViewInit {
  map: OlMap = new OlMap
  private gemBerlin: VectorLayer<any> | undefined
  private gemBrb: VectorLayer<any> | undefined
  private baseMap: TileLayer<any> = new TileLayer({
    source: new OSM(),
  })
  private currentLayer: TileLayer<any> | undefined

  constructor(private store: Store<LayerState>) { }

  ngOnInit(): void {

    this.map = new OlMap({
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [this.baseMap],
      target: 'ol-map'
    })

    this.store.dispatch(fromLayerStore.loadAllMapLayer())
    //console.log(this.store.dispatch(fromLayerStore.loadSingleMapLayer({ payload: 1 })))
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

    // this.map.on('singleclick', (event) => {
    //   this.gemBrb!.on('prerender', (event) => {
    //     var feature = selectSingleClick.getFeatures()
    //     console.log(feature.item(0))
    //   })
    // })
  }
}
