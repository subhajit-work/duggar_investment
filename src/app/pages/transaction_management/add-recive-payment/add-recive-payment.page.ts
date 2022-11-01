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
  selector: 'app-add-recive-payment',
  templateUrl: './add-recive-payment.page.html',
  styleUrls: ['./add-recive-payment.page.scss'],
})

export class AddRecivePaymentPage implements OnInit, OnDestroy {
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
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  toggleShow;
  toggleShow1;
  interest_cycle = '1';
  accountTypeList;
  lenderGroupList;
  monthList;
  selectLoadingDependLender;
  onEditField = 'PUT';
  pymnt_status_field = '3';
  getlistAllResponse;
  lenderList1;
  borrowerList1;
  showTdsField:boolean = false;
  paymentOptions;
  payment_mode_cash = 'cash';
  payment_mode_cheque = 'cheque';
  payment_mode_online = 'online';
  showLoading;
  total_sum;
  account_branchs;
  transactionInfo;
  pdcsInfo;
  paymentreceivedInfo;
  rejectDate;

  // mat-accordion open start
  step = 0;
  editLoading;
  allEditData;

  setStep(index: number) {
    this.step = index;
  }

  // mat-accordion end

  // ------ init function call start -------
    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);


      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      


      // getlist data
      this.getlist('transaction_getlist');

      if( this.parms_action_name == 'edit' || this.parms_action_name == 'reject'){
        // form submit api edit
        this.form_api = 'interest_chequebounce/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'interest_chequebounce';
        this.model.interest_rate = "15";
      }

      // company by contact api
      this.companyByContact_api = 'get_company_from_group/'

      // file upload url
      this.uploadURL = `fileupload`;




      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');


      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();

      // this.paymentOptions = '1';
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
    this.model = {
      cash : {},
      cheque : {},
      online : {}
    };

    // today select
    let curentDate = new Date();
    this.rejectDate = moment(curentDate).format('DD/MM/YYYY');

    this.model.rejectDate = this.rejectDate;

    if( this.parms_action_name == 'edit' || this.parms_action_name == 'reject'){

      if(this.parms_action_name == 'edit'){
        this.actionHeaderText = 'Edit';
      }else if(this.parms_action_name == 'reject'){
        this.actionHeaderText = 'Reject';
      }
      this.onEditField = 'PUT';
      this.pymnt_status_field = '3';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_api).subscribe(
        (res:any) => {
          console.log("Edit data  res >", res.return_data);
          if(res.return_status > 0){
            this.editLoading = false;

            this.allEditData = res;

            // this.transactionInfo = res.return_data.transaction;
            // this.pdcsInfo = res.return_data.pdcs;
            // this.paymentreceivedInfo = res.return_data.paymentreceived;

            // this.model.interest_total_amount = res.return_data.total_amount;
            // this.model.interest_amount_pay_tds = res.return_data.tds_amt;
            // this.model.interest_amount_pay = res.return_data.interest_amount;
            // this.model.interest_pay_days = res.return_data.interest_pay_days;

            /* if(res.return_data.pay_date != undefined){
              this.model.setStartdate = moment(res.return_data.pay_date).format('DD/MM/YYYY');
            } */

            // this.paymentOptions = res.return_data.paymentreceived.payment_mode;

            if(this.parms_action_name == 'edit'){
              if( res.return_data.paymentreceived.payment_mode == 'cash' ){
                this.paymentOptions = '1';

                this.model.cheque = {};
                this.model.online = {};

                this.model.cash = {
                  setStartdate : moment(res.return_data.paymentreceived.pay_date).format('DD/MM/YYYY')
                };

              }else if( res.return_data.paymentreceived.payment_mode == 'cheque' ){
                this.paymentOptions = '2';

                this.model.cash = {};
                this.model.online = {};

                this.model.cheque = {
                  setStartdate : moment(res.return_data.paymentreceived.pay_date).format('DD/MM/YYYY'),
                  cheque_no : res.return_data.paymentreceived.intrest_cheque_no,
                  deposit_date : res.return_data.paymentreceived.deposit_date,
                  account_name : res.return_data.paymentreceived.account_name,
                  account_no : res.return_data.paymentreceived.account_no,
                  bank : res.return_data.paymentreceived.bank,
                  branch : res.return_data.paymentreceived.branch

                }
                
              }else if( res.return_data.paymentreceived.payment_mode == 'online' ){
                this.paymentOptions = '3';

                this.model.cash = {};
                this.model.cheque = {};

                this.model.online = {
                  setStartdate : moment(res.return_data.paymentreceived.pay_date).format('DD/MM/YYYY'),
                  account_name : res.return_data.paymentreceived.account_name,
                  account_no : res.return_data.paymentreceived.account_no,
                  bank : res.return_data.paymentreceived.bank,
                  branch : res.return_data.paymentreceived.branch,
                  bank_transaction_id : res.return_data.paymentreceived.bank_transaction_id
                }
              }
            }

            /* if(res.return_data.files.length > 0){
              this.files = res.return_data.files;
            } */
            /* if(res.return_data.cycle_month > 0){
              this.interest_cycle = '2';
            } */
            // console.log('pay date >', res.return_data.pay_date);
          }
        },
        errRes => {
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
    }

  }
  // ---------- init end ----------

  // array short desc order for interest_days
  sortArrayNumberDescOrder(a, b) {
    return  b.interest_days - a.interest_days;
  }

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


  //-------------------- pdc file upload start-------------------------
    pdcFiles: any = [];
    pdcUploadResponseProgress = false;
    
    // file upload
    pdcUploadFile(_type, e) {
      this.pdcUploadResponseProgress = true;
      // console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        this.pdcFiles = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.pdcFiles);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.pdcFiles);
        }  
      }
    }
  // pdc file upload end
  
  // .....  add lender/ borrower modal start ......
  async presentModal(_identifier, _url, _array, _type, _displayName, _id) {
    // indentife, url, array, type, display name, _id
    const modal = await this.modalController.create({
      component: AddTransactionModalPage,
      componentProps: { 
        identifier: _identifier,
        modalForm_url: _url,
        modalForm__type: _type,
        modalForm__displayName: _displayName,
        modalForm_select_Id: _id,
        allGetlistData: this.getlistAllResponse,
        modalForm_array: _array
      }
    });

    // modal data back to Component
    modal.onDidDismiss()
    .then((getdata) => {
      // console.log('getdata >>>>>', getdata);
      if(_identifier == 'lender_group_add'){
        this.lenderGroupList =  [...this.lenderGroupList]; //update array value
      }else if(_identifier == 'lender_single_add'){
        this.lenderList =  [...this.lenderList]; //update array value
        this.borrowerList = [...this.borrowerList]; //update array value
      }
      
    });

    return await modal.present();
  }
  // add lender/ borrower modal end 


  leder15G:any = {};
  borrowerTds:any = {};
  onChangeSingleLender(_item, _mainArray, _identifier){

    console.log("dropdown selected item onChangeSingleLender >", _item);
    console.log("dropdown selected _itemsArray >", _mainArray);
    console.log('_identifier >', _identifier);

    if(_identifier == 'lender_select'){
      _mainArray.forEach((element, index) => {
        if(_item == element.id){
          this.leder15G = element;
        }
      });
    }else{
      _mainArray.forEach((element, index) => {
        if(_item == element.id){
          this.borrowerTds = element;
        }
      });
    }

    if(_item){
      // console.log('element @@@@@@@@@@@@@@@@@@ >', this.leder15G);
      // console.log('elementborrowerTds @@@@@@@@@@@@@@@@@@ >', this.borrowerTds);

      if(this.leder15G.g15 == '0' && this.borrowerTds.tds_amt == '0'){
        this.showTdsField = false;
      }else if(this.leder15G.g15 == '0' && this.borrowerTds.tds_amt == '1'){
        this.showTdsField = true;
      }else if(this.leder15G.g15 == '1' && this.borrowerTds.tds_amt == '1'){
        this.showTdsField = false;
      }else if(this.leder15G.g15 == '1' && this.borrowerTds.tds_amt == '1'){
        this.showTdsField = false;
      }
    }else{
      this.showTdsField = false;
    }
    

    /* if(_identifier == 'lender_select'){
      this.borrowerList = _mainArray;
      this.borrowerList.forEach((element, index) => {
        if(_item == element.id){
          this.borrowerList.splice(index, 1);
        }
      });
      this.borrowerList = [...this.borrowerList]; //update dropdown array
    }else{
      this.lenderList = _mainArray;
      this.lenderList.forEach((element, index) => {
        if(_item == element.id){
          this.lenderList.splice(index, 1);
        }
      });
      this.lenderList = [...this.lenderList]; //update dropdown array
    } */

  }

  // select company
  OnChangeSelectLender(_item, _type){
    this.contactByCompany(this.companyByContact_api, _item , _type);
  }

  onChange(){
    
  }

  //contactByCompany
  contactByCompany = function(_url, _id , _type){
    if(_type == 'lenderGroup'){
      this.model.lender_id = null;
      this.lenderList = [];
      this.selectLoadingDependLender = true;
    }else{
      this.model.brrower_id = null;
      this.borrowerList = [];
      this.selectLoadingDepend = true;
    }
    this.selectLoadingDepend = true;
    this.contactByCompanySubscribe = this.http.get(_url +_id).subscribe(
      res => {
      console.log("contactByCompany res >", res);

      if(_type == 'lenderGroup'){
        this.lenderList = res.return_data.client;
        this.selectLoadingDependLender = false;
        this.selectLoadingDepend = false;
      }else{
        this.borrowerList = res.return_data.client;
        this.selectLoadingDepend = false;
        this.selectLoadingDependLender = false;
      }
    },
    errRes => {
      this.selectLoadingDepend = false;
      this.selectLoadingDependLender = false;
    }
    );
  }

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.getlistAllResponse = resData;
          this.selectLoading = false;
          /* console.log("transaction get list ggggggggggggggggg >>>>>>", resData); */
          this.accountList = resData.account_branchs;
          this.lenderList = resData.lenders;
          this.lenderList1 = resData.lenders;
          this.borrowerList = resData.brrowers;
          this.borrowerList1 = resData.brrowers;
          this.accountTypeList = resData.acc_type;
          this.lenderGroupList = resData.group;
          this.monthList = resData.cycle_month;

          // default account select
          if( this.parms_action_name == 'add'){
            resData.account_branchs.forEach(element => {
              if(element.main == "1"){
                this.model.account_branch = JSON.parse(element.id);
              }
            });
          }
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
    closeOnSelect: true,
    yearInAscending: true
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

  /* endDatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true
  }; */
  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // --- start date select ---
  getStartDate;
  onDateChangeStartDate(_item){
    console.log('_item  start date select >>>', _item);

    this.getStartDate = _item;
    // this.model.start_date = _item;
    this.model.end_date = '';
    this.endDatePickerObj = {
      dateFormat: 'DD/MM/YYYY',
      fromDate:moment(_item).format('YYYY-DD-MM'),
      closeOnSelect: true,
      yearInAscending: true
    };
  }

  //----- end date select------
  noOfDays;
  onDateChangeEndDate(_item){
    console.log('_item end  date select >>>', _item);

    let start_date = moment(this.getStartDate, 'DD/MM/YYYY');
    let end_date = moment(_item, 'DD/MM/YYYY');
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
          this.files = [];
          this.pdcFiles = [];
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){

            this.router.navigate(['/recived-payment']);

          }

          // this.notifier.notify( type, 'aa' );
          
          if( this.parms_action_name == 'add'){
            form.reset();
          }
          
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
  selectItemList
  claculateValue;
  calculateTds;

