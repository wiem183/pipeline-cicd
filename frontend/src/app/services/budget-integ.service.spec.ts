import { TestBed } from '@angular/core/testing';

import { BudgetIntegService } from './budget-integ.service';

describe('BudgetIntegService', () => {
  let service: BudgetIntegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetIntegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
