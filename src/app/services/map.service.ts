import { Injectable } from '@angular/core'
import GML3 from 'ol/format/GML3'
import WFS from 'ol/format/WFS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js'



@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor() { }

  //TODO: simplify
  getLayerBerlin() {
    const vectorSource: VectorSource = new VectorSource({
      format: new WFS({ version: '2.0.0', gmlFormat: new GML3() }),
      url: function (extent) {
        return (
          'https://isk.geobasis-bb.de/ows/vg_historisch_wfs?service=WFS&' +
          `version=2.0.0&request=GetFeature&typename=app:bz_2023&` +
          'outputFormat=GML3&srsname=EPSG:3857&' +
          'bbox=' +
          extent.join(',') +
          ',EPSG:3857'
        )
      },
      strategy: bboxStrategy,
    })

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: `rgba(124,252,0, 0.5)`
        }),
        stroke: new Stroke({
          color: 'black'
        })
      })
    })

    return vector
  }

  getLayerBrB() {
    const vectorSource: VectorSource = new VectorSource({
      format: new WFS({ version: '2.0.0', gmlFormat: new GML3() }),
      url: function (extent) {
        return (
          'https://isk.geobasis-bb.de/ows/vg_historisch_wfs?service=WFS&' +
          `version=2.0.0&request=GetFeature&typename=app:ge_2022&` +
          'outputFormat=GML3&srsname=EPSG:3857&' +
          'bbox=' +
          extent.join(',') +
          ',EPSG:3857'
        )
      },
      strategy: bboxStrategy,
    })

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: `rgba(0, 255, 0, 0.3)`
        }),
        stroke: new Stroke({
          color: 'orange'
        })
      })
    })
    return vector
  }
}
