import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpEventType } from '@angular/common/http';

 
import { CommonUtils } from '../../../services/common-utils/common-utils';
import { AddTransactionModalPage } from '../../modal/add-transaction-modal/add-transaction-modal.page';

/* tslint:disable */ 
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})

export class AddEmployeePage implements OnInit, OnDestroy {
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private storage: Storage,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private alertController : AlertController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  // variable declartion section
  model: any = {};
  private getListSubscribe: Subscription;
  private uploadSubscribe: Subscription;
  private contactByCompanySubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  curentDate;
  // select checkbox end

//--------------  getlist data fetch start -------------
  transaction_id;
  account
  accountList;
  lender
  lenderList;
  borrower;
  borrowerList;
  principle;
  interest;
  setStartdate;
  setEnddate;
  contact_by_company;
  servicesList;
  selectLoading;
  selectLoadingDepend;
  groupList;
  form_submit_text = 'Submit';
  form_api;
  companyByContact_api;
  uploadURL;
  interestCycle = '1';
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  toggleShow;
  companyList;
  countryList;
  stateList;
  titleList;
  cityList;
  roleList;
  managerList;
  onEditField = 'PUT';
  panelOpenState;
  editLoading;
  allEditData;


  address_isswitch;
  address_id;
  address_is_default;
  address_address_line1;
  address_address_line2;
  address_country_id;
  address_state;
  address_city;
  address_pincode;
  address_common;

  // mat-accordion open start
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  // mat-accordion end

  // ------ init function call start ------

    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      // getlist data
      this.getlist('employee_getlist');

      if( this.parms_action_name == 'edit'){
        // form submit api edit
        this.form_api = 'employee/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'employee'
      }

      // company by contact api
      this.companyByContact_api = 'contact_bycompany/'

