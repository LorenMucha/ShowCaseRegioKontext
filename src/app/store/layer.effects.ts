import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeAll, switchMap, tap } from 'rxjs/operators';
import * as layerActions from './layer.actions';
import { MapLayerService } from '../services/map.layer.service';

@Injectable()
export class MapLayerEffects {
    constructor(private actions$: Actions, private mapLayerService: MapLayerService) { }

    //FIXME: https://github.com/FabianGosebrink/angular-ngrx-todo
    loadLayers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(layerActions.loadAllMapLayer),
            tap(() => console.log('load all layer')),
            switchMap(() =>
                this.mapLayerService.getMapLayers()
                    .pipe(
                        map(layers => layerActions.loadAllMapLayerFinished({ payload: layers })),
                        catchError(error => of(error))
                    )
            )
        )
    );

    // loadSingleLayers$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(layerActions.loadSingleMapLayer),
    //         map(action => action.payload),
    //         switchMap(payload =>
    //             this.mapLayerService.getLayer(payload)
    //                 .pipe(
    //                     map(layer => layerActions.loadSingleMapLayerFinished({ payload: layer })),
    //                     catchError(error => of(error))
    //                 )
    //         )
    //     )
    // );
}

