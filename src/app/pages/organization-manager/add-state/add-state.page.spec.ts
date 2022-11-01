import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatePage } from './add-state.page';

describe('AddStatePage', () => {
  let component: AddStatePage;
  let fixture: ComponentFixture<AddStatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
