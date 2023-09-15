import { Injectable } from '@angular/core'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import * as gem_brb from '../../assets/geojson/gem_brb_2023.json'
import * as bez_berlin from '../../assets/geojson/bez_berlin_2023.json'
import GeoJSON from 'ol/format/GeoJSON'


@Injectable({
  providedIn: 'root',
})
export class MapService {

  private defaultFill: Fill = new Fill({
    color: `rgba(124,252,0, 0.5)`
  })

  private defaultStroke: Stroke = new Stroke({
    color: 'black'
  })


  constructor() { }

  getLayerBerlin(fill?: Fill, stroke?: Stroke): VectorLayer<any> {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(bez_berlin)
    })

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: fill !== undefined ? fill : this.defaultFill,
        stroke: stroke !== undefined ? stroke : this.defaultStroke
      })
    })

    return vector
  }

  getLayerBrB(fill?: Fill, stroke?: Stroke): VectorLayer<any> {

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(gem_brb)
    })

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: `rgba(124,124,0, 0.5)`
        }),
        stroke: stroke !== undefined ? stroke : this.defaultStroke
      })
    })

    console.log(vector)

    return vector
  }
}
