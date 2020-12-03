import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { BatchSettingsComponent } from './batch-settings.component';

describe('BatchSettingsComponent', () => {
  let component: BatchSettingsComponent;
  let fixture: ComponentFixture<BatchSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSettingsComponent ],
      providers: [ FormBuilder ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
