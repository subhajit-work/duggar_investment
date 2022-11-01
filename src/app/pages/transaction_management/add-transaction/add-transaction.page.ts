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
import { AddCommonModelPage } from '../../modal/add-common-model/add-common-model.page';
import { environment } from '../../../../environments/environment';

/* tslint:disable */ 
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
})

export class AddTransactionPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  
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
  toggleShow = true;
  interest_cycle = '1';
  accountTypeList;
  lenderGroupList;
  monthList;
  selectLoadingDependLender;
  onEditField = 'PUT';
  fiscalYearsId;
  getlistAllResponse;
  lenderList1;
  borrowerList1;
  lenderGroupList1;
  showTdsField:boolean = false;
  showBrokerageTdsField:boolean = false;
  gracedayList;
  getGraceDayCount;
  fiscalYearList;
  fiscal_years;
  brokerage_tds;
  interest_tds;
  editLoading;
  allEditData;
  transactionStatus;
  is_renew = '1';
  show_transaction_id;
  fiscal_years_id_get;

  permissionArray;
  loggedin_user_id;

  // ------ init function call start -------
    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);


      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      


      // getlist data
      this.getlist('transaction_getlist');

      if( this.parms_action_name == 'edit' || this.parms_action_name == 'renew'){
        // form submit api edit
        this.form_api = 'transaction/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'transaction';
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

      // pds multiple
      this.model.pages = [
        {
          "is_default":true,
          "file_model_pdc": []
        }
      ];

      // disable date call
      this.dateDisable();
    }

    // init
    ngOnInit() {
    //  this.commonFunction();
    }

    ionViewWillEnter() {
      // this.commonFunction();

      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      if( this.parms_action_name == 'add'){
        //----- menu permission data start-----
        this.commonUtils.menuPermissionObservable.subscribe(data => {
          if(data){
            let getpermissionArray = data[this.router.url];
            console.log('permissionAccessData (all Data )>>>>>>>>>>>>', data);
            console.log('permissionAccessData >>>>>>>>>>>>', getpermissionArray);
            if(getpermissionArray){
              if(getpermissionArray.page_permissions != undefined){

                for(let permission of getpermissionArray.page_permissions) {
                  // if(something_wrong) break;
                  if(permission.permission_name == 'access' && permission.permission_access > 0){
                    this.permissionArray = getpermissionArray.page_permissions;
                    this.loggedin_user_id = getpermissionArray.loggedin_id;
                    // console.log('this.permissionArray >', this.permissionArray);
                    // console.log('=== HAVE Permission ===');
                    this.commonFunction();
                    break;
                  }else{
                    console.log('-------No Permission--------');
                    this.router.navigateByUrl('/error');
                  }
                }

              }else{
                console.log('-------No Permission--------');
                this.router.navigateByUrl('/error');
              }
            }
            
          }
        })
        //menu permission data end-----
      }else{
        this.commonFunction();
      }
    }
  // init function call end
  
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'edit' || this.parms_action_name == 'renew'){

      if(this.parms_action_name == 'edit' ){
        this.actionHeaderText = 'Edit';
      }else if(this.parms_action_name == 'renew'){
        this.actionHeaderText = 'Renew';
      }

      this.onEditField = 'PUT';

      this.editLoading = true;

      //edit data call
      this.editDataSubscribe = this.http.get(this.form_api).subscribe(
        (res:any) => {
          console.log("Edit data  res >", res.return_data);
          if(res.return_status > 0){

            // edit data
            this.allEditData = res;

            this.editLoading = false;

            if(res.return_data.pdcs.length > 0){
              this.model = {
                account_branch : JSON.parse(res.return_data.account_branch_id),
                short_code : res.return_data.short_code,
                lgroup_id :  JSON.parse(res.return_data.lgroup_id),
                lender_id :  JSON.parse(res.return_data.lender_id),
                bgroup_id :  JSON.parse(res.return_data.bgroup_id),
                brrower_id :  JSON.parse(res.return_data.brrower_id),
                principle : res.return_data.principle,
                pri_receive_date : res.return_data.pri_receive_date,
                interest_rate : res.return_data.interest_rate,
                interestCycle : res.return_data.interestCycle,
                cycle_days : res.return_data.cycle_days,
                cycle_month : JSON.parse(res.return_data.cycle_month),
                end_date : moment(res.return_data.end_date).format('DD/MM/YYYY'),
                prncpl_rtrn_dt : moment(res.return_data.prncpl_rtrn_dt).format('DD/MM/YYYY'),
                no_of_days : res.return_data.no_of_days,
                brokerage : res.return_data.brokerage,
                bank_acc : res.return_data.pdcs[0].bank_acc,
                acc_type :  JSON.parse(res.return_data.pdcs[0].acc_type),
                routing : res.return_data.pdcs[0].routing,
                bank_name : res.return_data.pdcs[0].bank_name,
                branch_name : res.return_data.pdcs[0].branch_name,
                docket : res.return_data.pdcs[0].docket,
                cheque_no : res.return_data.pdcs[0].cheque_no,
                check_date : moment(res.return_data.pdcs[0].check_date).format('DD/MM/YYYY'),
                check_amt : res.return_data.pdcs[0].check_amt,
                comment : res.return_data.pdcs[0].comment
              }
            }else{
              this.model = {
                account_branch : JSON.parse(res.return_data.account_branch_id),
                short_code : res.return_data.short_code,
                lgroup_id :  JSON.parse(res.return_data.lgroup_id),
                lender_id :  JSON.parse(res.return_data.lender_id),
                bgroup_id :  JSON.parse(res.return_data.bgroup_id),
                brrower_id :  JSON.parse(res.return_data.brrower_id),
                principle : res.return_data.principle,
                pri_receive_date : res.return_data.pri_receive_date,
                interest_rate : res.return_data.interest_rate,
                interestCycle : res.return_data.interestCycle,
                cycle_days : res.return_data.cycle_days,
                cycle_month : JSON.parse(res.return_data.cycle_month),
                start_date :  moment(res.return_data.start_date).format('DD/MM/YYYY'),
                end_date : moment(res.return_data.end_date).format('DD/MM/YYYY'),
                prncpl_rtrn_dt : moment(res.return_data.prncpl_rtrn_dt).format('DD/MM/YYYY'),
                no_of_days : res.return_data.no_of_days,
                brokerage : res.return_data.brokerage
              }
            }

            if(this.parms_action_name == 'edit' ){
              this.model.start_date =  moment(res.return_data.start_date).format('DD/MM/YYYY');
              lgroup_id :  JSON.parse(res.return_data.lgroup_id),
              this.model.transaction_status =  JSON.parse(res.return_data.transaction_status);
              this.model.brokerage_status =  JSON.parse(res.return_data.brokerage_status);
            }else if(this.parms_action_name == 'renew'){
              this.model.start_date =  this.setStartdate;
              this.model.transaction_status =  JSON.parse(res.return_data.transaction_status);
              this.model.brokerage_status =  JSON.parse(res.return_data.brokerage_status);

              // ----- original date format convert start -----
              let myFormatDate = this.setStartdate.split(" ")[0].split("/");
              let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
              // original date format convert end

              this.model.end_date = '';
              this.model.prncpl_rtrn_dt = '';
              this.model.no_of_days = '';

              //---- set day + count add start----
              //console.log('res.return_data.cycle_days***********************>', res.return_data.cycle_days);

              //console.log('res.return_data.cycle_month***********************>', res.return_data.cycle_month);

                this.selectCycleDate = new Date(_mynewdate);
                // this.selectCycleDate.setDate( this.selectCycleDate.getDate() + 3 );
      
                // alert('this.date >'+this.selectCycleDate);

                if(res.return_data.cycle_month > 0){
                  this.selectCycleDate.setDate( this.selectCycleDate.getDate() + (parseInt(res.return_data.cycle_month ) * 30));
                  this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');
                  this.model.prncpl_rtrn_dt =  moment(this.selectCycleDate).format('DD/MM/YYYY');
                }else{
                  this.selectCycleDate.setDate( this.selectCycleDate.getDate() + parseInt(res.return_data.cycle_days));
                  this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');
                  this.model.prncpl_rtrn_dt =  moment(this.selectCycleDate).format('DD/MM/YYYY');
                }
                this.model.no_of_days = res.return_data.no_of_days;

            }

            // fiscalYearsId
            this.fiscalYearsId = res.return_data.fiscal_years_id;
            
            this.files = [];
            if(res.return_data.files.length > 0){
              // this.files = res.return_data.files;
              res.return_data.files.forEach(val => {
                val.file_id = val.id;
                this.files.push(val);
              });
            }
            this.file_model_pdc = [];
            /* if(res.return_data.file_model_pdc.length > 0){
              // this.file_model_pdc = res.return_data.file_model_pdc;
              res.return_data.file_model_pdc.forEach(val => {
                val.file_id = val.id;
                this.file_model_pdc.push(val);
              });
            } */
            if(res.return_data.cycle_month > 0){
              this.interest_cycle = '2';
            }
            this.fiscal_years = res.return_data.fiscal_years;
            this.show_transaction_id = res.return_data.dgr_transaction_id;

            // interest tds field show/hide start
            if(res.return_data.lender.g15 == '0' && res.return_data.brrower.tds_amt == '0'){
              this.showTdsField = false;
            }else if(res.return_data.lender.g15 == '0' && res.return_data.brrower.tds_amt == '1'){
              this.showTdsField = true;
              this.model.tdss = res.return_data.tds;
            }else if(res.return_data.lender.g15 == '1' && res.return_data.brrower.tds_amt == '1'){
              this.showTdsField = false;
            }else if(res.return_data.lender.g15 == '1' && res.return_data.brrower.tds_amt == '1'){
              this.showTdsField = false;
            }else{
              this.showTdsField = false;
            }
            // tds field show/hide end


            //brokerage tds field show/hide start
            if(res.return_data.brrower.tds_amt == '1'){
              this.showBrokerageTdsField = true;
              this.model.brokerage_tds = res.return_data.brokerage_tds;
            }else{
              this.showBrokerageTdsField = false;
            }
            
            // contact by company call
            if(this.model.lgroup_id){
              this.OnChangeSelectLender(this.model.lgroup_id, 'lenderGroup');
              this.model.lender_id =  JSON.parse(res.return_data.lender_id);

            }
            if(this.model.bgroup_id){
              this.OnChangeSelectLender(this.model.bgroup_id, 'browerGroup');
              this.model.brrower_id =  JSON.parse(res.return_data.brrower_id);
              // not select same lender and brrower group end
            }

            if(res.return_data.pdcs.length > 0){
              this.model.pages = res.return_data.pdcs;
              res.return_data.pdcs.forEach(element => {
                if(element.check_date){
                  element.check_date =  moment(element.check_date).format('DD/MM/YYYY');
                }
              });
              this.toggleShow = false;
            }else{
              // pds multiple
              this.model.pages = [
                {
                  "is_default":true,
                  "file_model_pdc": []
                }
              ];
            }

          }
        },
        errRes => {
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
      this.reloadPage();
    }

    
    
  }
  // ---------- init end ----------

  // ----------------- file upload start -------------
    files: any = [];
    uploadResponseProgress;
    onlyFileProgress = false;
    
    // file upload
    uploadFile(_type, e) {
      this.onlyFileProgress = true;
      console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        this.files = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.files, '');
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.files, '');
        }  
      }
    }

    // goForUpload call
      goForUpload(_url, _getvalue, _filesArray, _item){
        const fd = new FormData();
        fd.append('files', _getvalue, _getvalue.name);

        if(_item){
          _item.uploadResponseProgressItem = Math.round( 500 / 10000 * 100 );
        }else{
          this.uploadResponseProgress = Math.round( 500 / 10000 * 100 );
        }
        
        this.uploadSubscribe = this.http.post<any>(_url, fd, {
          reportProgress: true,
          observe: 'events'
          }).subscribe( event => {
            if(event.type === HttpEventType.UploadProgress){

              // console.log('event p>>>>>>', event);

              if(_item){
                _item.uploadResponseProgressItem = Math.round( event.loaded / event.total * 100 );
              }else{
                this.uploadResponseProgress = Math.round( event.loaded / event.total * 100 );
              }
            }else if(event.type === HttpEventType.Response){
              // console.log('event.body >>>>>', event.body);
              event.body.return_data_mobile.files.id = '';
              _filesArray.push(event.body.return_data_mobile.files);
              
              if(_item){
                _item.uploadResponseProgressItem = 0;
              }else{
                this.uploadResponseProgress = 0;
              }

              // console.log('this.files >>>>>>>>>>>>>>>>>>>>>>>', this.files);
               console.log('this.file_model_pdc >>>>>>>>>>>>>>>>>>>>>>>aa', this.file_model_pdc);
              
            }
        })
      }
    // file upload end


  //-------------------- pdc file upload start-------------------------
    file_model_pdc: any = [];
    pdcUploadResponseProgress = false;
    
    // file upload
    pdcUploadFile(_type, e, _items, _item) {
      this.onlyFileProgress = false;
      this.pdcUploadResponseProgress = true;
      // console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        _item.file_model_pdc = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, _item.file_model_pdc, _item);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, _item.file_model_pdc, _item);
          
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

    // array delete item start
    if(this.model.lgroup_id == null && this.model.bgroup_id == null){
      this.borrowerList = this.lenderList1;
      this.lenderList = this.lenderList1;
      if(_identifier == 'lender_select'){
        this.borrowerList = this.borrowerList.filter(item => {
          return item.id !== _item;
        })
      }else{
        this.lenderList = this.lenderList.filter(item => {
          return item.id !== _item;
        })
      }
    }
    // array delete item end


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

      // brokerage tds show
      if(this.borrowerTds.tds_amt == '1'){
        this.showBrokerageTdsField = true;
      }else{
        this.showBrokerageTdsField = false;
      }
      
    }else{
      this.showTdsField = false;
      this.showBrokerageTdsField = false;
    }

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

      // not select same lender and brrower group start
      this.lenderGroupList = this.lenderGroupList1;
      this.lenderGroupList = this.lenderGroupList.filter(item => {
        return item.id !== _id;
      })
      // not select same lender and brrower group end


      // same lender and brrower not slect
      if(this.model.lgroup_id == this.model.bgroup_id){
        this.model.bgroup_id = null;
        this.model.lgroup_id = null;
        this.commonUtils.presentToast('error', "You can't select same Lander and Borrower");
        this.lenderGroupList = this.lenderGroupList1;
      }
      // end

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
          this.lenderGroupList1 = resData.group;
          this.monthList = resData.cycle_month;
          this.gracedayList = resData.graceday;
          this.fiscal_years = resData.fiscalyear.name;
          this.fiscal_years_id_get = resData.fiscalyear.id;
          this.transactionStatus = resData.transaction_status;

          this.interest_tds = resData.interest_tds;
          this.brokerage_tds = resData.brokerage_tds;

          // default account select
          if( this.parms_action_name == 'add'){

            // fiscalYearsId
            this.fiscalYearsId = resData.fiscalyear.id;

            this.accountList.forEach(element => {
              if(element.main == "1"){
                this.model.account_branch = JSON.parse(element.id);
                this.model.short_code = element.short_code;
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

// =================================== datepicker start =====================================
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }

  // particular day disable
  disabledDates = [    
    new Date('2019-7-14'), // Short format
  ];

  startdatePickerObj:any = {};
  dateDisable(){
    // let myDate = new Date();

    // let getdd = myDate.getDate();
    // let getmm = myDate.getMonth()+1; 
    // let getyyyy = myDate.getFullYear();

    // disableFormDate = getyyyy + '-' + getmm + '-' + getdd;

    // ----- form date disable start ----
    let disableFormStartDate = new Date();
    let financial_day = new Date();
    let setDay = financial_day.setDate(1);
    let setMonth = financial_day.setMonth(3);
    let financial_disableStartDateFrom = moment(financial_day).format('YYYY-MM-DD');
    console.log('setMonth >>>>>>>>>>>>1', financial_day);
    console.log('disableFormStartDate >>>>>>>>>>>>1', financial_disableStartDateFrom);
    disableFormStartDate.setDate( disableFormStartDate.getDate() - 30);

    let disableStartDateFrom = moment(disableFormStartDate).format('YYYY-MM-DD');
    console.log("disableToDateSelect  FROM>", disableStartDateFrom);    
    // form date disable end

    // ----- form date disable start ----
    let disableTOStartDate = new Date();
    disableTOStartDate.setDate( disableTOStartDate.getDate() + 31);
    let disableTOStartDateTo = moment(disableTOStartDate).format('YYYY-MM-DD');
    console.log("disableTOStartDateTo  TO>", disableTOStartDateTo);    
    // form date disable end


    this.startdatePickerObj = {
      dateFormat: 'DD/MM/YYYY',
      closeOnSelect: true,
      yearInAscending: true,
      // fromDate: new Date(disableStartDateFrom),
      fromDate: new Date(financial_disableStartDateFrom),
      toDate: new Date(disableTOStartDateTo)
      // disabledDates: this.disabledDates
    };


  }
 
  

  onDateChangePriDate(_item){
    console.log('onDateChangePriDate >', _item);

    // ----- original date format convert start -----
      let myFormatDate = _item.split(" ")[0].split("/");
      let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
    // original date format convert end

    // this.model.start_date = _item;
    this.model.start_date = '';
    this.startdatePickerObj = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      // fromDate:moment(_item).format('YYYY-DD-MM'),
      fromDate: new Date(_mynewdate),
      closeOnSelect: true,
      yearInAscending: true
    };
  }

  /* endDatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true
  }; */

  /* endDatePickerObj:any = {
    inputDate: new Date('2018-08-10'),
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }; */

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  principleReturnDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // radio button change
  
  radioButtonChange(_item){
    // if( this.parms_action_name == 'add'){
      if(_item){
        console.log('radioButtonChange >', _item);
        this.model.cycle_days = '';
        this.model.cycle_month = null;
        this.model.end_date = '';
        this.model.no_of_days = '';
        this.model.prncpl_rtrn_dt = '';
      }
    // }
  }

  // --- start date select ---
  getStartDate;
  onDateChangeStartDate(_item){
    if(_item){
      this.model.cycle_days = '';
      this.model.cycle_month = null;
      this.model.end_date = '';
      this.model.prncpl_rtrn_dt = '';
      this.model.no_of_days = '';

      // ----- original date format convert start -----
        let myFormatDate = _item.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end
  
      console.log('_item  start date select endDatePickerObj >>>', _item);
      // console.log("aaaaaaaaaaaaaaaaaaa1", moment(new Date()).format('YYYY-MM-DD'));
  
      this.getStartDate = _item;
      // this.model.start_date = _item;
  
      this.endDatePickerObj = {
        dateFormat: 'DD/MM/YYYY',
        // fromDate:moment(_item).format('YYYY-DD-MM'),
        fromDate: new Date(_mynewdate),
        closeOnSelect: true,
        yearInAscending: true
      };
    }
  }

  //----- end date select------
  noOfDays;
  onDateChangeEndDate(_cylceDay, _item){

    console.log('_item end  date _cylceDay @>>>', _cylceDay);
    console.log('_item end  date select @>>>', _item);
    console.log('_item start  date select >>>', this.getStartDate);

    let start_date = moment(this.getStartDate, 'DD/MM/YYYY');
    let end_date = moment(_item, 'DD/MM/YYYY');

    if(this.getStartDate == undefined){
      start_date = moment(this.setStartdate, 'DD/MM/YYYY');
    }else{
      start_date = moment(this.getStartDate, 'DD/MM/YYYY');
    }

    // this.model.no_of_days = end_date.diff(start_date, 'days');

    let getNoOfDays = end_date.diff(start_date, 'days');

    // console.log('this.noOfDays >>>>>>>', this.model.no_of_days );
    // console.log('getNoOfDays =====>', getNoOfDays);

    // grace day add
    for(let i = 0; i < this.gracedayList.length; i++){

      if(parseInt(this.gracedayList[i].start_day) <= _cylceDay && parseInt(this.gracedayList[i].end_day) >= _cylceDay){
        this.getGraceDayCount = this.gracedayList[i].increase_day;
        console.log('this.getGraceDayCount ===========%%%%%%%>', this.getGraceDayCount);

        // this.model.no_of_days = getNoOfDays + parseInt(this.getGraceDayCount);

        this.model.no_of_days = parseInt(_cylceDay) + parseInt(this.getGraceDayCount);

        console.log('this.model.no_of_days===========######>', this.model.no_of_days);


        // console.log('this.gracedayList[i].end_day >>>>>>>>>>>>>@@@@ >', this.gracedayList[i].increase_day);
        // console.log('this.noOfDays >>>>>>>', this.model.no_of_days );
        break;
        // return true;
      }else{
        this.model.no_of_days = parseInt(_cylceDay) + parseInt('0');
      }
    }


    //-----  principle return date select start ------
    if(_item){
      this.model.prncpl_rtrn_dt = _item;

      let myFormatDate1 = _item.split(" ")[0].split("/");
      let _mynewdate1 = myFormatDate1[2] + "-" + myFormatDate1[1] + "-" + myFormatDate1[0];
      console.log("_mynewdate1 >>", _mynewdate1);
      this.principleReturnDatePickerObj = {
        dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
        fromDate: new Date(_mynewdate1),
        closeOnSelect: true,
        yearInAscending: true
      };
    }
    //principle return date select end

  }
  

  //--------------- due Date Auto Calculate start --------------
  selectCycleDate;
  dueDateAutoCalculate(_item, _startDate){
    if(_item){

      // ----- original date format convert start -----
        let myFormatDate = _startDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      this.model.end_date = '';
      this.model.prncpl_rtrn_dt = '';
      this.model.no_of_days = '';

      console.log('due date select item -------------------22  >>', _item);
      //---- set day + count add start----
        this.selectCycleDate = new Date(_mynewdate);
        // this.selectCycleDate.setDate( this.selectCycleDate.getDate() + 3 );
        this.selectCycleDate.setDate( this.selectCycleDate.getDate() + parseInt(_item ));
        // alert('this.date >'+this.selectCycleDate);

        this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');

        // no of day calculate
        this.onDateChangeEndDate(_item, this.model.end_date);

      //---- set day + count add end----
    }else{
      this.model.end_date = '';
      this.model.prncpl_rtrn_dt = '';
      this.model.no_of_days = '';
    }
  }
  // due Date Auto Calculate end

  //--------------- due Month Auto Calculate start --------------
  selectCycleDateMonth;
  dueMonthAutoCalculate(_item, _startDate){
    if(_item){

      // ----- original date format convert start -----
        let myFormatDate = _startDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      this.model.end_date = '';
      this.model.prncpl_rtrn_dt = '';
      this.model.no_of_days = '';

      console.log('due month select item >>', _item);
      //---- set month + count add start----
        this.selectCycleDateMonth = new Date(_mynewdate);
        // this.selectCycleDateMonth.setMonth( this.selectCycleDateMonth.getMonth() + 2);

        // this.selectCycleDateMonth.setMonth( this.selectCycleDateMonth.getMonth() + parseInt(_item));
        this.selectCycleDateMonth.setDate( this.selectCycleDateMonth.getDate() + (parseInt(_item) * 30));

        this.model.end_date = moment(this.selectCycleDateMonth).format('DD/MM/YYYY');

        // no of day calculate
        this.onDateChangeEndDate(_item*30, this.model.end_date);

      //---- set month + count add end----
    }else{
      this.model.end_date = '';
      this.model.prncpl_rtrn_dt = '';
      this.model.no_of_days = '';
    }
  }
  // due Date Auto Calculate end

  //----- no of day select ---
  onChangeNoOfDay(_item){
    console.log('no of day select >>>', _item);
    console.log('this.getStartDate >>>', this.getStartDate);
  }

//================================ datepicker  end ================================

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

    if(this.parms_action_name == 'renew'){
      // form submit api renew
      this.form_api = 'transaction_renewtransaction/'+this.parms_action_id;
    }


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
         
          // this.commonUtils.clickEditData = response.return_data;
          this.commonUtils.clickEditDataFun(response.return_data);

          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){

            this.router.navigate(['/transaction-list']);

          }

          // this.notifier.notify( type, 'aa' );
    
          // form.reset();
          
          // set field
          if( this.parms_action_name == 'add' ){

            this.files = [];
            this.file_model_pdc = [];
            
            // form.reset();
            this.model = {};
              this.reloadPage();
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
  @ViewChild('fileInputPdc') fileInputPdcVariable: ElementRef;
  

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
            this.fileInputPdcVariable.nativeElement.value = "";

          }
        }
      ]
    });

    await alert.present();
  }
