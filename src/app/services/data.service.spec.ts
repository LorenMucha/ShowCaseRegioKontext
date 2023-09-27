import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('MapLayerService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('extract feature names from the maplayer'), () => {
    var features = service.getMapLayerForBounds()
    expect(features).not.toBeNull
  }
});
