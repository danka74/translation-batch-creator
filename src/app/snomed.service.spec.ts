import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';


import { SnomedService } from './snomed.service';

describe('SnomedService', () => {
  let service: SnomedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule, FormsModule,
      ],
      providers: [
        SnomedService, FormBuilder
      ]
    });
    service = TestBed.inject(SnomedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should give expected results', () => {
    expect(service.findDescriptions({
      name: 'asthma',
      ecl: '<<195967001',
      enTerm: 'asthma',
      enExp: 'asthma',
      svExp: 'astma',
      svExps: [],
    })).toBeDefined();
  });
});
