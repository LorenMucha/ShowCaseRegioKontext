import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat, toLonLat } from 'ol/proj.js'
import Select from 'ol/interaction/Select'
import OSM from 'ol/source/OSM';
import { Bounds, Indicator, MapLayerService } from 'src/app/services/map.layer.service'
import Overlay from 'ol/Overlay'
import { Extent, getCenter } from 'ol/extent'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import { Feature } from 'ol'


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
  private map: OlMap = new OlMap
  private baseMap: TileLayer<any> = new TileLayer({
    className: 'bw',
    source: new OSM(),
  })

  private currentLayer: TileLayer<any> | undefined
  showPopUp: boolean = false
  popUpContent: string = ''

  constructor(private mapService: MapLayerService) { }

  ngOnInit(): void {

    this.map = new OlMap({
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [this.baseMap],
      target: 'ol-map'
    })

    this.mapService.getMapLayerForBounds(Indicator.ZuUndFortzuege, Bounds.Berlin, 2021).subscribe((x) => {
      this.map.addLayer(x.layer)
    })
    this.map.addInteraction(this.select);
  }

  ngAfterViewInit(): void {
    this.select.on('select', (e) => {
      const feature = e.selected[0] as Feature

      console.log(e.selected[0].getStyle())
      feature.setStyle(new Style({
        // fill: new Fill({
        // }),
        stroke: new Stroke({ color: 'black', width: 10 })
      }))
      const popup = new Overlay({ element: document.getElementById('popup')! })
      const extent = getCenter(feature.getGeometry()?.getExtent() as Extent)
      this.popUpContent = `<div><b>name:</b> ${feature.get('name')}</div><div><b>value:</b> ${feature.get('value')}</div>`
      popup.setPosition(extent)
      this.map.addOverlay(popup)
      this.showPopUp = true
    })
  }

  closePopUp() {
    this.select.getFeatures().clear()
    this.showPopUp = false
  }
}
