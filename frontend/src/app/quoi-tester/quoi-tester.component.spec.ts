import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoiTesterComponent } from './quoi-tester.component';

describe('QuoiTesterComponent', () => {
  let component: QuoiTesterComponent;
  let fixture: ComponentFixture<QuoiTesterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoiTesterComponent]
    });
    fixture = TestBed.createComponent(QuoiTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
