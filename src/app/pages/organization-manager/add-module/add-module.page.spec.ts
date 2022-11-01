import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModulePage } from './add-module.page';

describe('AddModulePage', () => {
  let component: AddModulePage;
  let fixture: ComponentFixture<AddModulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
