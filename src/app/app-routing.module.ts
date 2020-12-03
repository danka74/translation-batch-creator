import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateBatchComponent } from './batch/translate-batch/translate-batch.component';
import { Icd10Component } from './icd10/icd10/icd10.component';


const routes: Routes = [
  {
    path: 'translate-batch',
    component: TranslateBatchComponent,
  },
  {
    path: 'icd-10',
    component: Icd10Component,
  },
  {
    path: '',
    redirectTo: '/translate-batch',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
