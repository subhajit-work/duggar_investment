import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesListPage } from './states-list.page';

describe('StatesListPage', () => {
  let component: StatesListPage;
  let fixture: ComponentFixture<StatesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
