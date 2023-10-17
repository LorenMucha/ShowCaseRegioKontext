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
        this.indicator = indicator
        this.yearStream$ = this.dataService.getSelectedYear()
        this.initLegend(map)
      })
    this.cdRef.detectChanges()

  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }

  highlightBounds(value: number): void {

  }

  initLegend(layer: MapLayer): void {
    const min = layer.min
    const max = layer.max
    const devider = max / 5
    const colorMap = layer.colorMap
    this.legendItems = []
    for (let x = min; x <= max; x += devider) {
      this.legendItems.push(new LegendValue(Math.round(x), Math.round(x + devider), colorMap.getColor(x).toString))
    }
  }
}
