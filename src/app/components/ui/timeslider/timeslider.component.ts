import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-timeslider',
  templateUrl: './timeslider.component.html',
  styleUrls: ['./timeslider.component.css']
})
export class TimesliderComponent implements OnInit {
  min: number | undefined
  max: number | undefined
  @Output() yearEvent = new EventEmitter<number>();
  private years: number[] = []
  private yearStream$ = new Subject<Set<number>>
  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.receivedYears$?.pipe(
      takeUntil(this.years)
    ).subscribe((years) => {
      this.years = Array.from(years)
      this.min = Math.min(...this.years)
      this.max = Math.max(...this.years)
    })
  }

  changeYear(evt: Event) {
    const year = Number((evt.target as HTMLInputElement).value)
    this.yearEvent.emit(year)
  }
}
