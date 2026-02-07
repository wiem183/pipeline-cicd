import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuoiTesterComponent } from './dashboard-quoi-tester.component';

describe('DashboardQuoiTesterComponent', () => {
  let component: DashboardQuoiTesterComponent;
  let fixture: ComponentFixture<DashboardQuoiTesterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardQuoiTesterComponent]
    });
    fixture = TestBed.createComponent(DashboardQuoiTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
