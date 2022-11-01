import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrencyPage } from './add-currency.page';

describe('AddCurrencyPage', () => {
  let component: AddCurrencyPage;
  let fixture: ComponentFixture<AddCurrencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCurrencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
