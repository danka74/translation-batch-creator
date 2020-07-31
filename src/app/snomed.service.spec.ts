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
      criteria: [
        {
          present: true,
          lang: 'en',
          regexp: 'Administration of'
        },
        {
          present: true,
          lang: 'sv',
          regexp: 'administrering av vaccin'
        },
        {
          present: false,
          lang: 'sv',
          regexp: 'vaccination'
        }
      ],
      term: 'administration',
      ecl: '<33879002 | Administration of vaccine to produce active immunity (procedure) |'
    })).toBeDefined();
  });
});
