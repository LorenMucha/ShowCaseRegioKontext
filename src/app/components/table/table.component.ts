import { AfterViewInit, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { MapLayerService } from 'src/app/services/map.layer.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  tableSource: Array<any> = []
  displayedColumns: string[] = ['id', 'name', 'ags'];
  constructor(private mapService: MapLayerService) { }

  sortByName(a: any, b: any) {
    const nameA = a.name.toLocaleUpperCase();
    const nameB = b.name.toLocaleUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }

  ngAfterViewInit(): void {
    this.mapService.getFeatureNames()
      .pipe(map(data => data.sort(this.sortByName)))
      .subscribe((x) => this.tableSource = x)
  }
}
