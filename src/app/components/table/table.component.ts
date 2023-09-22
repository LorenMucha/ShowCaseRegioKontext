import { AfterViewInit, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil, toArray } from 'rxjs/operators';
import { TableElem } from 'src/app/model/table-elem';
import { Bounds, Indicator, MapLayerService } from 'src/app/services/map.layer.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  tableSource: Array<TableElem> = []
  tableStream$ = new Subject<TableElem[]>
  displayedColumns: string[] = ['id', 'name', 'value'];
  constructor(private mapService: MapLayerService) { }

  sortByName(a: TableElem, b: TableElem) {
    const nameA = a.name.toLocaleUpperCase();
    const nameB = b.name.toLocaleUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }

  ngAfterViewInit(): void {
    this.mapService.receivedTableFeatures$.pipe(
      takeUntil(this.tableSource),
      map(data => data.sort(this.sortByName))
    ).subscribe((elements) => {
      //FIXME: Tabelle wird nicht angezeigt
      elements.forEach((elem) => this.tableSource.push(elem))
    })
  }

  ngOnDestroy() {
    this.tableStream$.complete();
  }
}
