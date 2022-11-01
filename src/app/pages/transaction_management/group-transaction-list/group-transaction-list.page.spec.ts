import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTransactionListPage } from './group-transaction-list.page';

describe('GroupTransactionListPage', () => {
  let component: GroupTransactionListPage;
  let fixture: ComponentFixture<GroupTransactionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTransactionListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTransactionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
