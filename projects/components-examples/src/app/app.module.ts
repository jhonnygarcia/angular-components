import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule  } from '@angular/forms';

import { AppComponent } from './app.component';
import { DataTableModule } from 'data-table';
import { ComboboxModule } from 'combobox';

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    FormsModule,
    DataTableModule,
    ComboboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
