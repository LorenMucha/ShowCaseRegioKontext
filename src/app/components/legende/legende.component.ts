import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, skip, takeUntil } from 'rxjs';
import { IndicatorData } from 'src/app/model/indicators/indicator.data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-legende',
  templateUrl: './legende.component.html',
  styleUrls: ['./legende.component.css']
})
export class LegendeComponent implements AfterViewInit, OnDestroy {

  indicator: IndicatorData | undefined
  year: number | undefined
  indicatorStream$: BehaviorSubject<IndicatorData> | undefined

  constructor(private dataService: DataService) { }

  ngAfterViewInit(): void {
    this.indicatorStream$ = this.dataService.getSelectedIndicator()
    this.indicatorStream$
      .pipe(
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        this.indicator = data
        this.year = this.dataService.getSelectedYear()
      })
  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }

}
