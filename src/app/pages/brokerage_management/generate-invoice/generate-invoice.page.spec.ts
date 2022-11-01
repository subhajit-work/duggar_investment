import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInvoicePage } from './generate-invoice.page';

describe('GenerateInvoicePage', () => {
  let component: GenerateInvoicePage;
  let fixture: ComponentFixture<GenerateInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateInvoicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
