import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGracedayPage } from './add-graceday.page';

describe('AddGracedayPage', () => {
  let component: AddGracedayPage;
  let fixture: ComponentFixture<AddGracedayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGracedayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGracedayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
