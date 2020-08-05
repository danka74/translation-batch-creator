import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SnomedService } from './snomed.service';
import { Observable } from 'rxjs';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { TranslateBatchComponent } from './translate-batch/translate-batch.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'translation-batch-creator';

  @ViewChild(MatSelect) branchSelect: MatSelect;
  @ViewChild(TranslateBatchComponent) translateBatch: TranslateBatchComponent;

  branches: Observable<any>;

  constructor(
    private snomed: SnomedService,
    ) { }

  ngOnInit() {
    this.branches = this.snomed.getBranches();
  }

  ngAfterViewInit(): void {
    this.branchSelect.value = this.snomed.branch;
  }

  selectBranch(event: MatSelectChange) {
    console.log(event.value);
    this.snomed.branch = event.value;
  }

  doNothing() {

  }
}
