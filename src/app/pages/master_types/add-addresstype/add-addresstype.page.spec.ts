import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddresstypePage } from './add-addresstype.page';

describe('AddAddresstypePage', () => {
  let component: AddAddresstypePage;
  let fixture: ComponentFixture<AddAddresstypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddresstypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddresstypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
