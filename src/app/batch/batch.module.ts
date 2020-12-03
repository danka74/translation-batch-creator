import { NgModule } from '@angular/core';
import { TranslateBatchComponent } from './translate-batch/translate-batch.component';
import { CriteriaComponent } from './criteria/criteria.component';
import { BatchSettingsComponent } from './batch-settings/batch-settings.component';
import { ReplaceComponent } from './replace/replace.component';
import { AppCommonModule } from '../app-common.module';
import { SnomedService } from '../snomed.service';
import { MenuService } from '../menu.service';

@NgModule({
  declarations: [
    TranslateBatchComponent,
    CriteriaComponent,
    BatchSettingsComponent,
    ReplaceComponent
  ],
  imports: [
    AppCommonModule,
  ],
  bootstrap: [ TranslateBatchComponent ],
  exports: [
    TranslateBatchComponent,
  ]
})
export class BatchModule { }
