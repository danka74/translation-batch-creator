import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSettingsComponent } from './batch-settings.component';

describe('BatchSettingsComponent', () => {
  let component: BatchSettingsComponent;
  let fixture: ComponentFixture<BatchSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSettingsComponent ]
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
