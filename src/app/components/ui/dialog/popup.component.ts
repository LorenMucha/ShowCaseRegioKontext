import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { Indicator } from 'src/app/model/indicators/indicator.data';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom'

export interface IndicatorDialogData {
  feature: Feature<Geometry>
  indicator: Indicator
}

@Component({
  standalone: true,
  selector: 'indicator-dialog',
  templateUrl: './popup.component.html',
  imports: [CommonModule, LineChartComponent]
})
export class IndicatorDialogComponent {
  isVisible = false
  dialogData: IndicatorDialogData | undefined

  openDialog(data: IndicatorDialogData) {
    this.dialogData = data
    this.isVisible = true
  }
  toggleDialog() {
    this.isVisible = !this.isVisible
  }
}
