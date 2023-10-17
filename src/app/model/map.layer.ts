import VectorLayer from "ol/layer/Vector"
import { Bounds } from "./bounds"
import { IndicatorImpl } from "./indicators/indicator.data"
import { ColorRange } from "@heyeso/color-range"

export interface MapLayer {
    id: number
    layer: VectorLayer<any>
    name: string
    indicator: IndicatorImpl
}

export class MapLayer implements MapLayer {
    min: number
    max: number
    bounds: Bounds
    colorMap: ColorRange
    //FIXME: refactor to Builder
    constructor(id?: number, layer?: VectorLayer<any>, name?: string, indicator?: IndicatorImpl, min?: number, max?: number, bounds?: Bounds, colorMap?: ColorRange) {
        this.id = id!
        this.layer = layer!
        this.name = name!
        this.indicator = indicator!
        this.min = min!
        this.max = max!
        this.bounds = bounds!
        this.colorMap = colorMap!
    }

    setColorMap(map: ColorRange) {
        this.colorMap = map
    }

    setBounds(bounds: Bounds) {
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