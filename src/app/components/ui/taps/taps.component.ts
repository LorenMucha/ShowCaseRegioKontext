import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TabElem } from 'src/app/model/tabs-elem';

@Component({
  selector: 'app-taps',
  templateUrl: './taps.component.html',
  styleUrls: ['./taps.component.css']
})
export class TapsComponent {
  @Input({ required: true }) tabList: Array<TabElem> = []
  private selectedTab: TabElem | undefined
  @Output() tabChangeEvent = new EventEmitter<TabElem>();
  changeTab(tab: TabElem) {
    this.selectedTab = tab
    this.tabList.forEach((tab) => { tab.active = false })
    this.selectedTab.active = !this.selectedTab.active
    this.tabChangeEvent.emit(this.selectedTab)
  }
}
