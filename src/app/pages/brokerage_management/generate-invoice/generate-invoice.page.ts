import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, PopoverController, ModalController, AlertController, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PaginationService } from 'src/app/services/pagination.service';
import { SelectColumnPopoverPage } from 'src/app/my-component/select-column-popover/select-column-popover.page';
import { AddInterestModalPage } from '../../modal/add-interest-modal/add-interest-modal.page';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AddCommonModelPage } from '../../modal/add-common-model/add-common-model.page';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.page.html',
  styleUrls: ['./generate-invoice.page.scss'],
})

export class GenerateInvoicePage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;

  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  tableHeaderDataDropdown;
  private itemsSubscribe: Subscription;
  private itemsHeaderSubscribe: Subscription;
  private getListSubscribe: Subscription;
  private contactByCompanySubscribe: Subscription;
  private deleteListSubscribe : Subscription;
  editStatusID;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  listing_url;
  selectLoading;
  toggleShow;
  showInterestbutton = false;
  toggleMobileSearch;
  lenderGroupList;
  companyByContact_api;
  selectLoadingDependLender;
  transactionStatus;
  curentDate;
  headerUrlapi;
  currentday;

  permissionArray;
  loggedin_user_id;

  // ......check uncheck start....
  itemcheckClick = false;
  checkedList = [];
  allselectModel;
  // check uncheck end

  // url variable
  urlType;
  urlId;
  pageUrlName;
  urlEmpId;

  // api parms
  api_parms: any = {};
  urlIdentifire = '';

  constructor(
    private plt: Platform,
    private pagerService: PaginationService,
    private popoverController: PopoverController,
    private modalController : ModalController,
    private alertController : AlertController,
    private storage: Storage,
    private router: Router,
    private http : HttpClient,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils, // common functionlity come here
    private authService : AuthService,
    private activatedRoute : ActivatedRoute
  ) { }
    
    // tslint:disable-next-line: comment-format
    // pager object
    pager: any = {};
    // paged items
    pageItems: any[];

    listAlldata;

    // ------ init function call start -------
      commonFunction(){
        // get active url name
        this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
        this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);


        // table header data url name
        this.headerUrlapi = 'transaction_headers';
    
        // table list data url name
        this.listing_url = 'transaction';


        this.onHeaderData(this.headerUrlapi);
        
        // getlist data url name
        this.getlist('transaction_getlist');

        this.api_parms = {
          page_url:'generate-invoice'
        }

        // company by contact api
        this.companyByContact_api = 'get_company_from_group/'

        /* this.api_parms = {
          type:'gggggg',
          id:'5'
        } */

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms, search, cherecterSearch, orderBy, order, advanceSearch, identifire)

        let curentDate = new Date();
        this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

        // menu show
        this.menuCtrl.enable(true);

        setInterval(() => {
          this.curentDate = new Date();
        }, 1);

        this.checkedList = [];
      
      }

      //init
      ngOnInit() {
        // this.commonFunction();
        // today select
        /*let curentDate = new Date();
        this.currentday = moment(curentDate).format('DD/MM/YYYY');

        this.model.start_date = this.currentday;
        this.model.end_date = this.currentday;*/
      }
    // init function call end

    ionViewWillEnter() {
      // menu show
      this.menuCtrl.enable(true);

      // this.commonFunction();

      //----  user type check start -----
      this.itemsSubscribe = this.commonUtils.getUserTypeObservable.subscribe(type => {
        // console.log('uuuuuuuuuuuuuuuuu type =>', type);
        if(type == 'group'){
          this.router.navigateByUrl('/dashboard');
        }
      });
      // user type end

      //----- menu permission data start-----
      this.itemsSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
        if(data){
          // console.log('uuuu) >>>>', this.router.url.split('?')[0]);
          // console.log('uuuu) >>>>',this.router.url.split('/')[1]);
          let getpermissionArray = data[this.router.url];
          // console.log('permissionAccessData (all Data )>>>>>>>>>>>>', data);
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
      
      /* this.page = 1;
      this.itemsSubscribe = this.commonUtils.itemsData.subscribe(itms =>{

        console.log('itmsitmsitms > itms ', itms);
        this.fetchItems = itms[0];
        this.listAlldata = itms[1];
        this.isListLoading = false;

      }) */

    }

    // --------- table header function -----------
    onHeaderData(_header_url) {
      this.plt.ready().then(() => {
        // this.isLoading = true;
        this.itemsHeaderSubscribe = this.commonUtils.headerListData(_header_url).subscribe(
          resData => {
          // this.isLoading = false;
          /* console.log('hhhhhhhhhhhhhhhhhhhhhhh resData transaction header', resData[0]); */

          this.tableHeaderData = resData[0];
          this.tableheaderDropdownChecked = resData[1];
          this.tableHeaderDataDropdown = resData[2];

          // ---- get stroage value for select dropdown start----
          this.storage.get(`${this.current_url_path_name}`).then((_stroageVal) => {
            if (_stroageVal != null ) {
              /* console.log('get stroage vaule transaction @@@@@@@@@@@>>>>>', _stroageVal); */
              this.tableHeaderData = _stroageVal;

              this.tableHeaderDataDropdown.forEach((value, index) => {
                _stroageVal.forEach((value2, index2) => {
                  if (value.column_name === value2.column_name) {
                      if (value2.is_checked == true) {
                        value.is_checked = true;
                      }
                    }
                });
              });

            } else {
              // dropdown select column check true first time
              this.tableheaderDropdownChecked.forEach((value, index) => {
                // console.log('value>', value);
                value.is_checked = true;
                // this.coloumSelectArray.push(value);
              });
            }
          });
          // get stroage value for select dropdown end

          // this.noDataFound = true;
          // alert('on init resData >'+ JSON.stringify(resData));
        },
        errRes => {
          // alert('on init errRes >'+ JSON.stringify(errRes));
          // this.isLoading = false;
        }
        );
      });
    }

    // --------- table list data function ---------
    onListData(_list_url, _displayRecord, _page, _apiParms, _search, _cherecterSearch, _orderBy, _order, _advSearchParms, _identifire) {
      this.plt.ready().then(() => {
        this.isListLoading = true;
        this.itemsSubscribe = this.commonUtils.fetchList(_list_url, _displayRecord, _page, _apiParms,  _search, _cherecterSearch, _orderBy, _order, _advSearchParms, _identifire).subscribe(
          resData => {
          this.isListLoading = false;
          this.fetchItems = resData[0];
          this.listAlldata = resData[1];

          //---------  check item show start ----------
          if(this.fetchItems && this.checkedList){
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              for (let j = 0 ; j < this.checkedList.length; j++) {
                if(this.checkedList[j].id ==  this.fetchItems[i].id){
                  this.fetchItems[i].isSelected = true;
                  console.log('this.fetchItems[i] >>', this.fetchItems[i]);
                }
              }
            }
          }
          // check item show end

          // show pager 
          if(resData[1] != undefined || resData[1] != null){
            this.pager = this.pagerService.getPager(resData[1].total, _page, _displayRecord);
          }
      
        },
        errRes => {
          this.isListLoading = false;
        }
        );
      });
    }

    // -------- pagination -------------
      pageNo = 1;
      setPage(page: number) {

        /* let navigationExtras: NavigationExtras = {
          queryParams: {
            "page": page
          }
        };
        this.router.navigate(['./'],  navigationExtras); */

        this.pageNo = page;
        // console.log('page pager >>>>>>>>>>>>>>>>', page);
        // get pager object from service
        this.pager = this.pagerService.getPager(this.listAlldata.total, page, this.displayRecord);

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

        // console.log('this.pager >', this.pager);
      }

    // pagination end

    // ----------- table header sorting start ----------------
      sortColumnName = '';
      sortOrderName = '';
      isSortTableHeader(_tableHeaderData,  _headerItem ){

        // all field reset first
        _tableHeaderData.forEach((val) => {
          val.sortingButtonName = ''
        })

        _headerItem.orederShow = !_headerItem.orederShow;
        if(_headerItem.orederShow) {
          _headerItem.sortingButtonName = "asc";
        }else
        {
          _headerItem.sortingButtonName = "desc";
        }

        this.sortColumnName = _headerItem.column_name;
        this.sortOrderName = _headerItem.sortingButtonName;

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);
      }
    // table header sorting end

    // -------------- selection column show hide start--------------

    // ------ popover select table header column start--------
      async openColumnselection(ev) {
        const popover = await this.popoverController.create({
          component: SelectColumnPopoverPage,
          componentProps: {
            popover_header_data : this.tableHeaderData,
            popover_header_data_dropdown : this.tableHeaderDataDropdown,
            current_url_name: this.current_url_path_name
          },
          event: ev,
          translucent: true
        });

        // dismiss link fire
        popover.onDidDismiss()
        .then((getdata) => {
          if(getdata.role == 'resetPopover'){
            // table header data url name
            this.onHeaderData(this.headerUrlapi);
          }
        });
        
        popover.present();

      }
    // popover select table header column end

    // ================== select checkbox start =====================
      
    // ===============common select==============
      /* onCheckboxSelect(option, event) {
        if (event.target.checked) {
          if (this.checkedList.indexOf(option.id) === -1) {
            this.checkedList.push(option.id);
          }
        } else {
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              if (this.checkedList[i] == option.id) {
                this.checkedList.splice(i, 1);
            }
          }
        }

        if (this.fetchItems.length <= this.checkedList.length) {
        this.allselectModel = true;
        console.log('length 4');
        } else {
          console.log('length 0');
          this.allselectModel = false;
          this.itemcheckClick = true;

        }

        console.log('checked item >>', this.checkedList);
        if(this.checkedList.length > 0){
          this.showInterestbutton = true;
        }else{
          this.showInterestbutton = false;
        }
      } */

      // ============ lender brrower same for interest and brokerage =============
      /* onCheckboxSelect(option, event) {
        console.log('option >>>> >', option);

        if (event.target.checked) {
          if (this.checkedList.indexOf(option) === -1) {

            if(this.checkedList.length == 0){
              this.checkedList.push(option);
            }else{
              for (let i = 0 ; i < this.checkedList.length; i++) {
                if(option.lender_id == this.checkedList[i].lender_id && option.brrower_id == this.checkedList[i].brrower_id){
                  this.checkedList.push(option);
                  this.checkedList[i].isSelected = true;
                  break;
                }else{
                  setTimeout(function(){
                    option.isSelected = false;
                  },100);
                  this.commonUtils.presentToast('error', option.id + ' Transaction Lender and Borrower is not Maching');
                }
              }
            }
            
          }
        } else {
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              if (this.checkedList[i] == option) {
                this.checkedList.splice(i, 1);
            }
          }
        }

        if (this.fetchItems.length <= this.checkedList.length) {
        this.allselectModel = true;
        console.log('length 4');
        } else {
          console.log('length 0');
          this.allselectModel = false;
          this.itemcheckClick = true;

        }

        console.log('checked item >>', this.checkedList);

        if(this.checkedList.length > 0){
          this.showInterestbutton = true;
        }else{
          this.showInterestbutton = false;
        }

      } */

      // ==== ( lender and brrower same for => intrest ) and (only brrower same for => brokerage) ==
      onCheckboxSelect(option, event) {
        console.log('option >>>> >', option);

        if (event.target.checked) {
          if (this.checkedList.indexOf(option) === -1) {
            this.checkedList.push(option);
            /* if(this.checkedList.length == 0){
              this.checkedList.push(option);
            }else{
              for (let i = 0 ; i < this.checkedList.length; i++) {
                if(option.lender_id == this.checkedList[i].lender_id && option.brrower_id == this.checkedList[i].brrower_id){
                  this.checkedList.push(option);
                  this.checkedList[i].isSelected = true;
                  break;
                }else{
                  setTimeout(function(){
                    option.isSelected = false;
                  },100);
                  this.commonUtils.presentToast('error', option.id + ' Transaction Lender and Borrower is not Maching');
                }
              }
            } */
            
          }
        } else {
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              if (this.checkedList[i] == option) {
                this.checkedList.splice(i, 1);
            }
          }
        }

        if (this.fetchItems.length <= this.checkedList.length) {
        this.allselectModel = true;
        console.log('length 4');
        } else {
          console.log('length 0');
          this.allselectModel = false;
          this.itemcheckClick = true;

        }

        console.log('checked item >>', this.checkedList);

        if(this.checkedList.length > 0){
          this.showInterestbutton = true;

        }else{
          this.showInterestbutton = false;
        }

      }

      /* allSelectItem(event) {

        this.checkedList = [];
        
        if (event.target.checked) {
          this.itemcheckClick = false;
          // console.log('check item selkectedddddddddddddd');
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            // if(this.checkedList.includes(this.items[i].id) === false)
            if (this.checkedList.indexOf(this.fetchItems[i].id) === -1 && this.fetchItems[i].id !== null) {
              this.checkedList.push(this.fetchItems[i].id);
              this.fetchItems[i].isSelected = true;

            }
          }
        } else if (this.itemcheckClick == false) {
          // console.log('not check item selectionnnnnnnnnnn')
          this.checkedList = [];
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            if (this.checkedList.indexOf(this.fetchItems[i].id) === -1)
            {
              this.fetchItems[i].isSelected = false;

            }
          }
        }

        console.log('checked item @@ >>', this.checkedList);
        // console.log('this.fetchItems[i] @@ >>', this.fetchItems[i]);

      } */

      /* allSelectItem(event) {
        console.log('checked item @@ >>', this.checkedList);
      } */

      allSelectItem(event) { 

        if (event.target.checked) {
          this.itemcheckClick = false;
          // console.log('check item selkectedddddddddddddd');
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            // if(this.checkedList.includes(this.items[i].id) === false)
            if (this.checkedList.indexOf(this.fetchItems[i]) === -1 && this.fetchItems[i] !== null) {
              this.checkedList.push(this.fetchItems[i]);
              this.fetchItems[i].isSelected = true;

            }
          }
        } else if (this.itemcheckClick == false) {
          // console.log('not check item selectionnnnnnnnnnn')
          this.checkedList = [];
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            if (this.checkedList.indexOf(this.fetchItems[i]) === -1)
            {
              this.fetchItems[i].isSelected = false;

            }
          }
        }

        console.log('checked item all @@ >>', this.checkedList);
      }
     

      // ..... open interest modal start ......
      async openInterestModal(_identifire, _type, _submitUrl, _selectItem){
        
        console.log('openInterestModal _identifire ===========>', _identifire);
        console.log('openInterestModal _type ===========>', _type);
        console.log('openInterestModal _submitUrl ===========>', _submitUrl);
        console.log('openInterestModal _selectItem ===========>', _selectItem);

        const modal = await this.modalController.create({
          component: AddInterestModalPage,
          componentProps: {
            identifire: _identifire,
            modalForm_url: _submitUrl,
            type: _type,
            selectItem:_selectItem
          }
        });

        // modal data back to Component
        modal.onDidDismiss()
        .then((getdata) => {
          
          console.log('openInterestModal onDidDismiss >>>>>', getdata);

          if(getdata.data == 'submitClose'){
            this.checkedList = [];

            for (let i = 0 ; i < this.checkedList.length; i++) {
              this.checkedList[i].isSelected = false;
            }

            this.showInterestbutton = false;

            this.onListData(this.listing_url, this.commonUtils.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
          }
          

        });
        
        // return await modal.present();
        if(_identifire == 'Add Interest' && _type == 'multiple'){
          let firstEl = _selectItem[0];
          for (let i = 0 ; i < _selectItem.length; i++) {
            if( !(firstEl.lender_id == _selectItem[i].lender_id) || !(firstEl.brrower_id == _selectItem[i].brrower_id)){
              // this.commonUtils.presentToast('error',  _selectItem[i].dgr_transaction_id + ' ' + 'Transaction Lender and Borrower is not Maching');
              this.commonUtils.presentToast('error', 'Transaction Lender and Borrower is not Maching');
              
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);

              break;
            }else if((_selectItem[i].transaction_status == '1') || (_selectItem[i].payment_mode == 'cheque' && _selectItem[i].transaction_status_name == 'Running')){
              this.commonUtils.presentToast('error', 'Transaction Interest Already Paid');
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);
            }else if(firstEl.short_code != _selectItem[i].short_code ){
              this.commonUtils.presentToast('error', 'Account not same');
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);
            }else{
              modal.present();
            }
          }
        }else if(_identifire == 'Add Brokerage' && _type == 'multiple'){
          let firstEl1 = _selectItem[0];
          // console.log('firstEl1 >>>>>>>>>>>', firstEl1);
          for (let i = 0 ; i < _selectItem.length; i++) {
            console.log('firstEl1 >>>>>>>>>>>', _selectItem[i].short_code);
            if(!(firstEl1.brrower_id == _selectItem[i].brrower_id)){
              // this.commonUtils.presentToast('error', _selectItem[i].dgr_transaction_id + ' ' + 'Transaction Borrower is not Maching');

              this.commonUtils.presentToast('error', 'Transaction Borrower is not Maching');

              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);

              break;
            }else if(!(_selectItem[i].brokerage_status == '0') || (_selectItem[i].brk_payment_mode == 'cheque' && _selectItem[i].brokerage_status_name == 'Running')){
              this.commonUtils.presentToast('error', 'Transaction Brokerage Already Paid');
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);
            }else if(firstEl1.short_code != _selectItem[i].short_code ){
              this.commonUtils.presentToast('error', 'Account not same');
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);
            }else{
              modal.present();
            }
          }
        }else{
          modal.present();
        }

      }
    // select checkbox end

    // ------- display record start-------
      displayRecord = this.commonUtils.displayRecord;
      displayRecords = this.commonUtils.displayRecords;
      displayRecordChange(_record) {
        // console.log('get record >', _record);
        this.displayRecord = _record;

        this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

        // -- url send extra query params start -----
          /* this.router.navigate(
            [], 
            {
              relativeTo: this.activatedRoute,
              queryParams: { per_page: this.displayRecord },
              queryParamsHandling: 'merge'
          });
          //--- get  query params from url ---
            const parm_url = window.location.href;
            console.log(' query params from url 111 >>>>',  parm_url.split('?')[1]);
          //--- get  query params from url end---- */
        //--- get  query params from url end----

      }
    // display record end

    //--------------  getlist data fetch start -------------
      transaction_id;
      account
      accountList;
      lender
      lenderList;
      borrower;
      borrowerList;
      interestList;
      principalList;
      principal;
      principle;
      interest;
      setStartdate;
      setEnddate;

      onChange(_item){
        console.log("dropdown selected item >", _item);
      }

      transactionStatuss = [];
      getlist(_getlistUrl){
        this.plt.ready().then(() => {
          this.selectLoading = true;
          this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
            resData => {
              this.selectLoading = false;
              /* console.log("transaction get list ggggggggggggggggg >>>>>>", resData); */
        
              this.accountList = resData.account_branchs;
              this.lenderList = resData.lenders;
              this.borrowerList = resData.brrowers;
              this.interestList = resData.transaction_status;
              this.principalList = resData.principle_status;
              this.lenderGroupList = resData.group;
              this.transactionStatus = resData.transaction_status;

              // transaction status id respect value push
              this.transactionStatuss = [];
              /* resData.transaction_status.forEach((val, ind) =>{
                this.transactionStatuss[ind] = val;
              }); */

            },
            errRes => {
              this.selectLoading = false;
            }
          );
        });
      }
    // getlist data fetch end

    // ------------searchbar start------------------
      searchTerm:string = '';
      searchList(event){
        
        /* setTimeout(() => {
          this.checkedList = [];
          this.showInterestbutton = false;
        }, 100); */

        this.searchTerm = event.target.value;
        /* console.log("search event >>", event.target.value); */

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, this.searchTerm, '',  this.sortColumnName, this.sortOrderName, '', this.urlIdentifire);

        // -- url send extra query params start -----
          /* this.router.navigate(
            [], 
            {
              relativeTo: this.activatedRoute,
              queryParams: { search: this.searchTerm },
              queryParamsHandling: 'merge'
          });
          //--- get  query params from url ---
            const parm_url = window.location.href;
            console.log(' query params from url 111 >>>>',  parm_url.split('?')[1]);
          //--- get  query params from url end---- */

          //--- get  query params from url end----

        // url send extra query params end 


      }
    // searchbar end

    // ------------cherecter search start------------------
      cherecterSearchTerm:string = '';
      searchByCherecter(event){
        this.cherecterSearchTerm = event.target.value;

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, '', this.cherecterSearchTerm,  this.sortColumnName, this.sortOrderName, '', this.urlIdentifire);

      }
    // cherecter search end

    //------- advance search  start-------
      // select company
      OnChangeSelectLender(_item, _type){
        this.contactByCompany(this.companyByContact_api, _item , _type);
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

      advanceSearchParms = '';
      onSubmitAdvanceForm(form:NgForm){
        this.advanceSearchParms = form.value;
        if(!form.valid){
          return;
        }else{
          //this.searchTerm = ''; //search data empty set

          setTimeout(() => {
            this.checkedList = [];
            this.showInterestbutton = false;
          }, 100);
          
          this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, '', '',  this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

        }
      }
    // advance search end

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
        closeOnSelect: true
      };

      onDateChangePriDate(_item){
        // this.model.start_date = _item;
        this.model.start_date = '';
        this.startdatePickerObj = {
          dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
          fromDate:moment(_item).format('YYYY-DD-MM'),
          closeOnSelect: true
        };
      }

      endDatePickerObj: any = {
        dateFormat: 'DD/MM/YYYY',
        closeOnSelect: true
      };

      onDateChangeStartDate(_item){
        // this.model.start_date = _item;
        this.model.end_date = '';
        this.endDatePickerObj = {
          dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
          fromDate:moment(_item).format('YYYY-DD-MM'),
          closeOnSelect: true
        };

      }
    // datepicker  end

    //------------  custom refresh page start ----------
    onRefreshPage(event){
      event.preventDefault();
      event.stopPropagation();

      this.checkedList = [];
      this.allselectModel = false;

      this.advanceSearchParms = '';
      this.searchTerm = '';
      // this.displayRecord =this.commonUtils.displayRecord;
      this.sortColumnName = '';
      this.sortOrderName = '';

      // shorting reset
      this.tableHeaderData.forEach((val) => {
        val.sortingButtonName = '',
        val.orederShow = false;
      })

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, '', '', '', '', '', this.urlIdentifire);

    }
    // custom refresh page end

    // ---------------- Click Delete Item start ---------------------
    // deleteLodershow = false;
    // async onClickDeleteItem(_item, _items, _index){
    //   const alert = await this.alertController.create({
    //     header: 'Delete',
    //     message: 'Do you really want to delete selected item ?',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         cssClass: 'popup-cancel-btn',
    //         handler: (blah) => {
    //           // console.log('Confirm Cancel: blah');
    //         }
    //       }, {
    //         text: 'Ok',
    //         cssClass: 'popup-ok-btn',
    //         handler: () => {
    //           // console.log('Confirm Okay');
    //           let fd = new FormData();
    //           fd.append('_method', 'DELETE');

    //           _item.deleteLodershow = true;
    //           this.deleteListSubscribe = this.http.post(this.listing_url+'/'+_item.id, fd).subscribe(
    //           (res:any) => {
    //             _item.deleteLodershow = false;
    //             if(res.return_status > 0){
    //               _items.splice( _index, 1 );
    //               this.commonUtils.presentToast('success', res.return_message);
    //             }else{
    //               this.commonUtils.presentToast('error', res.return_message);
    //             }
    //           }); 
  
    //         }
    //       }
    //     ]
    //   });
  
    //   await alert.present();

    // }
    // Click Delete Item end

    // --------------- enable disable call start ---------------------
      statusChangeLoading;
      enabledDisabled( _identifire, _item, _items ){
        //if _status is 0 then its set to 1 and vice versa
        // _status = _status ? 0 : 1;
        let getStatus;
        let set_api;
        if(_identifire == 'single'){
          if(_item.status == '0'){
            getStatus = '1';
          }else{
            getStatus = '0';
          }
          set_api = this.listing_url+'_status/'+_item.id+'?status='+getStatus;
        }else{
          let checkItemIdArray = [];
          if(this.checkedList){
            this.checkedList.forEach(element => {
              checkItemIdArray.push(element.id);
            });
          }
          set_api = this.listing_url+'_actionall?action=statuschange&status='+_item+'&'+this.listing_url+'_id='+ checkItemIdArray.join();
        }

        this.statusChangeLoading = true;
        this.itemsSubscribe = this.http.get(set_api).subscribe(
          (res:any) => {
            if(res.return_status > 0)
            {
              this.statusChangeLoading = false;
              this.commonUtils.presentToast('success', res.return_message);

              if(_identifire == 'single'){
                if(_item.status == '0'){
                  _item.status = '1';
                }else{
                  _item.status = '0';
                }
              }else{
                if(_item == '0'){
                  for (let i = 0 ; i < this.fetchItems.length; i++) {
                    for (let j = 0 ; j < this.checkedList.length; j++) {
                      if ( this.fetchItems[i].id == this.checkedList[j].id ) {
                        this.fetchItems[i].status = '0';
                        this.fetchItems[i].isSelected = false;
                        break;
                      }
                    }
                  }
                }else{
                  for (let i = 0 ; i < this.fetchItems.length; i++) {
                    for (let j = 0 ; j < this.checkedList.length; j++) {
                      if ( this.fetchItems[i].id == this.checkedList[j].id ) {
                        this.fetchItems[i].status = '1';
                        this.fetchItems[i].isSelected = false;
                        break;
                      }
                    }
                  }
                }
                this.checkedList = [];
              }

              // console.log("enabledDisabled ... res >", res);

            }else{
              this.statusChangeLoading = false;
              this.commonUtils.presentToast('error', res.return_message);
            }
          },
          errRes => {
            this.statusChangeLoading = false;
          }
        );
      }
    // enable disable call end

    // ..... principle Receive modal start ......
      async principleReceiveOpenModal(_identifier, _item, _items) {
        const principle_modal = await this.modalController.create({
          component: AddCommonModelPage,
          componentProps: { 
            identifier: _identifier,
            modalForm_item: _item,
            modalForm_array: _items
          }
        });

        // modal data back to Component
        principle_modal.onDidDismiss()
        .then((getdata) => {
          // console.log('getdata >>>>>>>>>>>', getdata);
          if(getdata.data == 'submitClose'){
            this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
          }

        });

        return await principle_modal.present();
      }
    // principle Receive  modal end 

    // ----- click item hilight back start ----
      activeHighlightIndex;
      clickItemHighlight(index){
        /* console.log('click item index ==>', index);
        console.log('this.pageNo ==>', this.pageNo); */
        this.activeHighlightIndex = index;
      }
      myClickItem;
      onClickItem(_item){
        console.log('on click _item >', _item);
        this.myClickItem = _item;
      }
    //click item hilight back end 

    // ------ export function call start ------
    export_url;
    onExport(_identifier, _items, _item){
      console.log('onExport _identifier >>', _identifier);
      console.log('onExport _items >>', _items);
      console.log('onExport _item >>', _item);

      let items_id_array = [];
      if(_items){
        _items.forEach(element => {
          items_id_array.push(element.id);
        });
      }

      if(_identifier == 'single'){
        this.itemsSubscribe = this.authService.globalparamsData.subscribe(res => {
          this.export_url = this.main_url+'/transaction_print/'+_item.id+'?token='+res.token+'&session='+res.session+'&master='+res.master;
        });
        window.open(this.export_url);

      }else if(_identifier == 'multiple_list'){
        this.itemsSubscribe = this.authService.globalparamsData.subscribe(res => {
          /* this.export_url = this.main_url+'/transaction_multiple_list?transaction_id='+items_id_array.join()+'&token='+res.token+'&session='+res.session+'&master='+res.master; */

          this.export_url = this.main_url+'/transaction_export'+'?token='+res.token+'&session='+res.session+'&master='+res.master;
          });
        window.open(this.export_url);
      }else{
        this.itemsSubscribe = this.authService.globalparamsData.subscribe(res => {
          this.export_url = this.main_url+'/transaction_multiple_print?transaction_id='+items_id_array.join()+'&token='+res.token+'&session='+res.session+'&master='+res.master;
        });
        window.open(this.export_url);
      }
      
    }
    // export function call end

    // ------- Generate Invoice function Call start----------

    checkItemIdArray = [];
    checkItemIdArrayInvoice = [];
    multipleLoading = false;
    singleLoading = false;
    generateInvoice( _identifire, _item, _items, _selectItem) {
        
      this.checkItemIdArray = [];
      this.checkItemIdArrayInvoice = [];

        let set_api;
        if(_identifire == 'single'){
          _item.singleLoading = true;
          set_api = 'generateinvoice?transaction_id='+_item.id+'&transaction_invoice='+_item.transaction_invoice;
        }else{

         console.log('_selectItem >>>>>>>>>>>', _selectItem);

          let firstEl1 = _selectItem[0];
         console.log('firstEl1 >>>>>>>>>>>', firstEl1);

          // console.log('firstEl1 >>>>>>>>>>>', firstEl1);
          /*for (let i = 0 ; i < _selectItem.length; i++) {
            if(!(firstEl1.brrower_id == _selectItem[i].brrower_id)){

              console.log('not matchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
              this.commonUtils.presentToast('error', 'Transaction Borrower is not Maching');
              break;
            }else{
              console.log('matchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
               set_api = 'generateinvoice5?transaction_id='+ this.checkItemIdArray.join()+'&transaction_invoice='+this.checkItemIdArrayInvoice.join();
            }
          }*/

          for(let item of _selectItem) {
            if(firstEl1.brrower_id != item.brrower_id) {
               this.commonUtils.presentToast('error', 'Transaction Borrower is not Maching');
                this.checkItemIdArray = [];
                this.checkItemIdArrayInvoice = [];
                // this.checkedList = [];
               console.log('not match checkedList >>>', this.checkedList);
               /*console.log('not match checkItemIdArray >>>', this.checkItemIdArray);
               console.log('not match checkItemIdArrayInvoice >>>', this.checkItemIdArrayInvoice);*/
              return false;
              // break;
            }else if(firstEl1.account_branch_id != item.account_branch_id){
              this.commonUtils.presentToast('error', 'Account not same');
              this.checkItemIdArray = [];
                this.checkItemIdArrayInvoice = [];
               console.log('Account not same >>>', this.checkedList);
               return false;
            }else{
              console.log(' match checkedList >>> ', this.checkedList);
               /*console.log(' match>>> checkItemIdArray', this.checkItemIdArray);
               console.log(' match checkItemIdArrayInvoice >>>', this.checkItemIdArrayInvoice);*/

              /*this.checkItemIdArray = [];
              this.checkItemIdArrayInvoice = [];*/
              if(this.checkedList){
                this.checkedList.forEach(element => {
                  if (this.checkItemIdArray.indexOf(element.id) === -1) {
                    this.checkItemIdArray.push(element.id);
                  }
                  if (this.checkItemIdArrayInvoice.indexOf(element.transaction_invoice) === -1) {
                    this.checkItemIdArrayInvoice.push(element.transaction_invoice);
                  }
                });
              }
              set_api = 'generateinvoice?transaction_id='+ this.checkItemIdArray.join()+'&transaction_invoice='+this.checkItemIdArrayInvoice.join();
            }
          }

          console.log('onExport _items >>', this.checkItemIdArray);
          
          
        }

        this.statusChangeLoading = true;
        this.multipleLoading = true;
        
        this.itemsSubscribe = this.http.get(set_api).subscribe(
          (res:any) => {
            if(res.return_status > 0)
            {

              this.checkItemIdArray = [];
              this.checkItemIdArrayInvoice = [];
              this.checkedList = [];


              this.statusChangeLoading = false;
              this.multipleLoading = false;
              this.commonUtils.presentToast('success', res.return_message);
              this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
              // console.log("enabledDisabled ... res >", res);

              

            }else{
              this.statusChangeLoading = false;
              this.commonUtils.presentToast('error', res.return_message);
            }
          },
          errRes => {
            this.statusChangeLoading = false;
            this.multipleLoading = false;
            _item.singleLoading = false;
          }
        );

    }

    // Generate Invoice function call End

    // ----------- destroy subscription start ---------
      ngOnDestroy() {
        if(this.itemsSubscribe !== undefined){
          this.itemsSubscribe.unsubscribe();
        }
        if(this.itemsHeaderSubscribe !== undefined){
          this.itemsHeaderSubscribe.unsubscribe();
        }
        if(this.getListSubscribe !== undefined){
          this.getListSubscribe.unsubscribe();
        }
        if(this.contactByCompanySubscribe !== undefined){
          this.contactByCompanySubscribe.unsubscribe();
        }
        if(this.deleteListSubscribe != undefined){
          this.deleteListSubscribe.unsubscribe();
        }
      }
    // destroy subscription end

}
