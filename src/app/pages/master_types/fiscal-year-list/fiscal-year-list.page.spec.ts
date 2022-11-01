import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearListPage } from './fiscal-year-list.page';

describe('FiscalYearListPage', () => {
  let component: FiscalYearListPage;
  let fixture: ComponentFixture<FiscalYearListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalYearListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
