import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectColumnPopoverPage } from './select-column-popover.page';

const routes: Routes = [
  {
    path: '',
    component: SelectColumnPopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectColumnPopoverPage]
})
export class SelectColumnPopoverPageModule {}
