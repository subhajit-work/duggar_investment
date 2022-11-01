import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PopoverController, Platform, ModalController, MenuController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PaginationService } from '../../../services/pagination.service';
import { SelectColumnPopoverPage } from '../../../my-component/select-column-popover/select-column-popover.page';
import { AddInterestModalPage } from '../../modal/add-interest-modal/add-interest-modal.page';
import { CommonUtils } from '../../../services/common-utils/common-utils';


/* tslint:disable */ 
@Component({
  selector: 'app-group-transaction-list',
  templateUrl: './group-transaction-list.page.html',
  styleUrls: ['./group-transaction-list.page.scss'],
})
// End here


export class GroupTransactionListPage implements OnInit, OnDestroy {

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
  private groupClickableDataSubscribe: Subscription;
  private viewPageDataSubscribe : Subscription;
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
  listing_view_url;
  viewLoadData;
  viewData;

  identifireName;
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

  lederColumnShow = false;
  borrowerColumnShow = false;

  // api parms
  api_parms: any = {};
  urlIdentifire = '';

  constructor(
    private plt: Platform,
    private pagerService: PaginationService,
    private popoverController: PopoverController,
    private modalController : ModalController,
    private storage: Storage,
    private router: Router,
    private http : HttpClient,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils // common functionlity come here
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
        this.headerUrlapi = 'userinformationcontroller_headers';
    

        this.onHeaderData(this.headerUrlapi);
        
        // getlist data url name
        this.getlist('transaction_getlist');
        
        // view page url name
        this.listing_view_url = 'groupclient';

        // company by contact api
        this.companyByContact_api = 'get_company_from_group/'

        /* this.api_parms = {
          type:'gggggg',
          id:'5'
        } */

        let curentDate = new Date();
        this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

        // menu show
        this.menuCtrl.enable(true);

        setInterval(() => {
          this.curentDate = new Date();
        }, 1);

        this.checkedList = [];
        
        // get group login  onclick data
        this.fetchItems = [];
        this.groupClickableDataSubscribe = this.commonUtils.groupLoginClickDataObservable.subscribe(data => {
          console.log('data >', data);
          if(data){
            if(data.indentifire == 'lender'){
              this.lederColumnShow = true;
              this.borrowerColumnShow = false;
              this.identifireName = 'Lender';
              this.fetchItems = data.item.lender;

              // table list data url name
              this.listing_url = 'userinformationcontroller_clientlendertran/' + data.item.id;

              // console.log('data>>>>>',this.listing_url);

              this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
              //(api_url, display_record, page, apiParms, search, cherecterSearch, orderBy, order, advanceSearch, identifire)

            }else{
              this.identifireName = 'Borrower';
              this.borrowerColumnShow = true;
              this.lederColumnShow = false;
              this.fetchItems = data.item.borrower;
              // table list data url name
              this.listing_url = 'userinformationcontroller_clientbrrowertran/' + data.item.id;

              this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
              //(api_url, display_record, page, apiParms, search, cherecterSearch, orderBy, order, advanceSearch, identifire)
            }
          }else{
            console.log('reload data apiiiiiiiiiiiiiiiii');
            // this.viewPageData();
            this.router.navigateByUrl('/dashboard');
          }
        })
        
      }

      //init
      ngOnInit() {
        // this.commonFunction();
      }
    // init function call end

    ionViewWillEnter() {
      // menu show
      this.menuCtrl.enable(true);

      this.commonFunction();

      //----- menu permission data start-----
      /* this.itemsSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
        if(data){
          let getpermissionArray = data[this.router.url];
          // console.log('permissionAccessData (all Data )>>>>>>>>>>>>', data);
          // console.log('permissionAccessData >>>>>>>>>>>>', getpermissionArray);
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
      }) */
      //menu permission data end-----

      /* this.page = 1;
      this.itemsSubscribe = this.commonUtils.itemsData.subscribe(itms =>{
        // this.isLoading = false;
        this.fetchItems = itms;
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
          console.log('resData @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2  ?>', resData);
          // this.fetchItems = resData[0];

          this.fetchItems = resData[0];

          // this.listAlldata = resData[1];

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
      } */

      allSelectItem(event) {
        console.log('checked item @@ >>', this.checkedList);
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

          /* this.checkedList = [];

          for (let i = 0 ; i < this.checkedList.length; i++) {
              this.checkedList[i].isSelected = false;
          } */

          // this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, '', '', '', '', '', this.urlIdentifire);
        });
        
        // return await modal.present();
        if(_identifire == 'Add Interest' && _type == 'multiple'){
          let firstEl = _selectItem[0];
          for (let i = 0 ; i < _selectItem.length; i++) {
            if( !(firstEl.lender_id == _selectItem[i].lender_id) || !(firstEl.brrower_id == _selectItem[i].brrower_id)){
              this.commonUtils.presentToast('error',  _selectItem[i].id + ' ' + 'Transaction Lender and Borrower is not Maching');
              console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb [not match lender brrower ]');
              
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);

              break;
            }else{
              console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa [match lender brrower ]');
              modal.present();
            }
          }
        }else if(_identifire == 'Add Brokerage' && _type == 'multiple'){
          let firstEl1 = _selectItem[0];
          for (let i = 0 ; i < _selectItem.length; i++) {
            if(!(firstEl1.brrower_id == _selectItem[i].brrower_id)){
              this.commonUtils.presentToast('error', _selectItem[i].id + ' ' + 'Transaction Borrower is not Maching');
              console.log('dddddddddddddddddddddddddddddddddddd [not match brrower ]');

              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.modalController.dismiss();
              },500);

              break;
            }else{
              console.log('ccccccccccccccccccccccccccccccccccccc [match brrower ]');
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
              this.lenderGroupList = resData.group;
              this.transactionStatus = resData.transaction_status;

              // transaction status id respect value push
              this.transactionStatuss = [];
              resData.transaction_status.forEach((val, ind) =>{
                this.transactionStatuss[ind] = val;
              });

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
        this.searchTerm = event.target.value;
        /* console.log("search event >>", event.target.value); */

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, this.searchTerm, '',  this.sortColumnName, this.sortOrderName, '', this.urlIdentifire);
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
          // this.searchTerm = ''; //search data empty set
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

    // ------- view page reload data start --------
      viewPageData(){
        this.viewLoadData = true;
        this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
          (res:any) => {
            this.viewLoadData = false;
            console.log("view data  res -------------------->", res.return_data);
            if(res.return_status > 0){
              this.viewData = res.return_data.client[0].lender;
            }
          },
          errRes => {
            this.viewLoadData = false;
          }
        );
      }
    // ------- view page reload data end --------
    
    // ----- click item hilight back start ----
      activeHighlightIndex;
      clickItemHighlight(index){
        console.log('click item index >', index);
        this.activeHighlightIndex = index;
      }
    //click item hilight back end 

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
        if(this.groupClickableDataSubscribe !== undefined){
          this.groupClickableDataSubscribe.unsubscribe();
        }
        if(this.viewPageDataSubscribe !== undefined){
          this.viewPageDataSubscribe.unsubscribe();
        }
      }
    // destroy subscription end

}


