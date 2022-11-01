import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBrokerageListPage } from './rejected-brokerage-list.page';

describe('RejectedBrokerageListPage', () => {
  let component: RejectedBrokerageListPage;
  let fixture: ComponentFixture<RejectedBrokerageListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedBrokerageListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedBrokerageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
