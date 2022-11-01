import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { CommonUtils } from '../../../services/common-utils/common-utils';
import { Subscription } from 'rxjs';

/* tslint:disable */ 
@Component({
  selector: 'app-add-transaction-modal',
  templateUrl: './add-transaction-modal.page.html',
  styleUrls: ['./add-transaction-modal.page.scss'],
})
export class AddTransactionModalPage implements OnInit, OnDestroy {
  
  // variable declar
  model: any = {};
  form_submit_text = 'Submit';
  groupList;
  arrayList;
  contact_by_company;
  api_url;
  parent_contact_id;
  contact_type = 'individual'
  phone_default = '1';
  contact_default = '1';
  status = 'on';
  type = 'company';
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  getArrayName;
  getArrayValue;
  allgetlistData;
  companyList;
  countryList;
  stateList;
  get_api_url;
  onEditField = 'PUT';
  onTypeField;
  getClientId;
  checkEmailError = false;
  onHiddenRole = '33';


  countryId = '1';
  stateId = '1';
  statusId = true;
  address_line1='';
  address_line2='';
  city ='';
  pincode ='';
  phone ='';
  emailId ='';
  description ='';


  // @Input() companyList;
  @Input() identifier;
  @Input() modalForm__type;
  @Input() modalForm__displayName;
  @Input() modalForm_select_Id;
  

  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private http : HttpClient,
    private navParams : NavParams,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  ngOnInit() {
    this.arrayList = [];
    this.get_api_url =  this.navParams.get('modalForm_url');
    this.allgetlistData =  this.navParams.get('allGetlistData');
    this.arrayList =  this.navParams.get('modalForm_array');
    this.getArrayName =  this.navParams.get('modalForm_arrayName');
    this.getArrayValue =  this.navParams.get('modalForm_arrayValue');

    console.log('this.allgetlistData >', this.allgetlistData);

    //---- lender_group_add start---
      if(this.identifier == 'lender_group_add'){

        this.companyList = this.allgetlistData.lenders;

        if(this.modalForm_select_Id != null && this.modalForm_select_Id !== undefined && this.modalForm_select_Id != ''){
          //---- edit page-----
          this.api_url = this.get_api_url+'/'+this.modalForm_select_Id;
          this.onEditField = 'PUT';
          this.http.get(this.api_url).subscribe(
            (res:any) => {
              console.log("Edit data  res >", res.return_data);
              if(res.return_status > 0){
                this.model = {
                  name : res.return_data.name,
                  is_login:res.return_data.is_login,
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
                  // borrower : JSON.parse(res.return_data.client[0].id)
                };

                if(res.return_data.user_info){
                  this.model.username = res.return_data.user_info[0].email;
                  this.model.password = res.return_data.user_info[0].password;
                }

                this.model.borrower = [];
                res.return_data.client.forEach(element => {
                  this.model.borrower.push(element.id);
                });
              }
          });

        }else{
          // -----add page-----
          this.api_url = this.get_api_url;
          this.model = {
            enable : 'true',
            sms: 'true',
            emailcheck: 'true'
          };
        }
      //---- lender_group_add end---
      }else if(this.identifier == 'lender_single_add'){

        this.onTypeField = 'company';

        this.groupList = this.allgetlistData.group;

        if(this.modalForm_select_Id != null && this.modalForm_select_Id !== undefined && this.modalForm_select_Id != ''){
          // ------- edit page -----
          this.api_url = this.get_api_url+'/'+this.modalForm_select_Id;
          this.onEditField = 'PUT';
          this.http.get(this.api_url).subscribe(
            (res:any) => {
              console.log("Edit data  res >", res.return_data);
              if(res.return_status > 0){
                this.model = {
                  name : res.return_data.name,
                  group : JSON.parse(res.return_data.group_id),
                  pan_no : res.return_data.pan_no,
                  enable : res.return_data.status,
                  fifteeng : res.return_data.g15,
                  sms : res.return_data.send_sms,
                  emailcheck : res.return_data.send_email,
                  tds : res.return_data.tds_amt,
                  address_1 : res.return_data.address,
                  countrys : res.return_data.country,
                  state : res.return_data.state,
                  city : res.return_data.city,
                  pin : res.return_data.pin,
                  phone : res.return_data.phone,
                  bank_name : res.return_data.bank_name,
                  branch_name : res.return_data.branch_name,
                  bank_acc : res.return_data.bank_acc,
                  ifsc_code : res.return_data.ifsc_code,
                  email : res.return_data.email,
                  /* group_admin:res.return_data.group_admin,
                  email : res.return_data.user_info.email,
                  password : res.return_data.user_info.password */
                };

                this.getClientId = res.return_data.id;

              }
          });

        }else{
          //-------- add page ------
          this.api_url = this.get_api_url;

          this.model = {
            enable : 'true',
            countrys:'India',
            sms: 'true',
            emailcheck: 'true'
          };

          this.getClientId = undefined;
          
        }
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

            let itemObj  = {};

            //---- lender_group_add start---
              if(this.identifier == 'lender_group_add'){
                itemObj = {
                  id:response.return_data.id,
                  name:response.return_data.name
                }
                if(this.modalForm_select_Id != null && this.modalForm_select_Id !== undefined && this.modalForm_select_Id != ''){
                  this.arrayList.pop(); //last index delete  item
                  this.arrayList.push(itemObj); //last index add  item
                }else{
                  // add
                  this.arrayList.push(itemObj);
                }
              //---- lender_group_add end---
              }else if(this.identifier == 'lender_single_add'){
                itemObj = {
                  id:response.return_data.id,
                  name:response.return_data.name
                }
                if(this.modalForm_select_Id != null && this.modalForm_select_Id !== undefined && this.modalForm_select_Id != ''){
                  this.arrayList.pop(); //last index delete  item
                  this.arrayList.push(itemObj); //last index add  item
                }else{
                  // add
                  this.arrayList.push(itemObj);
                }
              }
            
          
            // this.commonUtils.presentToast('success', response.return_message);
            form.reset();
            this.modalController.dismiss(this.arrayList);
          }
        },
        errRes => {
          this.form_submit_text = 'Submit';
        }
      );

    }
  // form submit end

    //----- unique email check start -------
    uniquEmailCheck(_item){
      console.log('_item >', _item);
      //edit data call
      this.editDataSubscribe = this.http.get('client_user_email_exists/'+this.getClientId+'?email='+_item).subscribe(
        (res:any) => {
          console.log("unique email data  res >", res.return_data);
          if(res.return_status > 0){
            this.checkEmailError = false;
          }else{
            this.commonUtils.presentToast('error', res.return_message);
            this.checkEmailError = true;
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
        }
      );
    }
  // unique email check end

  // onChange dropdown
  onChange(event){

  }

  // close modal
  closeModal() {
    this.modalController.dismiss(this.arrayList);
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
