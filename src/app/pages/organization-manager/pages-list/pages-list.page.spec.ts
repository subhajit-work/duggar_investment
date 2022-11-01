import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesListPage } from './pages-list.page';

describe('PagesListPage', () => {
  let component: PagesListPage;
  let fixture: ComponentFixture<PagesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
