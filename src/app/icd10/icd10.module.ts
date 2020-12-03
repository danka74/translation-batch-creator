import { NgModule } from '@angular/core';
import { Icd10Component } from './icd10/icd10.component';
import { SnomedService } from '../snomed.service';
import { AppCommonModule } from '../app-common.module';
import { MenuService } from '../menu.service';



@NgModule({
  declarations: [ Icd10Component ],
  imports: [
    AppCommonModule,
  ],
  bootstrap: [ Icd10Component ],
  exports: [ Icd10Component ]
})
export class Icd10Module { }
