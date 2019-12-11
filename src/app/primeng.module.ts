import { NgModule } from '@angular/core';
// import {
//   MatAutocompleteModule,
// } from '@angular/material';

import {
  MenuModule,
  MenuItemContent
} from 'primeng/menu';

@NgModule({
  imports: [
    MenuModule
  ],
  exports: [
    // MatAutocompleteModule,
    MenuModule
  ]
})
export class PrimeNgModule {}
