import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TableElem } from 'src/app/model/table-elem';
import { DataService } from 'src/app/services/data.service';
import { faChartLine } from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnDestroy, OnInit {
  spatialName: string | undefined
  tableSource = new MatTableDataSource<TableElem>()
  private tableSourceStream$: BehaviorSubject<TableElem[]> | undefined
  displayedColumns: string[] = ['id', 'name', 'value']

  @Output() tableHoverEvent = new EventEmitter<TableElem>()
  @Output() tableHoverResetEvent = new EventEmitter<TableElem>()
  @Output() lineChartEvent = new EventEmitter<TableElem>()

  @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
    this.tableSource.sort = sort;
  }

  faChartLine = faChartLine

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    if (this.sort) {
      this.tableSource.sort = this.sort
      const sortState: Sort = { active: 'name', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
  }

  sortByName(a: TableElem, b: TableElem) {
    const nameA = a.name.toLocaleUpperCase();
    const nameB = b.name.toLocaleUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.tableSourceStream$ = this.dataService.getTableFeatures()
    this.tableSourceStream$.pipe(
      takeUntil(this.tableSource.data),
      map(data => data.sort(this.sortByName))
    ).subscribe((elements) => {
      let tableElementsArr: TableElem[] = []
      elements.forEach((elem) => tableElementsArr.push(elem))
      this.tableSource.data = tableElementsArr
      this.spatialName = this.dataService.mapLayerBerlin?.name
    })
  }

  ngOnDestroy() {
    this.tableSourceStream$?.complete()
  }

  hoverLayer(event: TableElem) {
    this.tableHoverEvent.emit(event)
  }

  resetHover(event: TableElem) {
    this.tableHoverResetEvent.emit(event)
  }

  showLineChart(event: TableElem) {
    this.lineChartEvent.emit(event)
  }
}
