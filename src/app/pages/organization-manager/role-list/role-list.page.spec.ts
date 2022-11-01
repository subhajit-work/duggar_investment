import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleListPage } from './role-list.page';

describe('RoleListPage', () => {
  let component: RoleListPage;
  let fixture: ComponentFixture<RoleListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
