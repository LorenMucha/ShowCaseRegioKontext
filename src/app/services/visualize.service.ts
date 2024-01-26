import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MapLayer } from '../model/map.layer';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import VectorLayer from 'ol/layer/Vector';
import { RANGES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VisualizeService {

  public styleMapLayer(layer: Observable<MapLayer>): Observable<MapLayer> {
    return layer.pipe(
      map((item) => {
        const vector = new VectorSource()
        const source = item.layer.getSource()
        const features = source.getFeatures() as Array<Feature>
        const temperatureMap = item.colorMap
        features.forEach((layer) => {
          const value = layer.get('value')
          const color = temperatureMap.getColor(value)
          const style = new Style({
            fill: new Fill({
              color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b},  0.5)`
            }),
            stroke: new Stroke({
              color: 'black'
            })
          })
          layer.setStyle(style)
          layer.set('style', style)
          vector.addFeature(layer)
        })
        item.setColorMap(temperatureMap)
        item.setLayer(new VectorLayer({ source: vector }))
        return item
      })
    )
  }

  public buildRanges(numbers: Array<number>): Array<number> {
    const min = Math.min.apply(null, numbers);
    const max = Math.max.apply(null, numbers);
    const spread = max - min;
    const step = spread / RANGES;
    const ranges = [];

    for (let i = 0; i < RANGES; i++) {
      for (let n = 0; n < numbers.length - 1; n++) {
        if (numbers[n] >= step * i + min && numbers[n] < step * (i + 1) + min) {
          if (!ranges[i]) ranges[i] = 0;
          ranges[i]++;
        }
      }
    }

    return ranges;
  }
}
