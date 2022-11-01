import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReciveBrokeragePage } from './add-recive-brokerage.page';

describe('AddReciveBrokeragePage', () => {
  let component: AddReciveBrokeragePage;
  let fixture: ComponentFixture<AddReciveBrokeragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReciveBrokeragePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReciveBrokeragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
