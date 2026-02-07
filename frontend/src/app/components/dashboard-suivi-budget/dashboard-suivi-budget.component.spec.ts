import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSuiviBudgetComponent } from './dashboard-suivi-budget.component';

describe('DashboardSuiviBudgetComponent', () => {
  let component: DashboardSuiviBudgetComponent;
  let fixture: ComponentFixture<DashboardSuiviBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardSuiviBudgetComponent]
    });
    fixture = TestBed.createComponent(DashboardSuiviBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
