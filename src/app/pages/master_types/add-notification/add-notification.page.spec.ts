import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationPage } from './add-notification.page';

describe('AddNotificationPage', () => {
  let component: AddNotificationPage;
  let fixture: ComponentFixture<AddNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
