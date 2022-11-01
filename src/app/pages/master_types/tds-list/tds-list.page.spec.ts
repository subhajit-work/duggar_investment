import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsListPage } from './tds-list.page';

describe('TdsListPage', () => {
  let component: TdsListPage;
  let fixture: ComponentFixture<TdsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
