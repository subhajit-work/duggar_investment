import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionListPage } from './transaction-list.page';
import { SharedModule } from './../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TransactionListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TransactionListPage]
})
export class TransactionListPageModule {}
