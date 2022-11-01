import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { CommonUtils } from '../../../services/common-utils/common-utils';

/* tslint:disable */ 
@Component({
  selector: 'app-add-interest-modal',
  templateUrl: './add-interest-modal.page.html',
  styleUrls: ['./add-interest-modal.page.scss'],
})
export class AddInterestModalPage implements OnInit, OnDestroy {

  // variable declar
  model: any = {};
  form_submit_text = 'Submit';
  private formSubmitSubscribe: Subscription;
  private selectDataSubscribe: Subscription;
  api_url;
  selectItem;
  selectItemArray = [];
  selectItemArrayItem = [];
  paymentOptions;
  selectLoading;
  listDataUrl;
  selectItemList;
  total_sum;
  showLoading;
  payment_mode_cash = 'cash';
  payment_mode_cheque = 'cheque';
  payment_mode_online = 'online';
  setStartdate;
  is_check_tds;
  is_loading_complite = false;
  calculateGST;
  claculategstValue;
  selectItemListPay;
  totalPayAmount;
  totalInterestAmt;
  totalGstAmt;
  totalTdsAmt;
  totalPayAmount_given;
  totalCgstAmt;
  totalSgstAmt;
  invoice_id;
  transaction_id;
  show_invoice_number;
  invoice_paid_amount;

  @Input() identifire;
  @Input() type;

