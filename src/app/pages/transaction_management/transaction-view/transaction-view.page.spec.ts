import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionViewPage } from './transaction-view.page';

describe('TransactionViewPage', () => {
  let component: TransactionViewPage;
  let fixture: ComponentFixture<TransactionViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
