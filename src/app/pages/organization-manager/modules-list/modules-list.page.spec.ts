import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesListPage } from './modules-list.page';

describe('ModulesListPage', () => {
  let component: ModulesListPage;
  let fixture: ComponentFixture<ModulesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
