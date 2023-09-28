import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat, toLonLat } from 'ol/proj.js'
import Select from 'ol/interaction/Select'
import OSM from 'ol/source/OSM';
import { DataService } from 'src/app/services/data.service'
import Overlay from 'ol/Overlay'
import { Extent, getCenter } from 'ol/extent'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import { Feature } from 'ol'
import { Bounds } from 'src/app/model/bounds'
import { MapLayer } from 'src/app/model/map.layer'
import { IndicatorData } from 'src/app/model/indicators/indicator.data'
import { ZuUndFortzuege } from 'src/app/model/indicators/zu.fortzuege'


const berlinLonLat = [13.404954, 52.520008]
const mapCenter = fromLonLat(berlinLonLat)

//FIXME: dynamic heigth for map
@Component({
  styleUrls: ['./map.component.css'],
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit, AfterViewInit {
  private select = new Select();
  private selectedIndicator: IndicatorData = new ZuUndFortzuege()
  private selectedLayer: Map<Bounds, MapLayer> = new Map<Bounds, MapLayer>()
  private selectedYear: number = 2021
  private selectedBounds: Bounds = Bounds.Berlin
  private map: OlMap = new OlMap
  private baseMap: TileLayer<any> = new TileLayer({
    className: 'bw',
    source: new OSM(),
  })
  showPopUp: boolean = false
  popUpContent: string = ''

  constructor(private mapService: DataService) { }

  ngOnInit(): void {

    this.map = new OlMap({
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [this.baseMap],
      target: 'ol-map'
    })

    this.addMapLayer(this.selectedBounds, this.selectedYear)
    this.map.addInteraction(this.select);
  }

  ngAfterViewInit(): void {
    this.select.on('select', (e) => {
      const feature = e.selected[0] as Feature
      feature.setStyle(new Style({
        fill: feature.get('style').getFill(),
        stroke: new Stroke({ color: 'black', width: 10 })
      }))
      const popup = new Overlay({ element: document.getElementById('popup')! })
      const extent = getCenter(feature.getGeometry()?.getExtent() as Extent)
      this.popUpContent = `<div><b>Region:</b> ${feature.get('name')}</div><div><b>Wert:</b> ${feature.get('value')}</div>`
      popup.setPosition(extent)
      this.map.addOverlay(popup)
      this.showPopUp = true
    })
  }

  addMapLayer(bounds?: Bounds, year?: number): void {
    this.selectedBounds = bounds === undefined ? this.selectedBounds : bounds
    this.selectedYear = year === undefined ? this.selectedYear : year

    this.mapService.getMapLayerForBounds(this.selectedIndicator, this.selectedBounds, this.selectedYear).subscribe((layer) => {
      const vector = layer.layer
      if (this.selectedLayer.has(this.selectedBounds)) {
        var tempLayer: MapLayer = this.selectedLayer.get(this.selectedBounds)!
        this.map.removeLayer(tempLayer.layer)
      }
      this.map.addLayer(vector)
      this.selectedLayer.set(this.selectedBounds, layer)
    })
  }

  removeMapLayer(bounds: Bounds): void {
    var layer = bounds === Bounds.Berlin ? this.mapService.mapLayerBerlin : this.mapService.mapLayerBrandenburg
    this.map.removeLayer(layer?.layer!)
    this.selectedLayer.forEach((item) => {
      if (item.bounds == bounds) {
        this.selectedLayer.delete(bounds)
      }
    })
  }

  closePopUp() {
    this.select.getFeatures().clear()
    this.showPopUp = false
  }
}