//..... pay interest divided calculation end......

//----------- reload page start ------------
reloadPage(){
  if( this.parms_action_name == 'add'){
    this.files = [];

    this.interest_cycle = '1';
    this.model.tdss = 10;
  }else{
    
    if(this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';
    }else if(this.parms_action_name == 'reject'){
      this.actionHeaderText = 'Reject';
    }

    this.onEditField = 'PUT';
    this.pymnt_status_field = '3';

    // this.transactionInfo = this.allEditData.return_data.transaction;
    // this.pdcsInfo = this.allEditData.return_data.pdcs;
    // this.paymentreceivedInfo = this.allEditData.return_data.paymentreceived;

    // this.model.interest_total_amount = this.allEditData.return_data.total_amount;
    // this.model.interest_amount_pay_tds = this.allEditData.return_data.tds_amt;
    // this.model.interest_amount_pay = this.allEditData.return_data.interest_amount;
    // this.model.interest_pay_days = this.allEditData.return_data.interest_pay_days;

    if(this.allEditData.return_data.pay_date != undefined){
      //this.model.setStartdate = moment(this.allEditData.return_data.pay_date).format('DD/MM/YYYY');
    }
    
    if(this.parms_action_name == 'edit'){
      if( this.allEditData.return_data.paymentreceived.payment_mode == 'cash' ){
        this.paymentOptions = '1';

        this.model.cheque = {};
        this.model.online = {};

        this.model.cash = {
          setStartdate : moment(this.allEditData.return_data.paymentreceived.pay_date).format('DD/MM/YYYY')
        };

      }else if( this.allEditData.return_data.paymentreceived.payment_mode == 'cheque' ){
        this.paymentOptions = '2';

        this.model.cash = {};
        this.model.online = {};

        this.model.cheque = {
          setStartdate : moment(this.allEditData.return_data.paymentreceived.pay_date).format('DD/MM/YYYY'),
          cheque_no : this.allEditData.return_data.paymentreceived.intrest_cheque_no,
          deposit_date : this.allEditData.return_data.paymentreceived.deposit_date,
          account_name : this.allEditData.return_data.paymentreceived.account_name,
          account_no : this.allEditData.return_data.paymentreceived.account_no,
          bank : this.allEditData.return_data.paymentreceived.bank,
          branch : this.allEditData.return_data.paymentreceived.branch

        }
        
      }else if( this.allEditData.return_data.paymentreceived.payment_mode == 'online' ){
        this.paymentOptions = '3';

        this.model.cash = {};
        this.model.cheque = {};

        this.model.online = {
          setStartdate : moment(this.allEditData.return_data.paymentreceived.pay_date).format('DD/MM/YYYY'),
          account_name : this.allEditData.return_data.paymentreceived.account_name,
          account_no : this.allEditData.return_data.paymentreceived.account_no,
          bank : this.allEditData.return_data.paymentreceived.bank,
          branch : this.allEditData.return_data.paymentreceived.branch,
          bank_transaction_id : this.allEditData.return_data.paymentreceived.bank_transaction_id
        }
      }
    }
    
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

