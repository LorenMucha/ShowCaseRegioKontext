import VectorLayer from "ol/layer/Vector"
import { Indicator } from "../services/map.layer.service"

export interface MapLayer {
    id: number
    layer: VectorLayer<any>
    name: string
    indicator: Indicator
}

export class MapLayer implements MapLayer {
    constructor(id?: number, layer?: VectorLayer<any>, name?: string, indicator?:Indicator) {
        this.id = id!
        this.layer = layer!
        this.name = name!
        this.indicator = indicator!
    }

    addLayer(layer: VectorLayer<any>) {
        this.layer = layer
    }
}