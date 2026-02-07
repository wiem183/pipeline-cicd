import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBudgetComponent } from './dashboard-budget.component';

describe('DashboardBudgetComponent', () => {
  let component: DashboardBudgetComponent;
  let fixture: ComponentFixture<DashboardBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardBudgetComponent]
    });
    fixture = TestBed.createComponent(DashboardBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