  constructor(
    private modalController : ModalController,
    private http : HttpClient,
    private navParams : NavParams,
    private plt: Platform,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  ngOnInit() {

    // this.identifire =  this.navParams.get('identifire');
    // this.api_url =  this.navParams.get('modalForm_url');
    this.selectItem =  this.navParams.get('selectItem');
    console.log('this.selectItem @@@@@@ A>', this.selectItem);

    // ====================== interest add ======================
    if(this.identifire == 'Add Interest'){
      this.api_url =  'transactioninterest_multipleinsert';
      // selected array item send
      if(this.type == 'multiple'){
        this.selectItemArray = [];
        this.selectItemArrayItem = [];
        this.selectItem.forEach(element => {
          this.selectItemArray.push(element.id);
          this.selectItemArrayItem.push(element);
          console.log('this.selectItemArrayItem >>>>>>>>>>>> B', this.selectItemArrayItem);
        });

        this.listDataUrl = 'transactioninterest_multipleinterest?transaction_id='+this.selectItemArray;
        console.log('selectItemArray >>', this.selectItemArray);
      }else{
        this.listDataUrl = 'transactioninterest_multipleinterest?transaction_id='+this.selectItem.id;

        console.log('selectItem >>@@@@ SINGLE @@@>>>>>', this.selectItem);
        /* for (var x in this.selectItem) {
          this.selectItemArray.push( this.selectItem[ x ] );
        } */
      }
    // ====================== brokerage add ======================
    }else{
      this.api_url =  'transactionbrokerage_multiplebrokegeinsert';
      // selected array item send
      if(this.type == 'multiple'){
        this.selectItemArray = [];
        this.selectItem.forEach(element => {
          this.selectItemArray.push(element.id);
        });

        this.listDataUrl = 'transactionbrokerage_multiplebrokerage?transaction_id='+this.selectItemArray;
        console.log('selectItemArray >>', this.selectItemArray);
      }else{
        this.listDataUrl = 'transactionbrokerage_multiplebrokerage?transaction_id='+this.selectItem.id;
        /* for (var x in this.selectItem) {
          this.selectItemArray.push( this.selectItem[ x ] );
        } */
      }
    }
    
    this.paymentOptions = '1';

    // init call
    this.init();
  }

  init(){

    this.model = {
      cash : {},
      cheque : {},
      online : {}
    };

    // today select
    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');
    
    this.model.cash.setStartdate = this.setStartdate;
    this.model.cheque.setStartdate = this.setStartdate;
    this.model.online.setStartdate = this.setStartdate;

    this.plt.ready().then(() => { 
      this.showLoading = true;
      this.selectDataSubscribe = this.http.get(this.listDataUrl).subscribe(
        (res:any) => {
          console.log("select data  res >", res);
          if(res.return_status > 0){

            this.selectItemListPay = res.return_data;
            console.log('selectItemListPay',this.selectItemListPay);
            this.totalInterestAmt = res.total_interest_amt;
            this.totalGstAmt = res.total_gst_amt;
            this.totalTdsAmt = res.total_tds_amt;
            this.totalPayAmount = res.total_payable_amt;
            this.totalPayAmount_given = res.total_payable_amt;
            this.totalCgstAmt = res.total_cgst_amt;
            this.totalSgstAmt = res.total_sgst_amt;
            this.invoice_id = res.invoice_id;
            this.transaction_id = res.transaction_id;
            this.show_invoice_number = res.show_invoice_number;
            this.invoice_paid_amount = res.invoice_paid_amount;



            //===== angular calulation day respect show start =======
              /* // sum calculate
              this.total_sum = (res.return_data.reduce((sum, item) => sum + item.interest_amt, 0)).toFixed(2);

              this.model.interest_pay_amount = this.total_sum;

              // sorting array desc order for day
                this.selectItemList = res.return_data.sort(this.sortArrayNumberDescOrder);
                console.log('sortArrayVal >', this.selectItemList);

                // array with looping
                this.selectItemList.forEach((element) => {
                  console.log('elementttttttttttttttttttttttttttttttttttt ####### (tds check) =>', element.tds);
                  this.is_check_tds = element.tds;
                }); */
              //===== angular calulation day respect show end =======
              
              setTimeout(() => {
                this.is_loading_complite = true;
              }, 100);

          }
          this.showLoading = false;
        },
        errRes => {
          this.showLoading = false;
        }
      );
    });
  }

  // onPayInterestGive
  onPayInterestGive(_amt){
    // console.log('_amt >>>>>>>>>>>>>', _amt);
    // if(_amt){
      
      this.selectItemListPay.forEach(element => {
        element.payable_amt = null;
      });
      // this.selectItemListPay[0].payable_amt = this.totalPayAmount_given;
    // }
  }

  //..... pay interest divided calculation start......
    /* calculation_showTotal = 0;
     onPayInterestDivided(_value, _itemsArray){
      console.log('this.model.interest_pay_amount >', _value);
      if(_value){

        for (let i = 0; i < _itemsArray.length ; i++) {
          if(_value >= _itemsArray[i].interest_amt){

            _itemsArray[i].interest_amount_pay =  _itemsArray[i].interest_amt;
            
            _itemsArray[i].interest_amount_pay = _value - _itemsArray[i].interest_amt;
            _value = _itemsArray[i].interest_amount_pay; //update value
        
            if(_itemsArray.length - 1 == i){
              // console.log('sucess >', _value);
              // console.log('sucess _itemsArray[i].interest_amt >', _itemsArray[i].interest_amt);
              if(_value >= _itemsArray[i].interest_amt){
                _itemsArray[i].interest_amount_pay = _value + _itemsArray[i].interest_amt;
              }else{
                _itemsArray[i].interest_amount_pay = _value ;
              }
            }else{
              // console.log('error >', _itemsArray[i].interest_amt);
              
              _itemsArray[i].interest_amount_pay = _itemsArray[i].interest_amt;
              this.calculation_showTotal = this.calculation_showTotal + _itemsArray[i].interest_amt;
              // console.log('calculation_showTotal >', this.calculation_showTotal);
            }
          }else{
            // console.log('small value 11 >>>', _value);
            _itemsArray[i].interest_amount_pay = _value;
            break;
          }

        }

      }else{
        _itemsArray.forEach(element => {
          element.interest_amount_pay = '';
        });
      }
    } */

    //============== working code ============
    /* onPayInterestDivided(_value, _itemsArray){
      console.log('this.model.interest_pay_amount >', _value);
      if(_value){

        // start loop
        for (var i = 0; i < _itemsArray.length ; i++) {
          if(_value >= _itemsArray[i].interest_amt){

            _itemsArray[i].interest_amount_pay =  _itemsArray[i].interest_amt;
            
            _value = _value - _itemsArray[i].interest_amt;
            
          }else{
            // console.log('small value 11 >>>', _value);
            _itemsArray[i].interest_amount_pay = _value;
            _value = 0;
            // break;
          }

        }
        // end loop
        _itemsArray[i - 1].interest_amount_pay = parseFloat(_itemsArray[i - 1].interest_amount_pay) + parseFloat(_value);

      }else{
        _itemsArray.forEach(element => {
          element.interest_amount_pay = '';
        });
      }
    } */

    claculateValue;
    calculateTds;
    onPayInterestDivided(_value, _itemsArray){
      this.claculateValue = '';
      this.calculateTds = '';
      // console.log('this.model.interest_pay_amount >', _value);
      // console.log('interest _itemsArray >', _itemsArray);
      if(_value){

        // start loop
        for (var i = 0; i < _itemsArray.length ; i++) {
          if(_value >= _itemsArray[i].interest_amt){

            _itemsArray[i].totalInterestAmount =  _itemsArray[i].interest_amt;
            
            _value = _value - _itemsArray[i].interest_amt;
           
          }else{
             // console.log('small value 11 >>>', _value);
             _itemsArray[i].totalInterestAmount = _value;
             _value = 0;
             // break;
          }

        }
        // end loop

        _itemsArray[i - 1].totalInterestAmount = parseFloat(_itemsArray[i - 1].totalInterestAmount) + parseFloat(_value);

      }else{
        _itemsArray.forEach(element => {
          element.interest_amount_pay = 0;
          element.interest_amount_pay_tds = 0;
          element.tatoalAddAmount = 0;
          element.totalInterestAmount = 0;
        });
      }
    }

  //..... pay interest divided calculation end......

  // array short desc order for interest_days
  sortArrayNumberDescOrder(a, b) {
    return  b.interest_days - a.interest_days;
  }

  // -----datepicker start------

    datePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      toDate: new Date(),
      closeOnSelect: true,
      yearInAscending: true
    };

