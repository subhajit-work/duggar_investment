import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionViewPage } from './transaction-view.page';
import { SharedModule } from './../../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: TransactionViewPage
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
  declarations: [TransactionViewPage]
})
export class TransactionViewPageModule {}
