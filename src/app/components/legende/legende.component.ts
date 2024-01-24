import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations'
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { BehaviorSubject, filter, withLatestFrom } from 'rxjs'
import { IndicatorImpl } from 'src/app/model/indicators/indicator.data'
import { MapLayer } from 'src/app/model/map.layer'
import { DataService } from 'src/app/services/data.service'
import { AsyncPipe, CommonModule } from '@angular/common'
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

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

const DEFAULT_DURATION = 300

@Component({
  selector: 'app-legende',
  templateUrl: './legende.component.html',
  styleUrls: ['./legende.component.css'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, FontAwesomeModule],
  animations: [
    trigger('collapse', [
      state('false', style({ height: "25vh" })),
      state('true', style({ height: "70vh" })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ],
})
export class LegendeComponent implements AfterViewInit, OnDestroy {

  indicator: IndicatorImpl | undefined
  yearStream$: BehaviorSubject<number> | undefined
  indicatorStream$: BehaviorSubject<IndicatorImpl> | undefined
  legendItems: Array<LegendValue> = []
  marked: boolean = false
  collapsed = false
  faExpand = faExpand
  faCompress = faCompress
  height: any
  @ViewChild('legendSection') legendSection: ElementRef | undefined
  private mapLayerStream$: BehaviorSubject<MapLayer> | undefined

  constructor(private dataService: DataService, private cdRef: ChangeDetectorRef) {
  }

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
        } catch (ignored) { }
      })
    this.cdRef.detectChanges()
    this.height = this.legendSection!.nativeElement.offsetHeight;
  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }

  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }

  initLegend(layer: MapLayer): void {
    const colorMap = layer.colorMap
    this.legendItems = []
    let i = 0
    const rangeLength = layer.valueRange.length
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
