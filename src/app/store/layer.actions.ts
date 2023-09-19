import { createAction, props } from '@ngrx/store';
import { MapLayer } from '../model/map.layer';

export const loadAllMapLayer = createAction('[MapLayer] Load MapLayer');

export const loadAllMapLayerFinished = createAction(
    '[MapLayer] Load MapLayer',
    props<{ payload: MapLayer[] }>()
);

export const loadSingleMapLayer = createAction(
    '[MapLayer] Load Single MapLayer Finished',
    props<{ payload: number }>()
);
export const loadSingleMapLayerFinished = createAction(
    '[MapLayer] Load Single MapLayer Finished',
    props<{ payload: MapLayer }>()
);
export const addMapLayer = createAction(
    '[MapLayer] Add MapLayer Finished',
    props<{ payload: number }>()
);

export const addMapLayerFinished = createAction(
    '[Todo] Add Todo Finished',
    props<{ payload: MapLayer }>()
);


export const deleteMapLayer = createAction(
    '[MapLayer] DeleteMapLayer',
    props<{ payload: number }>()
);