// delete  Aleart End

// upload file preview start
async uploadFilePreview(_identifier, _item, _items) {
  const modal2 = await this.modalController.create({
    component: AddCommonModelPage,
    componentProps: { 
      identifier: _identifier,
      modalForm_item: _item,
      modalForm_array: _items
    }
  });

  // modal data back to Component
  modal2.onDidDismiss()
  .then((getdata) => {
  });

  return await modal2.present();
}
// upload file preview end

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
      // add reload
      this.files = [];
      this.file_model_pdc = [];

      this.model =  {};


      this.model.start_date =  this.setStartdate;
      let myFormatDate = this.setStartdate.split(" ")[0].split("/");
      let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      this.endDatePickerObj = {
        dateFormat: 'DD/MM/YYYY',
        // fromDate:moment(_item).format('YYYY-DD-MM'),
        fromDate: new Date(_mynewdate),
        closeOnSelect: true,
        yearInAscending: true
      };

      if(this.accountList){
        this.accountList.forEach(element => {
          if(element.main == "1"){
            this.model.account_branch = JSON.parse(element.id);
            this.model.short_code = element.short_code;
          }
        });
      }

      this.model.interest_rate = "15";
      this.model.brokerage = '2';
      this.interest_cycle = '1';
      // this.model.tdss = this.brokerage_tds;
      // this.model.brokerage_tds = this.interest_tds;

      this.fiscal_years = this.fiscal_years;

      this.lenderGroupList = this.lenderGroupList1;

      // pds multiple
      this.model.pages = [
        {
          "is_default":true,
          "file_model_pdc": []
        }
      ];

      // fiscalYearsId
      this.fiscalYearsId = this.fiscal_years_id_get;

    }else{
      // edit reload

      if(this.parms_action_name == 'edit' ){
        this.actionHeaderText = 'Edit';
      }else if(this.parms_action_name == 'renew'){
        this.actionHeaderText = 'Renew';
      }

      this.onEditField = 'PUT';

      if(this.allEditData.return_data.pdcs.length > 0){
        this.model = {
          account_branch : JSON.parse(this.allEditData.return_data.account_branch_id),
          short_code : this.allEditData.return_data.short_code,
          lgroup_id :  JSON.parse(this.allEditData.return_data.lgroup_id),
          lender_id :  JSON.parse(this.allEditData.return_data.lender_id),
          bgroup_id :  JSON.parse(this.allEditData.return_data.bgroup_id),
          brrower_id :  JSON.parse(this.allEditData.return_data.brrower_id),
          principle : this.allEditData.return_data.principle,
          pri_receive_date : this.allEditData.return_data.pri_receive_date,
          interest_rate : this.allEditData.return_data.interest_rate,
          interestCycle : this.allEditData.return_data.interestCycle,
          cycle_days : this.allEditData.return_data.cycle_days,
          cycle_month : JSON.parse(this.allEditData.return_data.cycle_month),
          start_date :  moment(this.allEditData.return_data.start_date).format('DD/MM/YYYY'),
          end_date : moment(this.allEditData.return_data.end_date).format('DD/MM/YYYY'),
          prncpl_rtrn_dt : moment(this.allEditData.return_data.prncpl_rtrn_dt).format('DD/MM/YYYY'),
          no_of_days : this.allEditData.return_data.no_of_days,
          brokerage : this.allEditData.return_data.brokerage,
          bank_acc : this.allEditData.return_data.pdcs[0].bank_acc,
          acc_type :  JSON.parse(this.allEditData.return_data.pdcs[0].acc_type),
          routing : this.allEditData.return_data.pdcs[0].routing,
          bank_name : this.allEditData.return_data.pdcs[0].bank_name,
          branch_name : this.allEditData.return_data.pdcs[0].branch_name,
          docket : this.allEditData.return_data.pdcs[0].docket,
          cheque_no : this.allEditData.return_data.pdcs[0].cheque_no,
          check_date : moment(this.allEditData.return_data.pdcs[0].check_date).format('DD/MM/YYYY'),
          check_amt : this.allEditData.return_data.pdcs[0].check_amt,
          comment : this.allEditData.return_data.pdcs[0].comment
        }
      }else{
        this.model = {
          account_branch : JSON.parse(this.allEditData.return_data.account_branch_id),
          short_code : this.allEditData.return_data.short_code,
          lgroup_id :  JSON.parse(this.allEditData.return_data.lgroup_id),
          lender_id :  JSON.parse(this.allEditData.return_data.lender_id),
          bgroup_id :  JSON.parse(this.allEditData.return_data.bgroup_id),
          brrower_id :  JSON.parse(this.allEditData.return_data.brrower_id),
          principle : this.allEditData.return_data.principle,
          pri_receive_date : this.allEditData.return_data.pri_receive_date,
          interest_rate : this.allEditData.return_data.interest_rate,
          interestCycle : this.allEditData.return_data.interestCycle,
          cycle_days : this.allEditData.return_data.cycle_days,
          cycle_month : JSON.parse(this.allEditData.return_data.cycle_month),
          start_date :  moment(this.allEditData.return_data.start_date).format('DD/MM/YYYY'),
          end_date : moment(this.allEditData.return_data.end_date).format('DD/MM/YYYY'),
          prncpl_rtrn_dt : moment(this.allEditData.return_data.prncpl_rtrn_dt).format('DD/MM/YYYY'),
          no_of_days : this.allEditData.return_data.no_of_days,
          brokerage : this.allEditData.return_data.brokerage
        }
      }

      if(this.parms_action_name == 'edit' ){
        this.model.start_date =  moment(this.allEditData.return_data.start_date).format('DD/MM/YYYY');
        this.model.transaction_status =  JSON.parse(this.allEditData.return_data.transaction_status);
        this.model.brokerage_status =  JSON.parse(this.allEditData.return_data.brokerage_status);
      }else if(this.parms_action_name == 'renew'){
        this.model.start_date =  this.setStartdate;
        this.model.transaction_status =  JSON.parse(this.allEditData.return_data.transaction_status);
        this.model.brokerage_status =  JSON.parse(this.allEditData.return_data.brokerage_status);
        
        // ----- original date format convert start -----
        let myFormatDate = this.setStartdate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
        // original date format convert end

        this.model.end_date = '';
        this.model.prncpl_rtrn_dt = '';
        this.model.no_of_days = '';

        //---- set day + count add start----
        //console.log('res.return_data.cycle_days***********************>', this.allEditData.return_data.cycle_days);

        //console.log('res.return_data.cycle_month***********************>', this.allEditData.return_data.cycle_month);

          this.selectCycleDate = new Date(_mynewdate);
          // this.selectCycleDate.setDate( this.selectCycleDate.getDate() + 3 );

          // alert('this.date >'+this.selectCycleDate);

          if(this.allEditData.return_data.cycle_month > 0){
            this.selectCycleDate.setDate( this.selectCycleDate.getDate() + (parseInt(this.allEditData.return_data.cycle_month ) * 30));
            this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');
            this.model.prncpl_rtrn_dt =  moment(this.selectCycleDate).format('DD/MM/YYYY');
          }else{
            this.selectCycleDate.setDate( this.selectCycleDate.getDate() + parseInt(this.allEditData.return_data.cycle_days));
            this.model.end_date = moment(this.selectCycleDate).format('DD/MM/YYYY');
            this.model.prncpl_rtrn_dt =  moment(this.selectCycleDate).format('DD/MM/YYYY');
          }
          this.model.no_of_days = this.allEditData.return_data.no_of_days;

      }

      // fiscalYearsId
      this.fiscalYearsId = this.allEditData.return_data.fiscal_years_id;

      this.files = [];
      if(this.allEditData.return_data.files.length > 0){
        // this.files = res.return_data.files;
        this.allEditData.return_data.files.forEach(val => {
          val.file_id = val.id;
          this.files.push(val);
        });
      }
      this.file_model_pdc = [];
      /* if(this.allEditData.return_data.file_model_pdc.length > 0){
        // this.file_model_pdc = res.return_data.file_model_pdc;
        this.allEditData.return_data.file_model_pdc.forEach(val => {
          val.file_id = val.id;
          this.file_model_pdc.push(val);
        });
      } */

      if(this.allEditData.return_data.pdcs.length > 0){
        this.model.pages = this.allEditData.return_data.pdcs;
        this.allEditData.return_data.pdcs.forEach(element => {
          if(element.check_date){
            element.check_date =  moment(element.check_date).format('DD/MM/YYYY');
          }
        });
        this.toggleShow = false;
      }else{
        // pds multiple
        this.model.pages = [
          {
            "is_default":true,
            "file_model_pdc": []
          }
        ];
      }

      if(this.allEditData.return_data.cycle_month > 0){
        this.interest_cycle = '2';
      }
      this.fiscal_years = this.allEditData.return_data.fiscal_years;
      this.show_transaction_id = this.allEditData.return_data.dgr_transaction_id;

      // tds field show/hide start
      if(this.allEditData.return_data.lender.g15 == '0' && this.allEditData.return_data.brrower.tds_amt == '0'){
        this.showTdsField = false;
      }else if(this.allEditData.return_data.lender.g15 == '0' && this.allEditData.return_data.brrower.tds_amt == '1'){
        this.showTdsField = true;
        this.model.tdss = this.allEditData.return_data.tds;
      }else if(this.allEditData.return_data.lender.g15 == '1' && this.allEditData.return_data.brrower.tds_amt == '1'){
        this.showTdsField = false;
      }else if(this.allEditData.return_data.lender.g15 == '1' && this.allEditData.return_data.brrower.tds_amt == '1'){
        this.showTdsField = false;
      }else{
        this.showTdsField = false;
      }
      // tds field show/hide end

      //brokerage tds field show/hide start
      if(this.allEditData.return_data.brrower.tds_amt == '1'){
        this.showBrokerageTdsField = true;
        this.model.brokerage_tds = this.allEditData.return_data.brokerage_tds;
      }else{
        this.showBrokerageTdsField = false;
      }

      // contact by company call
      if(this.model.lgroup_id){
        this.OnChangeSelectLender(this.model.lgroup_id, 'lenderGroup');
        this.model.lender_id =  JSON.parse(this.allEditData.return_data.lender_id);
      }
      if(this.model.bgroup_id){
        this.OnChangeSelectLender(this.model.bgroup_id, 'browerGroup');
        this.model.brrower_id =  JSON.parse(this.allEditData.return_data.brrower_id);
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

// addItem
addItem(_items, _item){
  // this.commonUtils.addToItem(_items);
  // _items.push(_item);

  _items.push({"is_default":true,"file_model_pdc": []});
  console.log('_items >', _items);
}

// remove item
removeItem(index, event, items, action, isDefault){
  this.commonUtils.removeToItem(index, event, items, action, isDefault);
}

// onChangeAccount
onChangeAccount(_item){
  // console.log('onChangeAccount _item >', _item);
  this.accountList.forEach(element => {
    // console.log('onChangeAccount _item element>', element);
    if(element.id == _item){
      this.model.short_code = element.short_code;
    }
  });
}
// onFillPdc
pdcRequired:boolean = false;
onFillPdc(_item){
  console.log('pdc model >>>>>>>>>>>>>>.>', _item);
  if(_item){
    this.pdcRequired = true;
  }else{
    this.pdcRequired = false;
  }
}

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

