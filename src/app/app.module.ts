import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnomedService } from './snomed.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BatchModule } from './batch/batch.module';
import { MenuService } from './menu.service';
import { AppCommonModule } from './app-common.module';
import { Icd10Module } from './icd10/icd10.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AppCommonModule,

    BatchModule,
    Icd10Module,
  ],
  providers: [
    SnomedService,
    MenuService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
