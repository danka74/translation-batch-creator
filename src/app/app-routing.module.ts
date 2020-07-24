import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateBatchComponent } from './translate-batch/translate-batch.component';


const routes: Routes = [
  {
    path: 'translate-batch',
    component: TranslateBatchComponent,
  },
  {
    path: '',
    redirectTo: '/translate-batch',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
