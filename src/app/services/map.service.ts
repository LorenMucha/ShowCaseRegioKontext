import { Injectable } from '@angular/core'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { HttpClient } from '@angular/common/http'
import OlMap from 'ol/Map'


@Injectable({
  providedIn: 'root',
})
export class MapService {

  constructor(private httpClient: HttpClient) { }

  addLayerBerlin(map: OlMap): void {
    this.httpClient.get('assets/geojson/bez_berlin_2023.json')
      .subscribe((layer) => {
        console.log(layer)
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(layer)
        })
        const vector = new VectorLayer({
          source: vectorSource,
          style: new Style({
            fill: new Fill({
              color: `rgba(124,124,0, 0.5)`
            }),
            stroke: new Stroke({
              color: 'black'
            })
          })
        })

        map.addLayer(vector)
      })
  }

  addLayerBrB(map: OlMap): void {
    this.httpClient.get('assets/geojson/gem_brb_2023.json')
    .subscribe((layer) => {
      console.log(layer)
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(layer)
      })
      const vector = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: `rgba(124,252,0, 0.5)`
          }),
          stroke: new Stroke({
            color: 'black'
          })
        })
      })

      map.addLayer(vector)
    })
  }
}
