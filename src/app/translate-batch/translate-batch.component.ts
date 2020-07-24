import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SnomedService } from '../snomed.service';

@Component({
  selector: 'app-translate-batch',
  templateUrl: './translate-batch.component.html',
  styleUrls: ['./translate-batch.component.css']
})
export class TranslateBatchComponent implements OnInit {

  descriptions: any[] = [];

  batchForm = this.fb.group({
    name: ['', Validators.required],
    ecl: [''],
    enTerm: [''],
    enExp: [''],
    svExp: ['', Validators.required],
    svExps: this.fb.array([])
  }, {
    validator: this.customValidationFunction
  });

  customValidationFunction(formGroup: FormGroup): any {
      const bothEmpty = formGroup.get('enTerm').value === '' && formGroup.get('enExp').value === '';
      console.log('validation = ' + bothEmpty);
      return bothEmpty ? {enTermRegexpEmpty: ''} : null;
 }

  constructor(
    private fb: FormBuilder,
    private snomed: SnomedService,
  ) { }

  ngOnInit(): void {
  }

  search(): void {
    if (!this.batchForm.valid) {
      return;
    }

    this.snomed.findDescriptions(this.batchForm.value).subscribe((data) => {
      this.descriptions.push(data);
    });

  }

}
