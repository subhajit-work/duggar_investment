import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringTransactionPage } from './expiring-transaction.page';

describe('ExpiringTransactionPage', () => {
  let component: ExpiringTransactionPage;
  let fixture: ComponentFixture<ExpiringTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiringTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
