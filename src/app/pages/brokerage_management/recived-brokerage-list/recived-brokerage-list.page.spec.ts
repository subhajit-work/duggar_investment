import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecivedBrokerageListPage } from './recived-brokerage-list.page';

describe('RecivedBrokerageListPage', () => {
  let component: RecivedBrokerageListPage;
  let fixture: ComponentFixture<RecivedBrokerageListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecivedBrokerageListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecivedBrokerageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
