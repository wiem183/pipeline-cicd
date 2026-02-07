import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceManagerComponent } from './finance-manager.component';

describe('FinanceManagerComponent', () => {
  let component: FinanceManagerComponent;
  let fixture: ComponentFixture<FinanceManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceManagerComponent]
    });
    fixture = TestBed.createComponent(FinanceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
