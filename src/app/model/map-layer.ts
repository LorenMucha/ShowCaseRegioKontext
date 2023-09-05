import TileLayer from "ol/layer/Tile";

export interface MapLayer {
    id: string;
    name: string;
    active: boolean;
    layer: TileLayer<any>;
}