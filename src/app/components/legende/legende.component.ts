import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { IndicatorData } from 'src/app/model/indicators/indicator.data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-legende',
  templateUrl: './legende.component.html',
  styleUrls: ['./legende.component.css']
})
export class LegendeComponent implements AfterViewInit, OnDestroy {

  indicator: IndicatorData | undefined
  yearStream$: BehaviorSubject<number> | undefined
  indicatorStream$: BehaviorSubject<IndicatorData> | undefined

  constructor(private dataService: DataService, private cdRef: ChangeDetectorRef   ) { }

  ngAfterViewInit(): void {
    this.indicatorStream$ = this.dataService.getSelectedIndicator()
    this.indicatorStream$
      .pipe(
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        this.indicator = data
        this.yearStream$ = this.dataService.getSelectedYear()
      })
      this.cdRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.indicatorStream$?.complete()
  }

}
