import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { IndicatorData } from 'src/app/model/indicators/indicator.data';
import { DataService } from 'src/app/services/data.service';


class LegendValue{
  min: number
  max: number
  color: string
  constructor(min: number, max: number, color:string){
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

  indicator: IndicatorData | undefined
  yearStream$: BehaviorSubject<number> | undefined
  indicatorStream$: BehaviorSubject<IndicatorData> | undefined
  legendItems: Array<LegendValue> = []


  constructor(private dataService: DataService, private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.indicatorStream$ = this.dataService.getSelectedIndicator()
    this.indicatorStream$
      .pipe(
        filter((data) => !!data)
      )
      .subscribe((data) => {
        this.indicator = data
        this.yearStream$ = this.dataService.getSelectedYear()
      })
    //FIXME: eigene Methode
    this.dataService.getMapLayerBerlin()
      .pipe(
        filter((layer) => !!layer.colorMap)
      )
      .subscribe((layer) => {
        const min = layer.min
        const max = layer.max
        const devider = max / 5
        const colorMap = layer.colorMap
        this.legendItems = []
        for (let x = min; x <= max; x += devider) {
          this.legendItems.push(new LegendValue(Math.round(x), Math.round(x+devider), colorMap.getColor(x).toString))
        }
        console.log(this.legendItems)
      })
    this.cdRef.detectChanges()

  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }
}
