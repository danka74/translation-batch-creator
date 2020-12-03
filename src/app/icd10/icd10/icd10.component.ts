import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuService } from 'src/app/menu.service';
import { Icd10Result, Icd10ResultItem, SnomedService } from 'src/app/snomed.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';

interface Result {
  icd10code: string;
  conceptId: string;
  fsn: string;
  pt: string;
  mapAdvice: string;
}

@Component({
  selector: 'app-icd10',
  templateUrl: './icd10.component.html',
  styleUrls: ['./icd10.component.css']
})
export class Icd10Component implements OnInit {

  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;
  @ViewChild(MatTable) resultTable: MatTable<Result>;


  icd10Form = this.fb.group({
    codes: [''],
  });

  results: Result[] = [];
  running = false;
  displayedColumns = [ 'icd10code', 'conceptId', 'fsn', 'pt', 'mapAdvice'];
  endOfResults = true;


  constructor(
    private fb: FormBuilder,
    public snomed: SnomedService,
    private menu: MenuService) {

    }

    ngOnInit(): void {
      this.menu.title = 'ICD-10';
      this.snomed.resetMetadata();
    }

    clear() {
      this.icd10Form.setValue({
        codes: '',
      });
      this.icd10Form.markAsPristine();
      this.icd10Form.markAsUntouched();
    }

    run() {
      const codes = this.icd10Form.get('codes').value.split(/[\s,]+/);
      this.snomed.findIcd10(codes).subscribe({
        next: (data: Icd10Result) => {
          console.log(data);
          data.items.forEach((item: Icd10ResultItem) => {
            this.results.push({
              icd10code: data.mapTarget,
              conceptId: item.conceptId,
              fsn: item.fsn,
              pt: item.pt,
              mapAdvice: item.mapAdvice,
            });
          });

        },
        complete: () => {
          this.resultTable.renderRows();
          this.endOfResults = this.snomed.endOfResults();
          this.running = false;
          // console.log(this.results);
        },
      });
    }
}
