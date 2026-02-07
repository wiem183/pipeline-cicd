import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftDeTestComponent } from './soft-de-test.component';

describe('SoftDeTestComponent', () => {
  let component: SoftDeTestComponent;
  let fixture: ComponentFixture<SoftDeTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoftDeTestComponent]
    });
    fixture = TestBed.createComponent(SoftDeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
