import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PopoverController, Platform, ModalController, MenuController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PaginationService } from '../../../services/pagination.service';
import { SelectColumnPopoverPage } from '../../../my-component/select-column-popover/select-column-popover.page';
import { CommonUtils } from '../../../services/common-utils/common-utils';
import { AddCommonModelPage } from '../../modal/add-common-model/add-common-model.page';


/* tslint:disable */ 
@Component({
  selector: 'app-recived-brokerage-list',
  templateUrl: './recived-brokerage-list.page.html',
  styleUrls: ['./recived-brokerage-list.page.scss'],
})
// End here


export class RecivedBrokerageListPage implements OnInit, OnDestroy {

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
  editStatusID;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  listing_url;
  selectLoading;
  toggleShow;
  showClickEl;
  toggleMobileSearch;
  headerUrlapi;
  transactionStatuss;
  companyByContact_api;
  selectLoadingDependLender;
  currentday;
  curentDate;
  private contactByCompanySubscribe: Subscription;

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
    private storage: Storage,
    private router: Router,
    private http : HttpClient,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }
    
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
        this.headerUrlapi = 'brokerage_headers';

        // table list data url name
        this.listing_url = 'brokerage';
        
        this.onHeaderData(this.headerUrlapi);
        
        // getlist data url name
        this.getlist('brokerage_getlist');

        this.api_parms = {
          pymnt_status:'2',
          page_url:'recived-brokerage-list'
        }

        // company by contact api
        this.companyByContact_api = 'get_company_from_group/';
        
        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms, search, cherecterSearch, orderBy, order, advanceSearch, identifire)

        let curentDate = new Date();
        this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

        // menu show
        this.menuCtrl.enable(true);

        setInterval(() => {
          this.curentDate = new Date();
        }, 1);
      }

      // init
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

      //----- menu permission data start-----
      this.commonUtils.menuPermissionObservable.subscribe(data => {
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
      })
      //menu permission data end-----
    }

    // --------- table header function -----------
    onHeaderData(_header_url) {
      this.plt.ready().then(() => {
        this.itemsHeaderSubscribe = this.commonUtils.headerListData(_header_url).subscribe(
          resData => {
          this.tableHeaderData = resData[0];
          this.tableheaderDropdownChecked = resData[1];
          this.tableHeaderDataDropdown = resData[2];

          // ---- get stroage value for select dropdown start----
          this.storage.get(`${this.current_url_path_name}`).then((_stroageVal) => {
            if (_stroageVal != null ) {
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
              this.tableheaderDropdownChecked.forEach((value, index) => {
                value.is_checked = true;
              });
            }
          });
        },
        errRes => {
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
        // get pager object from service
        this.pageNo = page;

        this.pager = this.pagerService.getPager(this.listAlldata.total, page, this.displayRecord);

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

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

    // ------- display record start-------
      displayRecord = this.commonUtils.displayRecord;
      displayRecords = this.commonUtils.displayRecords;
      displayRecordChange(_record) {
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
      companyList;
      countryList;
      stateList;

      onChange(_item){
        console.log("dropdown selected item >", _item);
      }

      getlist(_getlistUrl){
        this.plt.ready().then(() => {
          this.selectLoading = true;
          this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
            resData => {
              this.selectLoading = false;
              this.companyList = resData.client;
              this.countryList = resData.country_id;
              this.stateList = resData.state_id;
              this.lenderList = resData.lenders;
              this.borrowerList = resData.brrowers;

              // transaction status id respect value push
              this.transactionStatuss = [];
              /* resData.payment_mode.forEach((val, ind) =>{
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
        this.searchTerm = event.target.value;

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

    //------- advance search -------
      advanceSearchParms = '';

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

      onSubmitAdvanceForm(form:NgForm){
        // console.log('adv form.value >>', form.value);
        this.advanceSearchParms = form.value;
        if(!form.valid){
          return;
        }else{

          //this.searchTerm = ''; //search data empty set
          
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

     // ..... add deposit modal start ......
      async openModal(_identifier, _item, _items) {
        const modal = await this.modalController.create({
          component: AddCommonModelPage,
          cssClass: 'mymodalClass',
          componentProps: { 
            identifier: _identifier,
            modalForm_item: _item,
            modalForm_array: _items
          }
        });

        // modal data back to Component
        modal.onDidDismiss()
        .then((getdata) => {
          this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, '', '', '', '', '', this.urlIdentifire);

        });
        
        return await modal.present();
      }
    // add deposit  modal end 

    // ----- click item hilight back start ----
     activeHighlightIndex;
     clickItemHighlight(index){
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
      }
    // destroy subscription end

}
  
  