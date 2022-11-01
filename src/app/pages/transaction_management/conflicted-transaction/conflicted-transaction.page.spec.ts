import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictedTransactionPage } from './conflicted-transaction.page';

describe('ConflictedTransactionPage', () => {
  let component: ConflictedTransactionPage;
  let fixture: ComponentFixture<ConflictedTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConflictedTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictedTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
