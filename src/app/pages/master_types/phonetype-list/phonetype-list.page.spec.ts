import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonetypeListPage } from './phonetype-list.page';

describe('PhonetypeListPage', () => {
  let component: PhonetypeListPage;
  let fixture: ComponentFixture<PhonetypeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonetypeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonetypeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
