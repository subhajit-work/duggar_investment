import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTdsPage } from './add-tds.page';

describe('AddTdsPage', () => {
  let component: AddTdsPage;
  let fixture: ComponentFixture<AddTdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
