import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { colorRange } from '@heyeso/color-range'
import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { BehaviorSubject, Observable, filter, forkJoin, map, mergeAll, mergeMap, of, tap, toArray } from 'rxjs'
import { Bounds } from '../model/bounds'
import { Indicator } from '../model/indicators/indicator.data'
import { ZuZuege } from '../model/indicators/zuzuege'
import { MapLayer } from '../model/map.layer'
import { TableElem } from '../model/table-elem'
import { VisualizeService } from './visualize.service'


const DATA_SRC_BERLIN = 'assets/geojson/pgr_berlin_2021.json'
const DATA_SRC_BRB = 'assets/geojson/brb_krs.json'
const MAP_COLORS = [[132, 22, 54], [173, 48, 67], [216, 76, 89], [233, 105, 90], [242, 138, 72], [250, 180, 0], [255, 217, 106], [204, 183, 154]];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private layerBrb: VectorLayer<any> | undefined
  private layerBerlin: VectorLayer<any> | undefined
  private tableFeatures: BehaviorSubject<TableElem[]> = new BehaviorSubject<TableElem[]>([])
  private selectedIndicator: BehaviorSubject<Indicator> = new BehaviorSubject<Indicator>(new ZuZuege())
  private selectedYear: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public mapLayerBerlin: MapLayer | undefined
  private layerBerlinStream$: BehaviorSubject<MapLayer> = new BehaviorSubject(new MapLayer())
  public mapLayerBrandenburg: MapLayer | undefined
  private receivedYears: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set())
  constructor(private httpClient: HttpClient, private visualService: VisualizeService) { }

  getMapLayerBerlinStream(): BehaviorSubject<MapLayer> {
    return this.layerBerlinStream$
  }

  getTableFeatures(): BehaviorSubject<TableElem[]> {
    return this.tableFeatures
  }

  getMapYears(): BehaviorSubject<Set<number>> {
    return this.receivedYears
  }

  getSelectedIndicator(): BehaviorSubject<Indicator> {
    return this.selectedIndicator
  }

  getSelectedYear(): BehaviorSubject<number> { return this.selectedYear }

  getMapLayerForBounds(indicator: Indicator, bounds: Bounds, year: number): Observable<MapLayer> {
    const tableSource: TableElem[] = []
    this.selectedIndicator.next(indicator)
    this.selectedYear.next(year)
    const indicatorData = this.getIndicatorData(indicator, year)

    if (bounds == Bounds.Berlin) {
      return forkJoin([this.getLayerBerlin(), indicatorData])
        .pipe(
          tap(([, data]) => {
            data.forEach((data) => {
              //create Table source
              const tableFeature = new TableElem(data.Kennziffer, data.Name, data[indicator.title])
              tableSource.push(tableFeature)
            })
          }),
          mergeMap(([layer, data]) => {
            let vector = new VectorSource()
            let source = layer.getSource()
            let features = source.getFeatures() as Array<Feature>

            features.forEach((feature) => {
              let value = 0
              const name = feature.get('PGR_NAME')

              data
                .filter((x) => name.includes(x.Name))
                .forEach((y) => value += y[indicator.title])

              vector.addFeature(new Feature({
                value: value,
                geometry: feature.getGeometry(),
                name: name,
                id: feature.get('AGS')
              }))
            })

            const vectorLayer = new VectorLayer({ source: vector })
            const max = Math.max(...tableSource.map((item) => item.value))
            const min = Math.min(...tableSource.map((item) => item.value))
            const range = this.visualService.buildRanges(tableSource.map((item) => item.value))
            const temperatureMap = colorRange(MAP_COLORS, range)
            const mapLayer = new MapLayer(1, vectorLayer, 'Planungsregion', indicator, min, max, Bounds.Berlin, temperatureMap, range)
            this.mapLayerBerlin = mapLayer
            this.tableFeatures.next(tableSource)
            this.layerBerlinStream$.next(this.mapLayerBerlin)
            return of(this.mapLayerBerlin)
          }),
          this.visualService.styleMapLayer
        )
    } else {
      return forkJoin([this.getLayerBrB(), indicatorData])
        .pipe(
          mergeMap(([layer, data]) => {

            let vector = new VectorSource()
            let source = layer.getSource()
            let features = source.getFeatures() as Array<Feature>
            const values: number[] = []

            features.forEach((feature) => {
              const ags = feature.get('AGS')
              let exists = false
              let value = 0

              data.forEach(ob => {
                const x = Object.keys(ob).filter(key => key.includes(ags))[0]
                exists = x !== undefined
                value += exists ? ob[x] : 0
              })

              if (exists) {
                vector.addFeature(new Feature({
                  value: value,
                  geometry: feature.getGeometry(),
                  name: feature.get("GEN"),
                  id: feature.get('AGS'),
                }))
                values.push(value)
              }
            })

            const vectorLayer = new VectorLayer({ source: vector })
            const max = Math.max(...values)
            const min = Math.min(...values)
            const range = this.visualService.buildRanges(values)
            const temperatureMap = colorRange(MAP_COLORS, range)
            const mapLayer = new MapLayer(2, vectorLayer, 'Brandenburg', indicator, min, max, Bounds.Brandenburg, temperatureMap, range)
            this.mapLayerBrandenburg = mapLayer
            return of(this.mapLayerBrandenburg)
          }),
          this.visualService.styleMapLayer
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

  private getIndicatorData(indicator: Indicator, year: number) {
    const years = new Set<number>()
    return this.httpClient.get<any[]>(`assets/data/${indicator.url}`)
      .pipe(
        mergeAll(),
        tap((item) => {
          years.add(item.Jahr)
        }),
        filter((x) => !x.Kennziffer === false && x.Jahr == year),
        toArray(),
        tap(() => this.receivedYears.next(years)),
      )
  }
}
