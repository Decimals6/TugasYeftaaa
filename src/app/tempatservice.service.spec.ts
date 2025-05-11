import { TestBed } from '@angular/core/testing';

import { TempatserviceService } from './tempatservice.service';

describe('TempatserviceService', () => {
  let service: TempatserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempatserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
