import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { RecivedBrokerageListPage } from './recived-brokerage-list.page';

const routes: Routes = [
  {
    path: '',
    component: RecivedBrokerageListPage
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
  declarations: [RecivedBrokerageListPage]
})
export class RecivedBrokerageListPageModule {}