    // get selected date
    myFunction(){
      console.log('get seleted date')
    }
  // datepicker 

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

          this.selectItem = '';
          this.selectItemArray = [];
          this.selectItemArrayItem = [];
    
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

  // --------------- item amount change start ---------------------
    totalSumTdsAmount:any;
    totalSumGstAmount:any;
    totalSumInterestAmount:any;
    totalSumTdsInterestAmount:any;
    disableSubmitButton = false;
    itemAmountChange(_item, _items){

      console.log('my item AAAAAAAAAa >', _item);
      console.log('this.identifire AA>', this.identifire);

      if(_item.interest_amount_pay == undefined || _item.interest_amount_pay == ''){
        _item.interest_amount_pay = 0;
      }else if(_item.interest_amount_pay_tds == undefined || _item.interest_amount_pay_tds == ''){
        _item.interest_amount_pay_tds = 0;
      }else if(_item.totalInterestAmount1 == ''){
        _item.totalInterestAmount1 = 0;
      }


      // total sum
      this.totalSumTdsAmount = 0;
      this.totalSumGstAmount = 0;
      this.totalSumInterestAmount = 0;
      this.totalSumTdsInterestAmount = 0;
      this.calculateTds =0;
      this.claculateValue =0;
      this.calculateGST =0;
      this.claculategstValue =0;

      _items.forEach(element => {
        console.log('element element.gstelement.gstelemen  >>>>>>>>>>', element);
        // tds clalulate
        if(this.identifire == 'Add Interest'){
          this.calculateTds = parseFloat(element.totalInterestAmount) * element.tds /100;
        }else{
          this.calculateTds = parseFloat(element.totalInterestAmount) * element.brokerage_tds /100;
        }

       
        /* this.claculateValue = parseFloat(element.totalInterestAmount) - parseFloat(this.calculateTds);
        element.interest_amount_pay = this.claculateValue.toFixed(2);
        element.interest_amount_pay_tds = this.calculateTds.toFixed(2);
        // element.interest_amount_pay1 = element.interest_amount_pay;
        element.totalInterestAmount1 = (parseFloat(this.claculateValue) + parseFloat(this.calculateTds)).toFixed(2); */

        // gst calculation
        if(this.identifire == 'Add Brokerage'){
          this.calculateGST = parseFloat(element.totalInterestAmount) * element.gst /100;
          this.claculateValue = parseFloat(element.totalInterestAmount) - parseFloat(this.calculateTds) -  parseFloat(this.calculateGST);

          element.brokerage_gst = this.calculateGST.toFixed(2);
          element.interest_amount_pay = this.claculateValue.toFixed(2);
          element.interest_amount_pay_tds = this.calculateTds.toFixed(2);
          element.totalInterestAmount1 = (parseFloat(this.claculateValue) + parseFloat(this.calculateTds) + parseFloat(this.calculateGST) ).toFixed(2);

        }else{
          // this.calculateTds = parseFloat(element.totalInterestAmount) * element.tds /100;
          this.claculateValue = parseFloat(element.totalInterestAmount) - parseFloat(this.calculateTds);
          
          element.interest_amount_pay = this.claculateValue.toFixed(2);
          element.interest_amount_pay_tds = this.calculateTds.toFixed(2);
          // element.interest_amount_pay1 = element.interest_amount_pay;
          element.totalInterestAmount1 = (parseFloat(this.claculateValue) + parseFloat(this.calculateTds)).toFixed(2);
        }

        // sum total
        this.totalSumInterestAmount = (parseFloat(this.totalSumInterestAmount) + (parseFloat(element.interest_amount_pay))).toFixed(2);
        this.totalSumTdsAmount = (parseFloat(this.totalSumTdsAmount) + (parseFloat(element.interest_amount_pay_tds))).toFixed(2);
        this.totalSumTdsInterestAmount = (parseFloat(this.totalSumTdsInterestAmount) + (parseFloat(element.totalInterestAmount1))).toFixed(2);
        // gst sum total
        this.totalSumGstAmount = (parseFloat(this.totalSumGstAmount) + (parseFloat(element.brokerage_gst))).toFixed(2);


      });
      
    }
    
