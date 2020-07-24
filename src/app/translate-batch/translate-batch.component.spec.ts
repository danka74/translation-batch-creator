import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateBatchComponent } from './translate-batch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('TranslateBatchComponent', () => {
  let component: TranslateBatchComponent;
  let fixture: ComponentFixture<TranslateBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, FormsModule,
      ],
      declarations: [ TranslateBatchComponent ]
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
