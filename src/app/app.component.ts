import { Component, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MapComponent } from './components/map/map.component';
import { MENU } from './constants';
import { Bounds } from './model/bounds';
import { Indicator } from './model/indicators/indicator.data';
import { TableElem } from './model/table-elem';
import { TabElem } from './model/tabs-elem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tabList: Array<TabElem> = Array.from(MENU.keys())
  selectedTab: TabElem = this.tabList[0]
  indicatorList: Array<Indicator> = MENU.get(this.selectedTab)!
  selectedIndicator: Indicator = this.indicatorList[0]
  objectKeys = Object.keys;
  checked_b: boolean = true;
  checked_brb: boolean = false;
  disabled: any;
  berlin = Bounds.Berlin
  brb = Bounds.Brandenburg
  @ViewChild(MapComponent) map: MapComponent | undefined;

  changeTab(tab: TabElem) {
    this.selectedTab = tab
    this.indicatorList = MENU.get(tab)!
  }

  changeBoundCheckbox(checkbox: MatCheckboxChange, bounds: Bounds): void {
    if (checkbox.checked) {
      this.map?.addMapLayer(bounds, 2021)
    } else {
      this.map?.removeMapLayer(bounds)
    }
  }

  selectIndicator(indicator: Indicator) {
    this.selectedIndicator = indicator
    this.map?.addMapLayer(Bounds.Berlin, undefined, indicator)
  }

  changeTimeslider(year: number): void {
    this.map?.addMapLayer(undefined, year)
  }

  highlightMapLayer(elem: TableElem): void {
    this.map?.selectFeatureByTableElem(elem)
  }
  resetHighlightMapLayer(elem: TableElem): void {
    this.map?.resetHighlightByTableElem(elem)
  }
}
