import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateBatchComponent } from './translate-batch/translate-batch.component';
import { SnomedService } from './snomed.service';

@NgModule({
  declarations: [
    AppComponent,
    TranslateBatchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [SnomedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
