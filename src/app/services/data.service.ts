import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { colorRange } from '@heyeso/color-range'
import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import { BehaviorSubject, Observable, filter, forkJoin, map, mergeAll, mergeMap, of, tap, toArray } from 'rxjs'
import { Bounds } from '../model/bounds'
import { Indicator } from '../model/indicators/indicator.data'
import { ZuUndFortzuege, ZuUndFortzuegeData } from '../model/indicators/zu.fortzuege'
import { MapLayer } from '../model/map.layer'
import { TableElem } from '../model/table-elem'
import { RANGES } from '../constants'


const DATA_SRC_BERLIN = 'assets/geojson/pgr_berlin_2021.json'
const DATA_SRC_BRB = 'assets/geojson/gem_brb_2023.json'
const MAP_COLORS = [[132, 22, 54], [173, 48, 67], [216, 76, 89], [233, 105, 90], [242, 138, 72], [250, 180, 0], [255, 217, 106], [204, 183, 154]];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private layerBrb: VectorLayer<any> | undefined
  private layerBerlin: VectorLayer<any> | undefined
  private tableFeatures: BehaviorSubject<TableElem[]> = new BehaviorSubject<TableElem[]>([])
  private selectedIndicator: BehaviorSubject<Indicator> = new BehaviorSubject<Indicator>(new ZuUndFortzuege())
  private selectedYear: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public mapLayerBerlin: MapLayer | undefined
  private layerBerlinStream$: BehaviorSubject<MapLayer> = new BehaviorSubject(new MapLayer())
  public mapLayerBrandenburg: MapLayer | undefined
  private receivedYears: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set())
  constructor(private httpClient: HttpClient) { }

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

    if (bounds == Bounds.Berlin) {
      return forkJoin([this.getLayerBerlin(), this.getIndicatorData(indicator, year)])
        .pipe(
          tap(([, data]) => {
            data.forEach((data) => {
              //create Table source
              const tableFeature = new TableElem(data.Kennziffer, data.Name, data['Außenwanderungen Zuzüge insgesamt'])
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
                .forEach((y) => value += y['Außenwanderungen Zuzüge insgesamt'])

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
            const range = this.buildRanges(tableSource.map((item) => item.value))
            const temperatureMap = colorRange(MAP_COLORS, range)
            const mapLayer = new MapLayer(1, vectorLayer, 'Planungsregion', indicator, min, max, Bounds.Berlin, temperatureMap, range)
            this.mapLayerBerlin = mapLayer
            this.tableFeatures.next(tableSource)
            this.layerBerlinStream$.next(this.mapLayerBerlin)
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

  private getIndicatorData(indicator: Indicator, year: number) {
    const years = new Set<number>()
    return this.httpClient.get<ZuUndFortzuegeData[]>(`assets/data/${indicator.url}`)
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

  private styleMapLayer(layer: Observable<MapLayer>): Observable<MapLayer> {
    return layer.pipe(
      map((item) => {
        const vector = new VectorSource()
        const source = item.layer.getSource()
        const features = source.getFeatures() as Array<Feature>
        const temperatureMap = item.colorMap
        features.forEach((layer) => {
          const value = layer.get('value')
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
        item.setColorMap(temperatureMap)
        item.setLayer(new VectorLayer({ source: vector }))
        return item
      })
    )
  }

  private buildRanges(numbers: Array<number>): Array<number> {
    const min = Math.min.apply(null, numbers);
    const max = Math.max.apply(null, numbers);
    const spread = max - min;
    const step = spread / RANGES;
    const ranges = [];

    for (let i = 0; i < RANGES; i++) {
      for (let n = 0; n < numbers.length - 1; n++) {
        if (numbers[n] >= step * i + min && numbers[n] < step * (i + 1) + min) {
          if (!ranges[i]) ranges[i] = 0;
          ranges[i]++;
        }
      }
    }

    return ranges;
  }
}
