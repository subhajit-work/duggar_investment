import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompnayListPage } from './compnay-list.page';

describe('CompnayListPage', () => {
  let component: CompnayListPage;
  let fixture: ComponentFixture<CompnayListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompnayListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompnayListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
