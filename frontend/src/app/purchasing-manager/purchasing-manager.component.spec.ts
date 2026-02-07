import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingManagerComponent } from './purchasing-manager.component';

describe('PurchasingManagerComponent', () => {
  let component: PurchasingManagerComponent;
  let fixture: ComponentFixture<PurchasingManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasingManagerComponent]
    });
    fixture = TestBed.createComponent(PurchasingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
