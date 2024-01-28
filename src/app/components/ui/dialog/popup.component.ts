import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';

export interface IndicatorDialogData {
  title: string
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
