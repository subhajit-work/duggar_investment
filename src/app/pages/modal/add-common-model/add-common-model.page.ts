import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { CommonUtils } from '../../../services/common-utils/common-utils';
import { environment } from '../../../../environments/environment';


/* tslint:disable */ 
@Component({
  selector: 'app-add-common-model',
  templateUrl: './add-common-model.page.html',
  styleUrls: ['./add-common-model.page.scss'],
})
export class AddCommonModelPage implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  
  // variable declar
  model: any = {};
  form_submit_text = 'Submit';
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  setStartdate;
  api_url;

  get_identifier;
  get_item;
  get_array;
  heder_title;
  onEditField = 'PUT';
  showSubmitButton = true;
  previewOtherUrl;
  principleStartdate;
  tdsStartdate;
  onHiddenRole;
  companyList;
  countryList;
  stateList;
  selectLoading;

  // @Input() identifire;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private http : HttpClient,
    private navParams : NavParams,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  ngOnInit() {

    // today select
    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    this.model.setStartdate = this.setStartdate;

    // this.model.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    this.get_identifier =  this.navParams.get('identifier');
    this.get_item =  this.navParams.get('modalForm_item');
    this.get_array =  this.navParams.get('modalForm_array');

    if(this.get_identifier == 'interest_deposit')
    {
      this.heder_title = 'Add Deposit';
      this.onEditField = 'PUT';
      this.api_url = 'interest_chequedeposit/'+ this.get_item.id;
    }else if(this.get_identifier == 'brokerage_deposit'){
      this.heder_title = 'Add Deposit';
      this.onEditField = 'PUT';
      // this.api_url = 'brokerage/'+ this.get_item.id;
      this.api_url = 'chequedeposit/'+ this.get_item.id;
    }else if(this.get_identifier == 'file_preview'){
      this.heder_title = 'Preview';
      this.showSubmitButton = false;
      this.previewOtherUrl = this.main_url+'/'+this.get_item.file_path;
    }else if(this.get_identifier == 'payment_details'){
      this.heder_title = 'Payment Details';
      this.showSubmitButton = false;
      this.previewOtherUrl = this.main_url+'/'+this.get_array;
    }else if(this.get_identifier == 'principle_recive_modal'){
      this.heder_title = 'Principle Receive';
      this.onEditField = 'PUT';
      this.api_url = 'transaction_principlestatus/'+ this.get_item.id;
    }else if(this.get_identifier == 'tds_recive_modal'){
      this.heder_title = 'TDS Receive';
      this.onEditField = 'PUT';
      this.api_url = 'transaction_conflictedstatus/'+ this.get_item.id;
    }else if(this.get_identifier == 'change_password_modal'){
      this.heder_title = 'Change Password';
      this.onEditField = 'PUT';
      this.api_url = 'change_password';
    }else if(this.get_identifier == 'profile_update_modal'){
      this.heder_title = 'Profile';
      this.onEditField = 'PUT';
      this.api_url = 'group/'+ this.get_item.id;

      // edit page data
      this.editPagaDataCall('group', this.get_item);

      // getlist call
      this.getlist('group_getlist')
    }


  }

  // ======================== form submit start ===================
    onSubmit(form:NgForm){
      this.form_submit_text = 'Submitting';

      // get form value
      let fd = new FormData();
      for (let val in form.value) {
        if(form.value[val] == undefined){
          form.value[val] = '';
        }
        fd.append(val, form.value[val]);
      };

      if(!form.valid){
        return;
      }
      this.formSubmitSubscribe = this.http.post(this.api_url, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Submit';
          if(response.return_status > 0){

            this.commonUtils.presentToast('success', response.return_message);
            form.reset();
            this.modalController.dismiss('submitClose');
          }
        },
        errRes => {
          this.form_submit_text = 'Submit';
        }
      );

    }
  // form submit end

  // onChange dropdown
  onChange(event){

  }

  // close modal
  closeModal() {
    // this.modalController.dismiss(this.arrayList);
    this.modalController.dismiss();
  }

   // -----datepicker start------

    datePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      // toDate: new Date(),
      closeOnSelect: true,
      yearInAscending: true
    };

    principledatePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      closeOnSelect: true,
      yearInAscending: true
    };

    tdsdatePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      closeOnSelect: true,
      yearInAscending: true
    };

    // get selected date
    myFunction(){
      console.log('get seleted date')
    }
  // datepicker 

  // -------------- edit page api call start  ------------
  profileLoading;
  allClient;
  editPagaDataCall(api_name, _item){
    this.onEditField = 'PUT';
    this.profileLoading = true;
    //edit data call
    this.editDataSubscribe = this.http.get(api_name+'/'+_item.id).subscribe(
      (res:any) => {
        this.profileLoading = false;
        console.log("Edit data  res profile >", res.return_data);
        if(res.return_status > 0){
          this.model = {
            name : res.return_data.name,
            // borrower : JSON.parse(res.return_data.client[0].id),
            enable : res.return_data.status,
            is_login : res.return_data.is_login,
            description : res.return_data.description,
            sms : res.return_data.send_sms,
            emailcheck : res.return_data.send_email,
            address_1 : res.return_data.address,
            countrys : res.return_data.country,
            state : res.return_data.state,
            city : res.return_data.city,
            pin : res.return_data.pin,
            phone : res.return_data.phone,
            communication_email : res.return_data.communication_email
          };
          
          if(res.return_data.user_info){
            this.model.username = res.return_data.user_info[0].email;
            this.model.password = res.return_data.user_info[0].password;
          }

          // console.log('country >', this.model.country);
          this.allClient = [];
          res.return_data.client.forEach(element => {
            this.allClient.push(element);
          });

           // console.log('country >', this.model.country);
           this.model.borrower = [];
           res.return_data.client.forEach(element => {
             this.model.borrower.push(element.id);
           });
          // this.selectedPeople = [this.people[0].id, this.people[1].id
        }
      },
      errRes => {
        // this.selectLoadingDepend = false;
        this.profileLoading = false;
      }
    );

  }
  // edit page api call end

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.editDataSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.onHiddenRole = resData.role.id;
          this.companyList = resData.client;
          this.countryList = resData.country_id;
          this.stateList = resData.state_id;
        },
        errRes => {
        }
      );
    });
  }

  // destroy call
  ngOnDestroy(){
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined){
      this.editDataSubscribe.unsubscribe();
    }
  }

}

