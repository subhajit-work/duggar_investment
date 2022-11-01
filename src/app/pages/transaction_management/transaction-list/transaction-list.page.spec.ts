import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListPage } from './transaction-list.page';

describe('TransactionListPage', () => {
  let component: TransactionListPage;
  let fixture: ComponentFixture<TransactionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
