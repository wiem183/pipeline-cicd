import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagerComponent } from './sales-manager.component';

describe('SalesManagerComponent', () => {
  let component: SalesManagerComponent;
  let fixture: ComponentFixture<SalesManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesManagerComponent]
    });
    fixture = TestBed.createComponent(SalesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
