import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PopoverController, Platform, ModalController, MenuController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { PaginationService } from '../../services/pagination.service';
import { SelectColumnPopoverPage } from '../../my-component/select-column-popover/select-column-popover.page';
import { CommonUtils } from '../../services/common-utils/common-utils';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';


/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
// End here


export class DashboardPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  panelOpenState = false;

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
  private viewPageDataSubscribe: Subscription;
  editStatusID;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  listing_url;
  selectLoading;
  toggleShow;
  toggleMenuFile;
  toggleMenuOpen;
  showInterestbutton = false;
  toggleMobileSearch;
  lenderGroupList;
  companyByContact_api;
  selectLoadingDependLender;
  transactionStatus;
  curentDate;
  headerUrlapi;
  parms_action_id;
  tabOptions;
  listing_view_url;
  viewLoadData;
  viewData;
  currentday;

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
    private alertController : AlertController,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
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

        this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
        

        // table header data url name
        this.headerUrlapi = 'userinformationcontroller_headers'

        this.onHeaderData(this.headerUrlapi);
        

        // table list data url name
        this.listing_url = 'grouptransactionlist';

        // getlist data url name
        this.getlist('transaction_getlist');

         // view page url name
         this.listing_view_url = 'groupclient';

        // company by contact api
        // this.companyByContact_api = 'get_company_from_group/'

        /* this.api_parms = {
          type:'gggggg',
          id:'5'
        } */


        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, '', '', '', '', '', this.urlIdentifire); 
        //(api_url, display_record, page, apiParms, search, cherecterSearch, orderBy, order, advanceSearch, identifire)

        let curentDate = new Date();
        this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

        // menu show
        this.menuCtrl.enable(true);

        setInterval(() => {
          this.curentDate = new Date();
        }, 1);

        // view data call
        this.viewPageData();
      }

      //init
      ngOnInit() {
        // this.commonFunction();
        this.tabOptions = '1';

        // today select
        /*let curentDate = new Date();
        this.currentday = moment(curentDate).format('DD/MM/YYYY');

        this.model.due_start_date = this.currentday;
        this.model.next_due_start_date = this.currentday;
        this.model.due_end_date = this.currentday;
        this.model.next_due_end_date = this.currentday;*/
      }
    // init function call end

    ionViewWillEnter() {
      // menu show
      this.menuCtrl.enable(true);

      this.commonFunction();

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
            this.fetchItems = resData[0];
            this.listAlldata = resData[1];

            console.log('dataatttttttttttttttttttttttttt >', this.fetchItems);
  
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
    
    // ------- display record start-------
      displayRecord = this.commonUtils.displayRecord;
      displayRecords = this.commonUtils.displayRecords;
      displayRecordChange(_record) {
        // console.log('get record >', _record);
        this.displayRecord = _record;

        this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

      }
    // display record end

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
      onCheckboxSelect(option, event) {
        if (event.target.checked) {
          if (this.checkedList.indexOf(option) === -1) {
            this.checkedList.push(option);
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

        console.log('checked item single >>', this.checkedList);
      }

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
    // select checkbox end

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

      onDateChangeDueStartDate(_item){
        // this.model.start_date = _item;
        this.model.due_end_date = '';
        this.endDatePickerObj = {
          dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
          fromDate:moment(_item).format('YYYY-DD-MM'),
          closeOnSelect: true
        };

      }

      onDateChangeNextDueStartDate(_item){
        // this.model.start_date = _item;
        this.model.next_due_end_date = '';
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


      // ================== transaction view data fetch start =====================
      viewPageData(){
        this.viewLoadData = true;
        this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
          (res:any) => {
            this.viewLoadData = false;
            console.log("view data  res -------------------->", res.return_data);
            if(res.return_status > 0){
              this.viewData = res.return_data;
            }
          },
          errRes => {
            this.viewLoadData = false;
          }
        );
      }
    // transaction view data fetch end
    
    // ----- click item hilight back start ----
      activeHighlightIndex;
      clickItemHighlight(index){
        console.log('click item index >', index);
        this.activeHighlightIndex = index;
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

          this.export_url = this.main_url+'/userinformationcontroller_export?transaction_id='+items_id_array.join()+'&token='+res.token+'&session='+res.session+'&master='+res.master;
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
        if(this.viewPageDataSubscribe !== undefined){
          this.viewPageDataSubscribe.unsubscribe();
        }
      }
    // destroy subscription end

}