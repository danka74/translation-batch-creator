import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-batch-settings',
  templateUrl: './batch-settings.component.html',
  styleUrls: ['./batch-settings.component.css']
})
export class BatchSettingsComponent implements OnInit {

  batchSettingsForm = this.fb.group({
    name: ['test', Validators.required],
    ecl: ['<33879002 | Administration of vaccine to produce active immunity (procedure) |'],
    term: ['administration'],
  });

  constructor(
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
  }

}