  // item amount change end

  // ----- menual Item Amount Change start -----
    priceModelValue;
    menualItemAmountChange(_item, _items){

      console.log('my item BBBBBBB >', _item);

      if(_item.interest_amount_pay == undefined || _item.interest_amount_pay == ''){
        _item.interest_amount_pay = 0;
      }else if(_item.interest_amount_pay_tds == undefined || _item.interest_amount_pay_tds == ''){
        _item.interest_amount_pay_tds = 0;
      }else if(_item.totalInterestAmount1 == ''){
        _item.totalInterestAmount1 = 0;
      }

       // tds clalulate
       let calculateTdsMenual:any;
       let calculateGstMenual:any;
       let claculateValueMenual:any;

      if(this.identifire == 'Add Interest'){
        calculateTdsMenual = parseFloat(_item.totalInterestAmount1) * _item.tds /100;
      }else{
        calculateTdsMenual = parseFloat(_item.totalInterestAmount1) * _item.brokerage_tds /100;
      }

      //  calculateTdsMenual = parseFloat(_item.totalInterestAmount1) * _item.tds /100;
      /*  claculateValueMenual = parseFloat(_item.totalInterestAmount1) - parseFloat(calculateTdsMenual);
       _item.interest_amount_pay = claculateValueMenual.toFixed(2);
       _item.interest_amount_pay_tds = calculateTdsMenual.toFixed(2); */

       // gst calculation
       if(this.identifire == 'Add Brokerage'){
        calculateGstMenual = parseFloat(_item.totalInterestAmount1) * _item.gst /100;
        claculateValueMenual = parseFloat(_item.totalInterestAmount1) - parseFloat(calculateTdsMenual) - parseFloat(calculateGstMenual) ;

        _item.brokerage_gst = calculateGstMenual.toFixed(2);
        _item.interest_amount_pay = claculateValueMenual.toFixed(2);
       _item.interest_amount_pay_tds = calculateTdsMenual.toFixed(2);
        
      }else{
        //  calculateTdsMenual = parseFloat(_item.totalInterestAmount1) * _item.tds /100;
        claculateValueMenual = parseFloat(_item.totalInterestAmount1) - parseFloat(calculateTdsMenual);

        _item.interest_amount_pay = claculateValueMenual.toFixed(2);
        _item.interest_amount_pay_tds = calculateTdsMenual.toFixed(2);
      }

      // total sum
      this.totalSumTdsAmount = 0;
      this.totalSumGstAmount = 0;
      this.totalSumInterestAmount = 0;
      this.totalSumTdsInterestAmount = 0;
      this.calculateGST =0;
      this.claculategstValue =0;

      _items.forEach(element => {

        // sum total
        this.totalSumInterestAmount = (parseFloat(this.totalSumInterestAmount) + (parseFloat(element.interest_amount_pay))).toFixed(2);
        this.totalSumTdsAmount = (parseFloat(this.totalSumTdsAmount) + (parseFloat(element.interest_amount_pay_tds))).toFixed(2);
        this.totalSumTdsInterestAmount = (parseFloat(this.totalSumTdsInterestAmount) + (parseFloat(element.totalInterestAmount1))).toFixed(2);

        // sum gst total
        this.totalSumGstAmount = (parseFloat(this.totalSumGstAmount) + (parseFloat(_item.brokerage_gst))).toFixed(2);

      });

      //---------------- disable submit button ---------
      this.priceModelValue = parseFloat(this.model.interest_pay_amount).toFixed(2);
      if(this.totalSumTdsInterestAmount != this.priceModelValue ){
        this.disableSubmitButton = true;
        this.commonUtils.presentToast('info', 'Amount Mismatch');
      }else{
        this.disableSubmitButton = false;
      }
      
    }
  // menual Item Amount Change end

 
  // close modal
  closeModal(){
    // this.modalController.dismiss(this.arrayList);
    this.modalController.dismiss();
  }

  // destroy call
  ngOnDestroy(){
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.selectDataSubscribe !== undefined){
      this.selectDataSubscribe.unsubscribe();
    }
  }

}
