import { Component, ViewChild } from '@angular/core';
import { TabElem } from './model/tabs-elem';
import { MapComponent } from './components/map/map.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Bounds } from './model/bounds';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  tabList: Array<TabElem> = [
    {
      title: "Wohnungsnachfrage",
      active: true,
    },
    {
      title: "Wohnungsangebot ",
      active: false,
    },
    {
      title: "Marktdaten ",
      active: false,
    }]
  selectedTab: TabElem = this.tabList[0]
  objectKeys = Object.keys;
  checked_b: boolean = true;
  checked_brb: boolean = false;
  disabled: any;
  berlin = Bounds.Berlin
  brb = Bounds.Brandenburg
  @ViewChild(MapComponent) map: MapComponent | undefined;

  changeTab(tab: TabElem) {
    this.selectedTab = tab
  }

  changeBoundCheckbox(checkbox: MatCheckboxChange, bounds: Bounds) {
    if (checkbox.checked) {
      this.map?.addMapLayer(bounds, 2021)
    } else {
      this.map?.removeMapLayer(bounds)
    }
  }

  changeTimeslider(year: number) {
    this.map?.addMapLayer(undefined, year)
  }
  highlightMapLayer(name: string) {
    this.map?.selectFeatureByName(name)
  }
  resetHighlightMapLayer(name: string) {
    this.map?.resetHighlightByName(name)
  }
}
