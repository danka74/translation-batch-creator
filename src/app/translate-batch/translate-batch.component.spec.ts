import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateBatchComponent } from './translate-batch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SnomedService } from '../snomed.service';

describe('TranslateBatchComponent', () => {
  let component: TranslateBatchComponent;
  let fixture: ComponentFixture<TranslateBatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, FormsModule, HttpClientModule
      ],
      declarations: [ TranslateBatchComponent ],
      providers: [ SnomedService, HttpClient ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
