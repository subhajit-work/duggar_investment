import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresstypeListPage } from './addresstype-list.page';

describe('AddresstypeListPage', () => {
  let component: AddresstypeListPage;
  let fixture: ComponentFixture<AddresstypeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresstypeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresstypeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
