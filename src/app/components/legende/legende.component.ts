import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, forkJoin, merge, withLatestFrom, zip } from 'rxjs';
import { IndicatorImpl } from 'src/app/model/indicators/indicator.data';
import { MapLayer } from 'src/app/model/map.layer';
import { DataService } from 'src/app/services/data.service';


class LegendValue {
  min: number
  max: number
  color: string
  constructor(min: number, max: number, color: string) {
    this.min = min
    this.max = max
    this.color = color
  }
}

@Component({
  selector: 'app-legende',
  templateUrl: './legende.component.html',
  styleUrls: ['./legende.component.css']
})
export class LegendeComponent implements AfterViewInit, OnDestroy {

  indicator: IndicatorImpl | undefined
  yearStream$: BehaviorSubject<number> | undefined
  indicatorStream$: BehaviorSubject<IndicatorImpl> | undefined
  legendItems: Array<LegendValue> = []
  marked: boolean = false;
  private mapLayerStream$: BehaviorSubject<MapLayer> | undefined

  constructor(private dataService: DataService, private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.indicatorStream$ = this.dataService.getSelectedIndicator()
    this.mapLayerStream$ = this.dataService.getMapLayerBerlinStream()
    this.mapLayerStream$
      .pipe(
        filter((indicator) => !!indicator),
        withLatestFrom(this.indicatorStream$)
      ).subscribe(([map, indicator]) => {
        try {
          this.indicator = indicator
          this.yearStream$ = this.dataService.getSelectedYear()
          this.initLegend(map)
        } catch (ignored) {
          console.warn(ignored)
        }
      })
    this.cdRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }

  highlightBounds(value: number): void {

  }

  initLegend(layer: MapLayer): void {
    const colorMap = layer.colorMap
    this.legendItems = []
    let i = 0
    const rangeLength = layer.valueRange.length
    console.log(rangeLength)
    layer.valueRange.forEach((val) => {
      let before = 0;
      if (i > 0 && i < rangeLength - 1) { before = layer.valueRange[i - 1] }
      if (i == rangeLength - 1) {
        val = layer.max
        before = layer.valueRange[i - 1]
      }
      this.legendItems.push(new LegendValue(before, val, colorMap.getColor(val).toString))
      i++;
    })
  }
}