      // file upload url
      this.uploadURL = `fileupload?identifier=internalsupportticket`;

      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');


      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();
    }

    // init
    ngOnInit() {
    //  this.commonFunction();
    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end
  
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';
      this.onEditField = 'PUT';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          if(res.return_status > 0){
            this.model = {
              prefix : res.return_data.prefix,
              fname : res.return_data.fname,
              mname : res.return_data.mname,
              lname : res.return_data.lname,
              dob : moment(res.return_data.dob).format('DD/MM/YYYY'),
              profile : res.return_data.profile,
              pan_no : res.return_data.pan_no,
              employee_id : res.return_data.employee_id,
              bloodgroup : res.return_data.bloodgroup,
              enable : res.return_data.status,
              is_invoice : res.return_data.is_invoice,
              gmail_id : res.return_data.gmail_id,
              address_line1 : res.return_data.address_line1,
              country_id : res.return_data.country_id,
              state : res.return_data.state,
              city : res.return_data.city,
              pincode : res.return_data.pincode,
              username : res.return_data.username,
              password : res.return_data.password,
              role : res.return_data.user_info[0].role[0].id,
              issuperadmin : res.return_data.issuperadmin,
              start_date :  moment(res.return_data.start_date).format('DD/MM/YYYY'),
              manager_id : res.return_data.manager_id,
              // gmail_otp : res.return_data.gmail_otp,
              // isswitch : res.return_data.isswitch,
              // id : res.return_data.id,
              // is_default : res.return_data.is_default,
              // default : res.return_data.is_default,
              // address_line2 : res.return_data.address_line2,
              // common : res.return_data.common,
            };
            this.model.username = res.return_data.user_info[0].email;
            this.model.password = res.return_data.user_info[0].password;
            this.model.is_superadmin = res.return_data.user_info[0].is_superadmin;

            /*this.model.role = [];
            if(res.return_data.user_info[0].role){
              res.return_data.user_info[0].role.forEach(element => {
                this.model.role.push(element.id);
              });
            }*/
            
            // edit data
            this.allEditData = res;
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
      this.reloadPage();
    }
    this.model.dob =  this.setStartdate;
    
  }
  // ---------- init end ----------

  // ----------------- file upload start -------------
    files: any = [];
    uploadResponseProgress;
    
    // file upload
    uploadFile(_type, e) {
      console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        this.files = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.files);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.files);
        }  
      }
    }
    // goForUpload call
    goForUpload(_url, _getvalue, _filesArray){
      const fd = new FormData();
      fd.append('files', _getvalue, _getvalue.name);

      this.uploadSubscribe = this.http.post<any>(_url, fd, {
        reportProgress: true,
        observe: 'events'
        }).subscribe( event => {
          if(event.type === HttpEventType.UploadProgress){
            this.uploadResponseProgress = Math.round( event.loaded / event.total * 100 );
          }else if(event.type === HttpEventType.Response){
            // console.log('event.body >>>>>', event.body);
            event.body.return_data_mobile.files.id = '';
            _filesArray.push(event.body.return_data_mobile.files);
            this.uploadResponseProgress = 0;
          }
      })
    }
  // file upload end

  
  // ..... open modal start ......
  async presentModal(_identifier) {
    const modal = await this.modalController.create({
      component: AddTransactionModalPage,
      componentProps: { 
        identifier: _identifier,
        account: this.accountList,
        grouplist: this.groupList,
        company_id: this.account,
        contactBycompany: this.contact_by_company
      }
    });

    // modal data back to Component
    modal.onDidDismiss()
    .then((getdata) => {
      if(getdata.role == 'company_id'){
        this.accountList =  [...this.accountList]; //update array value
      }else if(getdata.role == 'contact_id'){
        this.contact_by_company = [...this.contact_by_company]; //update array value
      }
      
    });

    return await modal.present();
  }
  // open modal end 

  onChange(_item){
    console.log("dropdown selected item >", _item);
  }

  // select company
  OnChangeSelect(_item){
    this.contactByCompany(_item );
  }

  //contactByCompany
  contactByCompany = function( _id ){
    this.selectLoadingDepend = true;
    this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+_id).subscribe(
      res => {
      this.selectLoadingDepend = false;
      console.log("contactByCompany res >", res);
      this.contact_by_company = res.return_data.contact
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;
          this.titleList = resData.prefix;
          this.countryList = resData.country;
          this.stateList = resData.state;
          this.cityList = resData.city;
          this.roleList = resData.roles;
          this.managerList = resData.manager;
          
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// getlist data fetch end

// -----datepicker start------
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }
  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
    //inputDate: new Date('2018-08-10'), // default new Date()
  };

  onDateChangePriDate(_item){
    console.log('onDateChangePriDate >', _item);
    // this.model.start_date = _item;
    this.model.start_date = '';
    this.startdatePickerObj = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      fromDate:moment(_item).format('YYYY-DD-MM'),
      closeOnSelect: true,
      yearInAscending: true
    };
  }

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // --- start date select ---
  selectCycleDate;
  getStartDate;
  onDateChangeStartDate(_item){

    console.log('_item  start date select >>>', _item);
    // console.log("aaaaaaaaaaaaaaaaaaa1", moment(new Date()).format('YYYY-MM-DD'));

    this.getStartDate = _item;
    // this.model.start_date = _item;
    this.model.end_date = '';
    this.endDatePickerObj = {
      dateFormat: 'DD/MM/YYYY',
      fromDate:moment(_item).format('YYYY-DD-MM'),
      closeOnSelect: true,
      yearInAscending: true
    };


    //---- set day + count add start----
      this.selectCycleDate = new Date();
      this.selectCycleDate.setDate( this.selectCycleDate.getDate() + 3 );
      // alert('this.date >'+this.selectCycleDate);

      this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');
    //---- set day + count add end----


  }

  //----- end date select------
  noOfDays;
  onDateChangeEndDate(_item){

    console.log('_item end  date select >>>', _item);
    console.log('_item start  date select >>>', this.getStartDate);

    let start_date = moment(this.getStartDate, 'DD/MM/YYYY');
    let end_date = moment(_item, 'DD/MM/YYYY');

    if(this.getStartDate == undefined){
      start_date = moment(this.setStartdate, 'DD/MM/YYYY');
    }else{
      start_date = moment(this.getStartDate, 'DD/MM/YYYY');
    }

    this.model.no_of_days = end_date.diff(start_date, 'days');

    console.log('this.noOfDays >>>>>>>', this.model.no_of_days );

  }

  //----- no of day select ---
  onChangeNoOfDay(_item){
    console.log('no of day select >>>', _item);
    console.log('this.getStartDate >>>', this.getStartDate);
  }

// datepicker  end

// ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Save';
  form_submit_text_save_another = 'Save & Add Another' ;

  // click button type 
  clickButtonType( _buttonType ){
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);
    
    if(this.clickButtonTypeCheck == 'Save'){
      this.form_submit_text_save = 'Submitting';
    }else{
      this.form_submit_text_save_another = 'Submitting';
    }

    this.form_submit_text = 'Submitting';

    // get form value
    let fd = new FormData();
    if(this.fileVal) {
    // normal file upload
    fd.append("profile", this.fileVal, this.fileVal.name);
    }else{
      fd.append("profile", '');
    }
   

    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {

        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = '';
        console.log("add form response >", response);

        if(response.return_status > 0){
          
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){

            this.router.navigate(['/employee-list']);

          }

          // this.notifier.notify( type, 'aa' );
    
          if( this.parms_action_name == 'add'){
             this.files = [];
             this.model.profile = '';
             this.model.profile2 = '';
            // form.reset();
            this.reloadPage();
          }
          
        }else{
          // this.commonUtils.presentToast('error', response.return_message);
        }
      },
      errRes => {
        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = '';
      }
    );

  }
// form submit end

// delete uploaded file Aleart Start

  @ViewChild('fileInput') fileInputVariable: ElementRef;

  async deleteAlertConfirm(_itemsArray, _index) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Do you really want to delete selected item ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            // console.log('Confirm Okay');
            _itemsArray.splice(_index, 1);
            this.fileInputVariable.nativeElement.value = "";

          }
        }
      ]
    });
 
    await alert.present();
  }
// delete  Aleart End

// Normal file upload
  fileVal;
  normalFileUpload(event) {
    this.fileVal =  event.target.files[0];
    this.model.profile =  event.target.files[0].name;
  }
  fileCross(_item1){
    this.model.profile = '';
    this.model.profile2 = '';
  }
// Normal file upload end

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
      this.files = [];
      this.model = {
        enable : 'true',
        is_invoice : 'true',
        issuperadmin : 'true'
      };
    }else{
      this.model = {
        prefix : this.allEditData.return_data.prefix,
        fname : this.allEditData.return_data.fname,
        mname : this.allEditData.return_data.mname,
        lname : this.allEditData.return_data.lname,
        dob : moment(this.allEditData.return_data.dob).format('DD/MM/YYYY'),
        profile : this.allEditData.return_data.profile,
        pan_no : this.allEditData.return_data.pan_no,
        employee_id : this.allEditData.return_data.employee_id,
        bloodgroup : this.allEditData.return_data.bloodgroup,
        enable : this.allEditData.return_data.status,
        is_invoice : this.allEditData.return_data.is_invoice,
        gmail_id : this.allEditData.return_data.gmail_id,
        address_line1 : this.allEditData.return_data.address_line1,
        country_id : this.allEditData.return_data.country_id,
        state : this.allEditData.return_data.state,
        city : this.allEditData.return_data.city,
        pincode : this.allEditData.return_data.pincode,
        username : this.allEditData.return_data.username,
        password : this.allEditData.return_data.password,
        role : this.allEditData.return_data.user_info[0].role[0].id,
        issuperadmin : this.allEditData.return_data.issuperadmin,
        start_date :  moment(this.allEditData.return_data.start_date).format('DD/MM/YYYY'),
        manager_id : this.allEditData.return_data.manager_id,
        // gmail_otp : res.return_data.gmail_otp,
        // isswitch : res.return_data.isswitch,
        // id : res.return_data.id,
        // is_default : res.return_data.is_default,
        // default : res.return_data.is_default,
        // address_line2 : res.return_data.address_line2,
        // common : res.return_data.common,
      };
      this.model.username = this.allEditData.return_data.user_info[0].email;
      this.model.password = this.allEditData.return_data.user_info[0].password;
      this.model.is_superadmin = this.allEditData.return_data.user_info[0].is_superadmin;

      /*this.model.role = [];
      if(this.allEditData.return_data.user_info[0].role){
        this.allEditData.return_data.user_info[0].role.forEach(element => {
          this.model.role.push(element.id);
        });
      }*/
    }
  }

  // reload alert
  async reloadPageAlert() {
    const reload = await this.alertController.create({
      header: 'Reload',
      message: 'Do you really want to Reload?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            // console.log('Confirm Okay');
            this.reloadPage();

          }
        }
      ]
    });

    await reload.present();
  }
// reload page end


// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.contactByCompanySubscribe !== undefined){
      this.contactByCompanySubscribe.unsubscribe();
    }
    if(this.uploadSubscribe !== undefined){
      this.uploadSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}



