import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';

interface Replace {
  lang: string;
  replace: string;
  replaceWith: string;
}

@Component({
  selector: 'app-replace',
  templateUrl: './replace.component.html',
  styleUrls: ['./replace.component.css']
})
export class ReplaceComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['lang', 'replace', 'replaceWith', 'buttons'];

  public replace: Replace[] = [];

  replaceForm = this.fb.group({
    lang: ['', Validators.required],
    replace: ['', Validators.required],
    replaceWith: '',
  }, {validators: this.duplicateValidator.bind(this)});

  duplicateValidator(control: FormGroup): ValidationErrors | null {
    const duplicate = this.replace.find((r: Replace) => {
      return r.lang === control.get('lang').value &&
        r.replace === control.get('replace').value &&
        r.replaceWith === control.get('replaceWith').value;
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
    this.replaceForm.reset({present: true, lang: '', regexp: ''});
    this.replaceForm.markAsPristine();
    this.replaceForm.markAsUntouched();
  }

  clearTable() {
    this.replace = [];
    this.table.renderRows();
  }

  add() {
    if (this.replaceForm.valid) {
      const v = this.replaceForm.value;
      this.replace.push(v);
      this.clearForm();
      this.table.renderRows();
    }
  }

  remove(index: number) {
    this.replace.splice(index, 1);
    this.table.renderRows();
    this.replaceForm.updateValueAndValidity();
  }

  copy(index: number) {
    this.replaceForm.setValue(this.replace[index]);
    this.replaceForm.markAsDirty();
  }
}
