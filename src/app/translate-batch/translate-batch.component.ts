import { Component, OnInit, ViewChild } from '@angular/core';
import { SnomedService, DescriptionItem, ResultMetadata } from '../snomed.service';
import { CriteriaComponent } from '../criteria/criteria.component';
import { BatchSettingsComponent } from '../batch-settings/batch-settings.component';
import { MatTable } from '@angular/material/table';
import { ReplaceComponent } from '../replace/replace.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SelectionModel } from '@angular/cdk/collections';

const langRefsetMap: Record<string, string> = {
  en: '900000000000509007',
  sv: '46011000052107',
};

const caseSignificanceMap: Record<string, string> = {
  CASE_INSENSITIVE: 'ci',
  ENTIRE_TERM_CASE_SENSITIVE: 'CS',
  INITIAL_CHARACTER_CASE_INSENSITIVE: 'cI',
}

interface ResultsDisplay {
  conceptId: string;
  descriptionsDisplay: string;
  newDescriptionsDisplay: string;
}

interface NewDescription {
  term: string; // the new term
  oldTerm: string; // the term being replaced
  lang: string; // the language
  caseSignificance: string; // the case significance of the existing description
  descriptionId: string; // the description id of the existing description
  acceptability: string; // caseSignificanceMapacceptability of the existing description
}

interface Result {
  descriptionItem: DescriptionItem;
  newDescriptions: NewDescription[];
}

@Component({
  selector: 'app-translate-batch',
  templateUrl: './translate-batch.component.html',
  styleUrls: ['./translate-batch.component.css']
})
export class TranslateBatchComponent implements OnInit {

  @ViewChild(BatchSettingsComponent) batchSettings: BatchSettingsComponent;
  @ViewChild(CriteriaComponent) criteria: CriteriaComponent;
  @ViewChild(ReplaceComponent) replace: ReplaceComponent;
  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;


  @ViewChild(MatTable) resultTable: MatTable<ResultsDisplay>;
  displayedColumns = ['select', 'conceptId', 'descriptions', 'newTerms'];
  selection = new SelectionModel<ResultsDisplay>(true, []);

  resultsDisplay: ResultsDisplay[] = [];
  results: Result[] = [];
  running = false;
  endOfResults = true;

  constructor(
    public snomed: SnomedService,
    ) { }

    ngOnInit(): void {
    }

    displayDesc(descriptions: any[]) {
      return descriptions.reduce((acc, cur) => {
        return acc + '<br/>' + cur;
      }, '');
    }

