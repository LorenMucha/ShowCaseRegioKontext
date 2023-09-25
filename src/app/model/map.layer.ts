import VectorLayer from "ol/layer/Vector"
import { Indicator } from "../services/map.layer.service"

export interface MapLayer {
    id: number
    layer: VectorLayer<any>
    name: string
    indicator: Indicator
}

export class MapLayer implements MapLayer {
    min: number
    max: number
    constructor(id?: number, layer?: VectorLayer<any>, name?: string, indicator?:Indicator, min?: number, max?: number) {
        this.id = id!
        this.layer = layer!
        this.name = name!
        this.indicator = indicator!
        this.min = min!
        this.max = max!
    }

    setLayer(layer: VectorLayer<any>) {
        this.layer = layer
    }
    setMin(min:number){
        this.min = min
    }
    setMax(max: number){
        this.max = max
    }
}