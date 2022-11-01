import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddGroupPage } from './add-group.page';
import { SharedModule } from './../../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: AddGroupPage
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
  declarations: [AddGroupPage]
})
export class AddGroupPageModule {}
