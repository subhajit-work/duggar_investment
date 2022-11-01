import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNotificationPage } from './add-notification.page';
import { SharedModule } from '../../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: AddNotificationPage
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
  declarations: [AddNotificationPage]
})
export class AddNotificationPageModule {}
