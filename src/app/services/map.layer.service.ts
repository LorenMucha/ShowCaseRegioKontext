import { Injectable } from '@angular/core'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { HttpClient } from '@angular/common/http'
import { MapLayer } from '../model/map.layer'
import { Observable, map, forkJoin, of, mergeMap, mergeAll, toArray, tap } from 'rxjs'
import { Feature } from 'ol'


@Injectable({
  providedIn: 'root',
})
export class MapLayerService {
  private layerBrb: MapLayer | undefined
  private layerBerlin: MapLayer | undefined
  constructor(private httpClient: HttpClient) { }

  getMapLayers(): Observable<MapLayer[]> {
    return forkJoin([this.getLayerBerlin(), this.getLayerBrB()])
  }

  getLayer(id: number): Observable<MapLayer> {
    const layer = id === 1 ? this.getLayerBerlin() : this.getLayerBrB()
    return layer
  }

  getFeatureNames() {
    return this.getMapLayers()
      .pipe(
        mergeAll(),
        mergeMap((value) => {
          var source = value.layer.getSource()
          var features = source.getFeatures() as Array<Feature>
          return features
        }),
        map((feature) => {
          return { name: feature.get('name'), ags: feature.get('nr') }
        }),
        toArray()
      )
  }

  //FIXME: in einen ngrx store umschreiben !
  private getLayerBerlin(): Observable<MapLayer> {
    if (this.layerBerlin === undefined) {
      return this.httpClient.get('assets/geojson/bez_berlin_2023.json')
        .pipe(
          map((layer) => {
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
            this.layerBerlin = new MapLayer(1, vector, "Gemeinden Berlin")
            return this.layerBerlin
          }))
    } else {
      return of(this.layerBerlin)
    }
  }

  private getLayerBrB(): Observable<MapLayer> {
    if (this.layerBrb === undefined) {
      return this.httpClient.get('assets/geojson/gem_brb_2023.json')
        .pipe(
          map((layer) => {
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
            this.layerBrb = new MapLayer(1, vector, "Gemeinden Berlin")
            return this.layerBrb
          }))
    } else {
      return of(this.layerBrb)
    }
  }
}
