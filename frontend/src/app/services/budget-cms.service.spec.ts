import { TestBed } from '@angular/core/testing';

import { BudgetCmsService } from './budget-cms.service';

describe('BudgetCmsService', () => {
  let service: BudgetCmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetCmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
