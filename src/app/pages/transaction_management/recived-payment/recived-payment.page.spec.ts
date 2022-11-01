import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecivedPaymentPage } from './recived-payment.page';

describe('RecivedPaymentPage', () => {
  let component: RecivedPaymentPage;
  let fixture: ComponentFixture<RecivedPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecivedPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecivedPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
