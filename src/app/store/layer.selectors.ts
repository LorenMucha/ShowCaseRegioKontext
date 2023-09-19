import {
    ActionReducerMap,
    createFeatureSelector,
    createSelector
} from '@ngrx/store';
import { ReducerLayerState, layerReducer } from './layer.reducer';

export const featureStateName = 'layerFeature';

export interface LayerState {
    layer: ReducerLayerState;
}

export const todoReducers: ActionReducerMap<LayerState> = {
    layer: layerReducer
};

export const getLayerFeatureState = createFeatureSelector<LayerState>(
    featureStateName
);

export const getLayerBrb = createSelector(
    getLayerFeatureState,
    (state: LayerState) => {
        console.log(state)
       return state.layer.items.filter(x => x.id = 2)
    }
);

export const getLayerBerlin = createSelector(
    getLayerFeatureState,
    (state: LayerState) => state.layer.items.filter(x => x.id = 1)
);