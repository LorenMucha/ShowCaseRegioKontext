import { MapLayer } from "./map-layer";

export interface TabElem{
    title: string;
    active: boolean;
    layer: Array<MapLayer>;
}