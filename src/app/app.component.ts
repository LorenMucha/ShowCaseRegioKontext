import { Component, OnInit } from '@angular/core';
import { MapLayer } from './model/map-layer';
import TileLayer from 'ol/layer/Tile';
import { Gemeinde } from './model/gemeinde';
import { TabElem } from './model/tabs-elem';
import { InitService } from './services/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private initService: InitService) {}

  tabList: Array<TabElem> = [
    {
      title: "Wohnungsnachfrage",
      active: true,
      layer: this.initService.createLayer(["Außenwanderungssaldo", "1. Indikator", "2. Indikator"])
    },
    {
      title: "Wohnungsangebot ",
      active: false,
      layer: this.initService.createLayer(["Baufertigstellungen", "1. Indikator", "2. Indikator"])
    },
    {
      title: "Marktdaten ",
      active: false,
      layer: this.initService.createLayer(["Angebotsmieten", "1. Indikator", "2. Indikator"])
    }]
  tableSource: Array<Gemeinde> = [
    { name: "Berlin", value: 500 },
    { name: "Potsdam", value: 300 }
  ]
  selectedTab: TabElem = this.tabList[0]
  displayedColumns: string[] = ['name', 'value'];
  selectedLayer: TileLayer<any> = this.tabList[0].layer[0].layer;

  objectKeys = Object.keys;
  checked: any;
  disabled: any;
  ngOnInit(): void {
    console.log(this.tabList)
  }
  changeTab(tab: TabElem) {
    this.selectedTab = tab
    console.log(tab)
  }
  changeLayer(layer: MapLayer) {
    this.selectedLayer = layer.layer
  }
}
