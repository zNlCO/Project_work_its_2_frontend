import { TestBed } from '@angular/core/testing';

import { BikeModelService } from './bike-model.service';

describe('BikeModelService', () => {
  let service: BikeModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikeModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
