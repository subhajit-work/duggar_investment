import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';

/* tslint:disable */ 
@Component({
  selector: 'app-select-column-popover',
  templateUrl: './select-column-popover.page.html',
  styleUrls: ['./select-column-popover.page.scss'],
})
export class SelectColumnPopoverPage implements OnInit {

  constructor( 
    private popoverController : PopoverController,
    private navParams : NavParams,
    private storage: Storage
  ) { }
  
  tableheaderDataDropdown;
  tableheaderDataPop;
  current_url_name

  ngOnInit() {
    this.tableheaderDataPop =  this.navParams.get('popover_header_data');
    this.tableheaderDataDropdown =  this.navParams.get('popover_header_data_dropdown');
    this.current_url_name =  this.navParams.get('current_url_name');
  

    console.log('this.tableheaderDataPop >', this.tableheaderDataPop);
    console.log('this.current_url_name>', this.current_url_name);

  }

    isColumnSelection(option, event) {
      console.log('option >>', option);
      // console.log('event >>', event);

      if(event.target.checked) {
        console.log('event.target.checked if 1111111111111111');
        if(this.tableheaderDataPop.indexOf(option) == -1){
          option.is_default = 1;
          option.is_display = 1;
          this.tableheaderDataPop.push(option);
        }else{
          option.is_default = 1;
          option.is_display = 1;
        }
      } else {
        console.log('event.target.checked else 22222222222222222');

          for(var i=0 ; i < this.tableheaderDataPop.length; i++) {
            if(this.tableheaderDataPop[i].column_name == option.column_name) {
              this.tableheaderDataPop.splice(i,1);
          }
        }
      }
   
      // this.tableheaderData = this.tableheaderDataPop;

      // set stroage value
      this.storage.set(`${this.current_url_name}`, this.tableheaderDataPop);

      console.log('checked item >>', this.tableheaderDataPop );
    }

  // close select column popover
  closeSelectColumnPopover(){
    console.log('modal dismiss');
    this.popoverController.dismiss();
  }

  // reset select column popover
  resetSelectColumnPopover(){
    this.popoverController.dismiss('', 'resetPopover');

    console.log('this.tableheaderData >>>>>>>>', this.tableheaderDataPop);
    // set stroage value
    // this.storage.set(`${this.current_url_name}`, this.tableheaderData);
    this.storage.remove(`${this.current_url_name}`);
    // this.storage.remove(`${ this.current_url_name }`);

  }

}
