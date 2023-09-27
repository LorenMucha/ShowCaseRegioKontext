import VectorLayer from "ol/layer/Vector"
import { Indicator } from "./indicators/indicator"
import { Bounds } from "./bounds"

export interface MapLayer {
    id: number
    layer: VectorLayer<any>
    name: string
    indicator: Indicator
}

export class MapLayer implements MapLayer {
    min: number
    max: number
    bounds: Bounds
    constructor(id?: number, layer?: VectorLayer<any>, name?: string, indicator?: Indicator, min?: number, max?: number, bounds?: Bounds) {
        this.id = id!
        this.layer = layer!
        this.name = name!
        this.indicator = indicator!
        this.min = min!
        this.max = max!
        this.bounds = bounds!
    }

    setBounds(bounds: Bounds){
        this.bounds = bounds
    }

    setLayer(layer: VectorLayer<any>) {
        this.layer = layer
    }
    setMin(min: number) {
        this.min = min
    }
    setMax(max: number) {
        this.max = max
    }
}