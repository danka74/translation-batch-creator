import { Component, OnInit, ViewChild } from '@angular/core';
import { SnomedService, DescriptionItem } from '../snomed.service';
import { CriteriaComponent } from '../criteria/criteria.component';
import { BatchSettingsComponent } from '../batch-settings/batch-settings.component';
import { MatTable } from '@angular/material/table';
import { ReplaceComponent } from '../replace/replace.component';

const langRefsetMap: Record<string, string> = {
  en: '900000000000509007',
  sv: '46011000052107',
};

@Component({
  selector: 'app-translate-batch',
  templateUrl: './translate-batch.component.html',
  styleUrls: ['./translate-batch.component.css']
})
export class TranslateBatchComponent implements OnInit {

  @ViewChild(BatchSettingsComponent) batchSettings: BatchSettingsComponent;
  @ViewChild(CriteriaComponent) criteria: CriteriaComponent;
  @ViewChild(ReplaceComponent) replace: ReplaceComponent;

  @ViewChild(MatTable) resultTable: MatTable<any>;
  displayedColumns = ['conceptId', 'descriptions', 'newTerms'];

  results: any[] = [];
  running = false;

  constructor(
    private snomed: SnomedService,
    ) { }

  ngOnInit(): void {
  }

  displayDesc(descriptions: any[]) {
    return descriptions.reduce((acc, cur) => {
      return acc + '<br/>' + cur;
    }, '');
  }

  run(): void {
    if (this.batchSettings.batchSettingsForm.valid) {
      this.running = true;
      this.results = [];
      this.resultTable.renderRows();

      this.snomed.findDescriptions({
        ecl: this.batchSettings.batchSettingsForm.get('ecl').value,
        term: this.batchSettings.batchSettingsForm.get('term').value,
        criteria: this.criteria.criteria,
      }).subscribe({
        next: (data: DescriptionItem) => {
          // create display HTML
          const descriptionsDisplay = data.descriptions.reduce((acc, cur) => {
            const acceptability = cur.acceptabilityMap[langRefsetMap[cur.lang]];
            return acc + cur.term + ' (' + cur.lang + ', ' + acceptability + ')<br/>';
          }, '');
          // create new descriptions
          const newDescriptions = [];
          let newDescriptionsDisplay = '';
          if (Array.isArray(this.replace.replace) && this.replace.replace.length) {
            data.descriptions.forEach((d) => {
              this.replace.replace.forEach((r) => {
                if (d.lang === r.lang && d.term.includes(r.replace)) {
                  const newTerm = d.term.replace(r.replace, r.replaceWith);
                  newDescriptions.push({
                    term: newTerm,
                    lang: d.lang,
                    caseSignificance: d.caseSignificance,
                  });
                  newDescriptionsDisplay += newTerm + '<br/>';
                }
              });
            });
          }
          this.results.push({
            conceptId: data.conceptId,
            descriptionsDisplay,
            newDescriptionsDisplay
          });
        },
        complete: () => {
          this.resultTable.renderRows();
          this.running = false;
        },
      });
    }
  }
}
