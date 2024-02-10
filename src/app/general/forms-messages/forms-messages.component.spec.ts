import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsMessagesComponent } from './forms-messages.component';

describe('FormsMessagesComponent', () => {
  let component: FormsMessagesComponent;
  let fixture: ComponentFixture<FormsMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