    run(searchAfter: boolean = false): void {
      if (this.batchSettings.batchSettingsForm.valid) {
        this.running = true;
        this.results = [];
        this.resultsDisplay = [];
        this.resultTable.renderRows();

        this.snomed.findDescriptions({
          ecl: this.batchSettings.batchSettingsForm.get('ecl').value,
          term: this.batchSettings.batchSettingsForm.get('term').value,
          criteria: this.criteria.criteria,
        }, searchAfter).subscribe({
          next: (data: DescriptionItem) => {
            // create display HTML
            const descriptionsDisplay = data.descriptions.reduce((acc, cur) => {
              const acceptability = cur.acceptabilityMap[langRefsetMap[cur.lang]];
              const type = cur.type;
              return acc + cur.term + `(${cur.lang}, ${cur.type}, ${acceptability})<br/>`;
            }, '');
            // create new descriptions
            const newDescriptions: NewDescription[] = [];
            let newDescriptionsDisplay = '';
            if (Array.isArray(this.replace.replace) && this.replace.replace.length) {
              data.descriptions.forEach((d) => {
                let newDescription = d.term;
                let replaced = false;
                this.replace.replace.forEach((r) => {
                  if (d.lang === r.lang && d.term.includes(r.replace)) {
                    newDescription = newDescription.replace(r.replace, r.replaceWith);
                    replaced = (newDescription !== d.term);
                  }
                });
                if (replaced) {
                  newDescriptions.push({
                    term: newDescription,
                    oldTerm: d.term,
                    lang: d.lang,
                    caseSignificance: d.caseSignificance,
                    descriptionId: d.descriptionId,
                    acceptability: d.acceptabilityMap[langRefsetMap[d.lang]],
                  });
                  newDescriptionsDisplay += newDescription + '<br/>';
                }
              });
            }
            this.results.push({
              descriptionItem: data,
              newDescriptions,
            });
            this.resultsDisplay.push({
              conceptId: data.conceptId,
              descriptionsDisplay,
              newDescriptionsDisplay,
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

    createBatchFile() {
      let newDescriptionsFile = 'Concept ID\tGB/US FSN Term (For reference only)\tTranslated Term\tLanguage Code\tCase significance\tType\tLanguage reference set\tAcceptability\tLanguage reference set\tAcceptability\tLanguage reference set\tAcceptability\n';
      let inactivateDescriptionsFile = 'Description ID\tTerm (For reference only)\tInactivation Reason\tAssociation Target ID1\tAssociation Target ID2\tAssociation Target ID3\tAssociation Target ID4\n';
      if (Array.isArray(this.results) && this.results.length) {
        this.results.forEach((r: Result, index: number) => {
          if (this.selection.isSelected(this.resultsDisplay[index])) {
            r.newDescriptions.forEach((d) => {
              switch (this.batchSettings.batchSettingsForm.get('type').value) {
                case 'newDescSyn':
                newDescriptionsFile += `${r.descriptionItem.conceptId}\t${r.descriptionItem.fsn}\t${d.term}\t${d.lang}\t${caseSignificanceMap[d.caseSignificance]}\tSYNONYM\tSwedish\tACCEPTABLE\n`;
                break;
                case 'replaceDesc':
                newDescriptionsFile += `${r.descriptionItem.conceptId}\t${r.descriptionItem.fsn}\t${d.term}\t${d.lang}\t${caseSignificanceMap[d.caseSignificance]}\tSYNONYM\tSwedish\t${d.acceptability}\n`;
                inactivateDescriptionsFile += `${d.descriptionId}\t${d.oldTerm}\t${this.batchSettings.batchSettingsForm.get('inactivationReason').value}\n`;
                break;
                default:
              }
            });
          }
        });

        this.saveFile(newDescriptionsFile, `${this.batchSettings.batchSettingsForm.get('name').value}_DescriptionAdditions_part_${this.snomed.getResultMetadata().part}.tsv`);

        if (inactivateDescriptionsFile.length) {
          this.saveFile(inactivateDescriptionsFile, `${this.batchSettings.batchSettingsForm.get('name').value}_DescriptionInactivations_part_${this.snomed.getResultMetadata().part}.tsv`);
        }
      }
    }

    saveFile(o: any, name: string) {
      const a = document.createElement('a');
      if (typeof o === 'string') {
        a.href = URL.createObjectURL(new Blob([o], {type: 'text/plain'}));
      } else {
        a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 2)], {type : 'application/json'}));
      }
      a.download = name;
      // start download
      a.click();
    }

    saveBatch() {
      if (this.batchSettings.batchSettingsForm.valid) {
        this.saveFile({
          settings: this.batchSettings.batchSettingsForm.value,
          criteria: this.criteria.criteria,
          replace: this.replace.replace,
        }, this.batchSettings.batchSettingsForm.get('name').value + '.json');
      }
    }

    onFileSelected() {
      const inputNode: any = document.querySelector('#file');

      if (typeof (FileReader) !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const batch = JSON.parse(new TextDecoder().decode(e.target.result));
          console.log(batch);
          this.batchSettings.batchSettingsForm.setValue(batch.settings);
          this.batchSettings.batchSettingsForm.markAsDirty();
          this.criteria.criteria = batch.criteria;
          this.criteria.table.renderRows();
          this.replace.replace = batch.replace;
          this.replace.table.renderRows();
          inputNode.value = '';
        };

        reader.readAsArrayBuffer(inputNode.files[0]);
      }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.resultsDisplay.length;
      return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
      this.selection.clear() :
      this.resultsDisplay.forEach(row => this.selection.select(row));
    }
  }
