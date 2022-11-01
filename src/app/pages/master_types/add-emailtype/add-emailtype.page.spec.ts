import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailtypePage } from './add-emailtype.page';

describe('AddEmailtypePage', () => {
  let component: AddEmailtypePage;
  let fixture: ComponentFixture<AddEmailtypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmailtypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailtypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
