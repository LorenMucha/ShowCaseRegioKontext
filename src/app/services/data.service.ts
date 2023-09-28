import { Injectable } from '@angular/core'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { HttpClient } from '@angular/common/http'
import { MapLayer } from '../model/map.layer'
import { Observable, map, forkJoin, of, mergeMap, mergeAll, toArray, filter, tap, BehaviorSubject } from 'rxjs'
import { Feature } from 'ol'
import { ZuUndFortzuege, ZuUndFortzuegeData } from '../model/indicators/zu.fortzuege'
import { TableElem } from '../model/table-elem'
import { colorRange } from '@heyeso/color-range'
import { Bounds } from '../model/bounds'
import { IndicatorData } from '../model/indicators/indicator.data'


const DATA_SRC_BERLIN = 'assets/geojson/pgr_berlin_2021.json'
const DATA_SRC_BRB = 'assets/geojson/gem_brb_2023.json'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private layerBrb: VectorLayer<any> | undefined
  private layerBerlin: VectorLayer<any> | undefined
  private tableFeatures: BehaviorSubject<TableElem[]> = new BehaviorSubject<TableElem[]>([])
  private selectedIndicator: BehaviorSubject<IndicatorData> = new BehaviorSubject<IndicatorData>(new ZuUndFortzuege())
  private selectedYear: number | undefined
  public mapLayerBerlin: MapLayer | undefined
  public mapLayerBrandenburg: MapLayer | undefined
  private receivedYears: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set())
  constructor(private httpClient: HttpClient) { }

  getTableFeatures(): BehaviorSubject<TableElem[]> {
    return this.tableFeatures
  }

  getMapYears(): BehaviorSubject<Set<number>> {
    return this.receivedYears
  }

  getSelectedIndicator(): BehaviorSubject<IndicatorData> {
    return this.selectedIndicator
  }

  getSelectedYear(): number { return this.selectedYear! }

  getMapLayerForBounds(indicator: IndicatorData, bounds: Bounds, year: number): Observable<MapLayer> {
    const tableSource: TableElem[] = []
    this.selectedIndicator.next(indicator)
    this.selectedYear = year
    if (bounds == Bounds.Berlin) {
      return forkJoin([this.getLayerBerlin(), this.getIndicatorData(indicator, year)])
        .pipe(
          tap(([layer, data]) => {
            data.forEach((data) => {
              //create Table source
              const tableFeature = new TableElem(data.Kennziffer, data.Name, data['Fortzüge insgesamt'])
              tableSource.push(tableFeature)
            })
          }),
          mergeMap(([layer, data]) => {
            var vector = new VectorSource()
            var source = layer.getSource()
            var features = source.getFeatures() as Array<Feature>

            features.forEach((feature) => {
              let value = 0
              const name = feature.get('PROGNOSERA')
              data
                .filter((x) => name.includes(x.Name))
                .map((y) => value += y['Fortzüge insgesamt'])

              vector.addFeature(new Feature({
                value: value,
                geometry: feature.getGeometry(),
                name: name
              }))
            })
            const vectorLayer = new VectorLayer({ source: vector })
            const max = Math.max(...tableSource.map((item) => item.value))
            const min = Math.min(...tableSource.map((item) => item.value))
            const mapLayer = new MapLayer(1, vectorLayer, 'Berlin', indicator, min, max, Bounds.Berlin)
            this.mapLayerBerlin = mapLayer
            this.tableFeatures.next(tableSource)
            return of(this.mapLayerBerlin)
          }),
          this.styleMapLayer
        )
    } else {
      return this.getLayerBrB().pipe(
        mergeMap((layer) => {
          const vectorLayer = new VectorLayer({ source: layer.getSource() })
          this.mapLayerBrandenburg = new MapLayer(2, vectorLayer, 'Brandenburg', indicator, undefined, undefined, Bounds.Brandenburg)
          return of(this.mapLayerBrandenburg)
        })
      )
    }
  }

  private getLayerBerlin(): Observable<VectorLayer<any>> {
    if (this.layerBerlin === undefined) {
      return this.httpClient.get(DATA_SRC_BERLIN)
        .pipe(
          map((layer) => {
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(layer)
            })
            const vector = new VectorLayer({ source: vectorSource })
            this.layerBerlin = vector
            return this.layerBerlin
          }))
    } else {
      return of(this.layerBerlin)
    }
  }

  private getLayerBrB(): Observable<VectorLayer<any>> {
    if (this.layerBrb === undefined) {
      return this.httpClient.get(DATA_SRC_BRB)
        .pipe(
          map((layer) => {
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(layer)
            })
            const vector = new VectorLayer({ source: vectorSource })
            this.layerBrb = vector
            return this.layerBrb
          }))
    } else {
      return of(this.layerBrb)
    }
  }

  private getIndicatorData(indicator: IndicatorData, year: number) {
    const years = new Set<number>()
    return this.httpClient.get<ZuUndFortzuegeData[]>(`assets/data/${indicator.url}`)
      .pipe(
        mergeAll(),
        tap((item) => {
          years.add(item.Jahr)
        }),
        filter((x) => !x.Kennziffer === false && x.Jahr == year),
        toArray(),
        tap(() => this.receivedYears.next(years))
      )
  }

  private styleMapLayer(layer: Observable<MapLayer>): Observable<MapLayer> {
    return layer.pipe(
      mergeMap((item) => {
        const test_colors = [[255, 50, 0], [124, 252, 0]];
        var vector = new VectorSource()
        var source = item.layer.getSource()
        var features = source.getFeatures() as Array<Feature>

        features.forEach((layer) => {
          const value = layer.get('value')
          const temperatureMap = colorRange(test_colors, [item.min, item.max])
          const color = temperatureMap.getColor(value)
          const style = new Style({
            fill: new Fill({
              color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b},  0.5)`
            }),
            stroke: new Stroke({
              color: 'black'
            })
          })
          layer.setStyle(style)
          layer.set('style', style)
          vector.addFeature(layer)
        })
        item.setLayer(new VectorLayer({ source: vector }))
        return of(item)
      })
    )
  }
}
