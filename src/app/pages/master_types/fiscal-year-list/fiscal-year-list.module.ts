import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { FiscalYearListPage } from './fiscal-year-list.page';

const routes: Routes = [
  {
    path: '',
    component: FiscalYearListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FiscalYearListPage]
})
export class FiscalYearListPageModule {}
