import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterestModalPage } from './add-interest-modal.page';

describe('AddInterestModalPage', () => {
  let component: AddInterestModalPage;
  let fixture: ComponentFixture<AddInterestModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterestModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
