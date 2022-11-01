import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountsPage } from './add-accounts.page';

describe('AddAccountsPage', () => {
  let component: AddAccountsPage;
  let fixture: ComponentFixture<AddAccountsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
