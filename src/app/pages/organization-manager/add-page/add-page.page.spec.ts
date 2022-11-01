import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagePage } from './add-page.page';

describe('AddPagePage', () => {
  let component: AddPagePage;
  let fixture: ComponentFixture<AddPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
