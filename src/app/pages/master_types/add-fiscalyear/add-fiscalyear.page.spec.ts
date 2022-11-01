import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFiscalyearPage } from './add-fiscalyear.page';

describe('AddFiscalyearPage', () => {
  let component: AddFiscalyearPage;
  let fixture: ComponentFixture<AddFiscalyearPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFiscalyearPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFiscalyearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
