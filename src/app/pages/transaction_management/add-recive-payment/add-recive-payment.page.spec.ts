import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecivePaymentPage } from './add-recive-payment.page';

describe('AddRecivePaymentPage', () => {
  let component: AddRecivePaymentPage;
  let fixture: ComponentFixture<AddRecivePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecivePaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecivePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
