import { Injectable } from '@angular/core'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { HttpClient } from '@angular/common/http'
import { MapLayer } from '../model/map.layer'
import { Observable, map, forkJoin, of, mergeMap, mergeAll, toArray, tap, filter, zip, BehaviorSubject, withLatestFrom, Subject } from 'rxjs'
import { Feature } from 'ol'
import { ZuUndFortzuege } from '../model/indicators/zu.fortzuege'
import { TableElem } from '../model/table-elem'


export enum Indicator {
  ZuUndFortzuege = 'zu_fortzuege.json'
}

export enum Bounds {
  Berlin, Brandenburg
}

@Injectable({
  providedIn: 'root',
})
export class MapLayerService {
  private layerBrb: VectorLayer<any> | undefined
  private layerBerlin: VectorLayer<any> | undefined
  private defaultStyle: Style = new Style({
    fill: new Fill({
      color: `rgba(124,124,0, 0.5)`
    }),
    stroke: new Stroke({
      color: 'black'
    })
  })
  private tableFeatures: Subject<TableElem[]> = new Subject<TableElem[]>()
  public receivedTableFeatures$ = this.tableFeatures.asObservable()
  private currentLayer: Observable<MapLayer> | undefined
  constructor(private httpClient: HttpClient) { }

  getMapLayerForBounds(indicator: Indicator, bounds: Bounds, year: number): Observable<MapLayer> {
    const tableSource: TableElem[] = []
    if (bounds == Bounds.Berlin) {
      return forkJoin([this.getLayerBerlin(), this.getIndicatorData(indicator, year)])
        .pipe(
          mergeMap(([layer, data]) => {
            var vector = new VectorSource()
            var source = layer.getSource()
            var features = source.getFeatures() as Array<Feature>
            features.forEach((feature) => {
              var value = 0
              data
                .filter((x) => x.Name.includes(feature.get('name')))
                .map((y) => value += y['Fortzüge insgesamt'])

              vector.addFeature(new Feature({
                value: value,
                geometry: feature.getGeometry(),
                name: feature.get('name')
              }))
              const tableFeature = new TableElem(feature.get('nr'), feature.get('name'), value)
              tableSource.push(tableFeature)
            })
            const vectorLayer = new VectorLayer({
              source: vector,
              style: this.defaultStyle
            })
            const mapLayer = new MapLayer(1, vectorLayer, 'Berlin', indicator)
            this.currentLayer = of(mapLayer)
            this.tableFeatures.next(tableSource)
            return this.currentLayer
          })
        )
    } else {
      return of(new MapLayer())
    }
  }

  //FIXME: simplify
  private getLayerBerlin(): Observable<VectorLayer<any>> {
    if (this.layerBerlin === undefined) {
      return this.httpClient.get('assets/geojson/ortsteile_berlin_2023.json')
        .pipe(
          map((layer) => {
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(layer)
            })
            const vector = new VectorLayer({
              source: vectorSource,
              style: this.defaultStyle
            })
            this.layerBerlin = vector
            return this.layerBerlin
          }))
    } else {
      return of(this.layerBerlin)
    }
  }

  private getLayerBrB(): Observable<VectorLayer<any>> {
    if (this.layerBrb === undefined) {
      return this.httpClient.get('assets/geojson/gem_brb_2023.json')
        .pipe(
          map((layer) => {
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(layer)
            })
            const vector = new VectorLayer({
              source: vectorSource,
              style: this.defaultStyle
            })
            this.layerBrb = vector
            return this.layerBrb
          }))
    } else {
      return of(this.layerBrb)
    }
  }

  private getIndicatorData(indicator: Indicator, year: number) {
    return this.httpClient.get<ZuUndFortzuege[]>(`assets/data/${indicator}`)
      .pipe(
        mergeAll(),
        filter((x) => x.Jahr == year),
        toArray()
      )
  }
}
