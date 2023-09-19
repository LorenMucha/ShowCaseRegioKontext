import VectorLayer from "ol/layer/Vector"

export interface MapLayer {
    id: number
    layer: VectorLayer<any>
    name: string
}

export class MapLayer implements MapLayer {
    constructor(id?: number, layer?: VectorLayer<any>, name?: string) {
        this.id = id!
        this.layer = layer!
        this.name = name!
    }
}