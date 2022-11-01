import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GracedayListPage } from './graceday-list.page';

describe('GracedayListPage', () => {
  let component: GracedayListPage;
  let fixture: ComponentFixture<GracedayListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GracedayListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GracedayListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
