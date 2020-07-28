import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatTable } from '@angular/material/table';

interface Criterium {
  present: boolean;
  lang: string;
  regexp: string;
}

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  public criteria: Criterium[] = [{
    present: true,
    lang: 'en',
    regexp: 'Administration of',
  },{
    present: true,
    lang: 'sv',
    regexp: 'administrering av vaccin',
  },{
    present: false,
    lang: 'sv',
    regexp: 'vaccination',
  }];

  displayedColumns: string[] = ['present', 'lang', 'regexp', 'buttons'];

  criteriaForm = this.fb.group({
    present: [true, Validators.required],
    lang: ['', Validators.required],
    regexp: ['', Validators.required],
  }, {validators: this.duplicateValidator.bind(this)});

  duplicateValidator(control: FormGroup): ValidationErrors | null {
    const duplicate = this.criteria.find((c: Criterium) => {
      return c.present === control.get('present').value &&
        c.lang === control.get('lang').value &&
        c.regexp === control.get('regexp').value;
    });
    return duplicate ?
      {duplicateEntry: true} :
      null;
  }

  constructor(
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
  }

  clearForm() {
    this.criteriaForm.reset({present: true, lang: '', regexp: ''});
    this.criteriaForm.markAsUntouched();
  }

  add() {
    if (this.criteriaForm.valid) {
      const v = this.criteriaForm.value;
      this.criteria.push(v);
      this.clearForm();
      this.table.renderRows();
    }
  }

  remove(index: number) {
    this.criteria.splice(index, 1);
    this.table.renderRows();
    this.criteriaForm.updateValueAndValidity();
  }

  copy(index: number) {
    this.criteriaForm.setValue(this.criteria[index]);
  }
}