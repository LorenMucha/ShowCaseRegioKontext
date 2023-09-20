import { TestBed } from '@angular/core/testing';

import { MapLayerService } from './MapLayerService';

describe('MapLayerService', () => {
  let service: MapLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('extract feature names from the maplayer'), () => {
    var features = service.getFeatureNames()
    expect(features).not.toBeNull
  }
});
