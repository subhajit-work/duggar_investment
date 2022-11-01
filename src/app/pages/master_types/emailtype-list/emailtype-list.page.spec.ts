import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtypeListPage } from './emailtype-list.page';

describe('EmailtypeListPage', () => {
  let component: EmailtypeListPage;
  let fixture: ComponentFixture<EmailtypeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtypeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtypeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
