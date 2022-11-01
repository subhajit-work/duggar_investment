import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstListPage } from './gst-list.page';

describe('GstListPage', () => {
  let component: GstListPage;
  let fixture: ComponentFixture<GstListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
