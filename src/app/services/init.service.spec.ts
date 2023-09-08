import { TestBed } from '@angular/core/testing';

import { InitService } from './init.service';

describe('InitServiceService', () => {
  let service: InitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
