import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsListPage } from './locations-list.page';

describe('LocationsListPage', () => {
  let component: LocationsListPage;
  let fixture: ComponentFixture<LocationsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
