import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCompanyPage } from './add-company.page';
import { SharedModule } from './../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddCompanyPage
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
  declarations: [AddCompanyPage]
})
export class AddCompanyPageModule {}
