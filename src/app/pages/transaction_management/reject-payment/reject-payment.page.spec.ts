import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPaymentPage } from './reject-payment.page';

describe('RejectPaymentPage', () => {
  let component: RejectPaymentPage;
  let fixture: ComponentFixture<RejectPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
