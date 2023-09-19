import { MapLayer } from "../model/map.layer";
import * as layerActions from './layer.actions'
import { createReducer, on, Action } from '@ngrx/store';


export interface ReducerLayerState {
    items: MapLayer[];
    selectedItem: MapLayer;
    loading: boolean;
}

export const initialState: ReducerLayerState = {
    items: [],
    selectedItem: null,
    loading: false
};

const layerReducerInternal = createReducer(
    initialState,
    on(
        layerActions.addMapLayer,
        layerActions.loadAllMapLayer,
        layerActions.loadSingleMapLayer,
        layerActions.deleteMapLayer,

        state => ({
            ...state,
            loading: true
        })
    ),
    on(layerActions.addMapLayerFinished, (state, { payload }) => ({
        ...state,
        loading: false,
        items: [...state.items, payload]
    })),
    on(layerActions.loadAllMapLayerFinished, (state, { payload }) => ({
        ...state,
        loading: false,
        items: [...payload]
    })),
);

export function layerReducer(
    state: ReducerLayerState | undefined,
    action: Action
) {
    return layerReducerInternal(state, action);
}