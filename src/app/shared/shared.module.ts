import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

import { MatExpansionModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatSortModule, MatFormFieldModule, MatSelectModule,
  MatAutocompleteModule, MatIconModule, MatButtonModule
} from '@angular/material';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxTinymceModule } from 'ngx-tinymce';

import { HighlightDirective } from '../directives/directive.directive';
import { CommonHeaderComponent } from '../my-component/common-header/common-header.component';
import { CommonFooterComponent } from '../my-component/common-footer/common-footer.component';
import { FiltermultiPipe } from '../pipe/filter.pipe';
import { RoundPipe } from '../pipe/roundof.pipe ';
import { DragDropDirective } from '../directives/file-upload.directive';
import { FileSizePipeConvertPipe } from '../pipe/fileSize-convert.pipe ';
import { SafeUrlPipe } from '../pipe/safeUrl.pipe ';
import { MyTooltipDirective } from '../directives/my-tooltip.directive';
import { OnlyNumberDirective } from '../directives/only-number.directive';
import { AutofocusDirective } from '../directives/input-auto-focus.directive';
import { NgInitDirective } from '../directives/init.directive';
import { MustMatchDirective } from '../directives/must-match.directive';

// //owl date time picker
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';

/* tslint:disable */ 
@NgModule({
  declarations: [
    HighlightDirective, //directive share
    CommonHeaderComponent, //header component share
    CommonFooterComponent,  //footer component share
    FiltermultiPipe, // custom filter multiple value
    DragDropDirective, //file upload directive
    FileSizePipeConvertPipe, //file size convert pipe/filter
    MyTooltipDirective, //not ues any where
    OnlyNumberDirective, // take only number
    AutofocusDirective,
    RoundPipe,
    SafeUrlPipe,
    NgInitDirective,
    MustMatchDirective //match password or confirm password or email or confirm passwor
  ],
  imports: [
    CommonModule,
    IonicModule, //need for component share only
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(), //not need any where
    Ionic4DatepickerModule,
    MatIconModule,
    MatButtonModule,
    NgSelectModule, //angular dropdown
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
    }),
    OwlDateTimeModule,  //owl date time picker
    OwlNativeDateTimeModule, //owl date time picker
  ],
  providers: [
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB'},
  ],
  exports:[
    HighlightDirective, 
    MatExpansionModule, 
    MatMenuModule, 
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonHeaderComponent, //header component share
    CommonFooterComponent,  //footer component share
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule, //not need any where
    Ionic4DatepickerModule,
    MatIconModule,
    MatButtonModule,
    FiltermultiPipe, // custom filter multiple value
    NgSelectModule, //angular dropdown
    DragDropDirective, //file upload directive
    FileSizePipeConvertPipe, //file size convert pipe/filter
    OnlyNumberDirective, // take only number
    AutofocusDirective,
    RoundPipe,
    SafeUrlPipe,
    NgInitDirective,
    NgxTinymceModule,
    MustMatchDirective, //match password or confirm password or email or confirm passwor
    OwlDateTimeModule,  //owl date time picker
    OwlNativeDateTimeModule, //owl date time picker
  ]
})
export class SharedModule { }
