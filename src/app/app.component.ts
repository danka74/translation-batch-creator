import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SnomedService } from './snomed.service';
import { Observable } from 'rxjs';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'translation-batch-creator';

  @ViewChild('selectBranch') branchSelect: MatSelect;
  @ViewChild('selectLimit') limitSelect: MatSelect;

  branches: Observable<any>;

  allowedLimits: string[];

  constructor(
    private snomed: SnomedService,
    public menu: MenuService,
  ) { }

  ngOnInit() {
    this.branches = this.snomed.getBranches();
    this.allowedLimits = this.snomed.getAllowedLimits();
  }

  ngAfterViewInit(): void {
    this.branchSelect.value = this.snomed.branch;
    this.limitSelect.value = this.snomed.limit;
  }

  setBranch(event: MatSelectChange) {
    console.log(event.value);
    this.snomed.branch = event.value;
  }

  setLimit(event: MatSelectChange) {
    this.snomed.limit = event.value;
  }

  doNothing() {

  }
}
