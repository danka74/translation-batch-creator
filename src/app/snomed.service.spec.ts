import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, UntypedFormBuilder } from '@angular/forms';


import { SnomedService, createRegExp } from './snomed.service';

describe('SnomedService', () => {
  let service: SnomedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule, FormsModule,
      ],
      providers: [
        SnomedService, UntypedFormBuilder
      ]
    });
    service = TestBed.inject(SnomedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createRegExp should give expected results', () => {
    expect(createRegExp('/hej/gi').test('HEJ'))
    .toBeTruthy();
  });

  it('should give expected results', () => {
    expect(service.findDescriptions({
      criteria: [
        {
          present: true,
          lang: 'en',
          regexp: 'Administration of',
          type: '',
          accept: '',
        },
        {
          present: true,
          lang: 'sv',
          regexp: 'administrering av vaccin',
          type: '',
          accept: '',
        },
        {
          present: false,
          lang: 'sv',
          regexp: 'vaccination',
          type: '',
          accept: '',
        }
      ],
      term: 'administration',
      ecl: '<33879002 | Administration of vaccine to produce active immunity (procedure) |'
    })).toBeDefined();
  });
});
