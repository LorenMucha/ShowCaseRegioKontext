import { Component } from '@angular/core';
import { TabElem } from './model/tabs-elem';

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
  checked: any;
  disabled: any;
  changeTab(tab: TabElem) {
    this.selectedTab = tab
  }
}
