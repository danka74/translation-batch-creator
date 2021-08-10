import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-batch-settings',
  templateUrl: './batch-settings.component.html',
  styleUrls: ['./batch-settings.component.css']
})
export class BatchSettingsComponent implements OnInit {

  batchSettingsForm = this.fb.group({
    name: ['', Validators.required],
    type: ['newDescSyn', Validators.required],
    inactivationReason: ['Non-conformance to editorial policy', Validators.required],
    ecl: ['*'],
    term: [''],
  });

  constructor(
    private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
    }

    clear() {
      this.batchSettingsForm.setValue({
        name: '',
        type: 'newDescSyn',
        inactivationReason: 'Non-conformance to editorial policy',
        ecl: '*',
        term: '',
      });
      this.batchSettingsForm.markAsPristine();
      this.batchSettingsForm.markAsUntouched();

    }

  }
