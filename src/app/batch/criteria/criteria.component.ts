import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatTable } from '@angular/material/table';

export interface Criterium {
  qualifier: string;
  present: boolean;
  lang: string;
  type: string;
  accept: string;
  regexp: string;
}

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  public criteria: Criterium[] = [];

  // isEditing: boolean[] = [];

  displayedColumns: string[] = ['qualifier', 'present', 'lang', 'type', 'accept', 'regexp', 'buttons'];

  criteriaForm = this.fb.group({
    qualifier: ['exist', Validators.required],
    present: [true, Validators.required],
    lang: ['', Validators.required],
    type: [''],
    accept: [''],
    regexp: ['', Validators.required],
  }, {validators: this.duplicateValidator.bind(this)});

  duplicateValidator(control: AbstractControl): ValidationErrors | null {
    const duplicate = this.criteria.find((c: Criterium) => {
      return c.qualifier === control.get('qualifier').value &&
        c.present === control.get('present').value &&
        c.lang === control.get('lang').value &&
        c.type === control.get('type').value &&
        c.accept === control.get('accept').value &&
        c.regexp === control.get('regexp').value;
    });
    return duplicate ?
      {duplicateEntry: true} :
      null;
  }

  constructor(
    private fb: UntypedFormBuilder,
    ) { }

  ngOnInit(): void {
  }

  clearForm() {
    this.criteriaForm.reset({qualifier: 'exist', present: true, lang: '', type: '', accept: '', regexp: ''});
    this.criteriaForm.markAsPristine();
    this.criteriaForm.markAsUntouched();
  }

  clearTable() {
    this.criteria = [];
    this.table.renderRows();
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
    this.criteriaForm.markAsDirty();
  }
}
