import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { map, takeUntil, toArray } from 'rxjs/operators';
import { TableElem } from 'src/app/model/table-elem';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {

  tableSource = new MatTableDataSource<TableElem>();
  tableStream$ = new Subject<TableElem[]>
  displayedColumns: string[] = ['id', 'name', 'value'];
  constructor(private dataService: DataService) { }

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
    this.dataService.receivedTableFeatures$.pipe(
      takeUntil(this.tableSource.data),
      map(data => data.sort(this.sortByName))
    ).subscribe((elements) => {
      var tableElementsArr: TableElem[] = []
      elements.forEach((elem) => tableElementsArr.push(elem))
      this.tableSource.data = tableElementsArr
    })
  }

  ngOnDestroy() {
    this.tableStream$.complete();
  }
}
