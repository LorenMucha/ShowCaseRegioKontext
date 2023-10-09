import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-timeslider',
  templateUrl: './timeslider.component.html',
  styleUrls: ['./timeslider.component.css']
})
export class TimesliderComponent implements OnInit, OnDestroy {
  min: number | undefined
  max: number | undefined
  @Output() yearEvent = new EventEmitter<number>();
  private years: number[] = []
  private yearsStream$: BehaviorSubject<Set<number>> | undefined
  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.yearsStream$ = this.dataService.getMapYears()
    this.yearsStream$.pipe(
      takeUntil(this.years)
    ).subscribe((years) => {
      this.years = Array.from(years)
      this.min = Math.min(...this.years)
      this.max = Math.max(...this.years)
    })
  }

  changeYear(evt: Event) {
    const year = Number((evt.target as HTMLInputElement).value)
    console.log("Slider", year)
    this.yearEvent.emit(year)
  }

  ngOnDestroy() {
    this.yearsStream$?.complete()
  }
}
