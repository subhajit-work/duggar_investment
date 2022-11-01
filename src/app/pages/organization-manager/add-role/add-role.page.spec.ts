import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRolePage } from './add-role.page';

describe('AddRolePage', () => {
  let component: AddRolePage;
  let fixture: ComponentFixture<AddRolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRolePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
