import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj.js'
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
import { Indicator } from 'src/app/model/indicators/indicator.data'
import { TableElem } from 'src/app/model/table-elem'
import { Geometry } from 'ol/geom'
import { OverviewMap, defaults as defaultControls } from 'ol/control.js'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import FullScreen from 'ol/control/FullScreen.js';
import { LegendeComponent } from "../legende/legende.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonModule } from '@angular/common'
import { IndicatorDialogComponent, IndicatorDialogData } from '../ui/dialog/popup.component'


const berlinLonLat = [13.404954, 52.520008]
const mapCenter = fromLonLat(berlinLonLat)

const overviewMapControl = new OverviewMap({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

@Component({
  standalone: true,
  styleUrls: ['./map.component.css'],
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [LegendeComponent, FontAwesomeModule, CommonModule, IndicatorDialogComponent]
})
export class MapComponent implements OnInit, AfterViewInit {
  private select = new Select();
  //FIXME: auf indicator class umschreiben
  @Input({ required: true }) selectedIndicator!: Indicator
  @ViewChild(IndicatorDialogComponent) popUp: IndicatorDialogComponent | undefined;
  private selectedLayer: Map<Bounds, MapLayer> = new Map<Bounds, MapLayer>()
  private selectedYear: number = 2021
  private selectedBounds: Bounds = Bounds.Berlin
  private map: OlMap = new OlMap
  private baseMap: TileLayer<any> = new TileLayer({
    className: 'bw',
    source: new OSM(),
  })
  popUpIsVisible: boolean = false
  popUpContent: string = ''
  faChartLine = faChartLine
  showIndicatorDialog = false

  constructor(private mapService: DataService) { }

  ngOnInit(): void {
    this.map = new OlMap({
      controls: defaultControls().extend([overviewMapControl, new FullScreen]),
      view: new View({
        center: mapCenter,
        zoom: 10,
      }),
      layers: [this.baseMap],
      target: 'ol-map',
    })

    this.addMapLayer(this.selectedBounds, this.selectedYear)
    this.map.addInteraction(this.select);
  }

  ngAfterViewInit(): void {
    this.select.on('select', (e) => {
      this.showPopUp(e.selected[0])
    })
  }

  addMapLayer(bounds?: Bounds, year?: number, indicator?: Indicator): void {
    this.selectedBounds = bounds ?? this.selectedBounds;
    this.selectedYear = year ?? this.selectedYear;
    this.selectedIndicator = indicator ?? this.selectedIndicator

    this.mapService.getMapLayerForBounds(this.selectedIndicator, this.selectedBounds, this.selectedYear).subscribe((layer) => {
      const vector = layer.layer
      if (this.selectedLayer.has(this.selectedBounds)) {
        const tempLayer: MapLayer = this.selectedLayer.get(this.selectedBounds)!;
        this.map.removeLayer(tempLayer.layer);
      }
      this.map.addLayer(vector);
      this.selectedLayer.set(this.selectedBounds, layer);
    });
  }

  removeMapLayer(bounds: Bounds): void {
    let layer = bounds === Bounds.Berlin ? this.mapService.mapLayerBerlin : this.mapService.mapLayerBrandenburg
    this.map.removeLayer(layer?.layer!)
    this.selectedLayer.forEach((item) => {
      if (item.bounds == bounds) {
        this.selectedLayer.delete(bounds)
      }
    })
  }

  selectFeatureByTableElem(elem: TableElem): void {
    this.selectedLayer.forEach((value: MapLayer, key: Bounds) => {
      //FIXME: diese Funktion kann seperiert werden
      const vectorSource = value.layer.getSource()
      const features = vectorSource.getFeatures() as Array<Feature>
      const feature = features.filter((item) => elem.name.includes(item.get('name')))[0]
      if (feature) {
        this.highlightLayer(feature)
      }
    });
  }

  showPopUp(feature: Feature<Geometry>) {
    this.highlightLayer(feature)
    const popup = new Overlay({ element: document.getElementById('popup')! })
    const extent = getCenter(feature.getGeometry()?.getExtent() as Extent)
    this.popUpContent = `
      <div><b>Region:</b> ${feature.get('name')}</div>
      <div><b>Wert:</b> ${feature.get('value')}</div>`
    popup.setPosition(extent)
    this.map.addOverlay(popup)
    this.popUpIsVisible = true
  }

  closePopUp() {
    this.select.getFeatures().clear()
    this.popUpIsVisible = false
  }

  resetHighlightByTableElem(elem: TableElem) {
    this.selectedLayer.forEach((value: MapLayer, key: Bounds) => {
      //FIXME: diese Funktion kann seperiert werden
      const vectorSource = value.layer.getSource()
      const features = vectorSource.getFeatures() as Array<Feature>
      const feature = features.filter((item) => elem.name.includes(item.get('name')))[0]
      if (feature) {
        try {
          feature.setStyle(new Style({
            fill: feature.get('style').getFill(),
            stroke: new Stroke({ color: 'black' })
          }))
        } catch (ignored) { }
      }
    });
  }

  private highlightLayer(feature: Feature<Geometry>): void {
    try {
      feature.setStyle(new Style({
        fill: feature.get('style').getFill(),
        stroke: new Stroke({ color: 'black', width: 10 })
      }))
    } catch (ignored) { }
  }

  openIndicatorDialog() {
    const dialogData: IndicatorDialogData = {title: this.selectedIndicator.title}
    this.popUp?.openDialog(dialogData)
  }
}

