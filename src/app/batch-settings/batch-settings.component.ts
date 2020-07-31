import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-batch-settings',
  templateUrl: './batch-settings.component.html',
  styleUrls: ['./batch-settings.component.css']
})
export class BatchSettingsComponent implements OnInit {

  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;

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

}
