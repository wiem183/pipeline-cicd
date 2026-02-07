import { TestBed } from '@angular/core/testing';

import { QuoiTesterService } from './quoi-tester.service';

describe('QuoiTesterService', () => {
  let service: QuoiTesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoiTesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
