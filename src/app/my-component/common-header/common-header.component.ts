import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController, Platform, AlertController, ModalController } from '@ionic/angular';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { AppComponent } from '../../app.component';

/* tslint:disable */ 
@Component({
  selector: 'common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit, OnDestroy {

  get_user_dtls;
  main_url = environment.apiUrl;
  form_api;
  get_user_type;
  private logoutDataSubscribe: Subscription;

  constructor( 
    private authService: AuthService,
    private menuCtrl: MenuController,
    private http : HttpClient,
    private modalController : ModalController,
    private platform : Platform,
    private storage: Storage,
    private alertController : AlertController,
    private appComponent : AppComponent
    ) { }

  ngOnInit() {
    // console.log('get_global_params (headercomponent.ts) >', this.get_global_params);

    /* if(this.get_global_params != null){
      this.get_user_dtls = this.get_global_params.user;
    } */

    this.authService.globalparamsData.subscribe(res => {
      this.get_user_type = res.user_type;
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
      }
    });

  }

  ionViewWillEnter(){
    this.form_api = 'logout'; //logout api call
    this.authService.globalparamsData.subscribe(res => {
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
      }
    });
  }

  menuEnable = true;
  toggleMenu() {
    this.menuEnable =! this.menuEnable;
    console.log('click menu button');
    this.menuCtrl.enable(this.menuEnable);
    // this.menuCtrl.toggle();
  }

  // -----logout function start-------

  loadingShow = false;
  logOutUser(){
    this.onLogout();
  }
  //logout function end-

  // onLogout
  onLogout(){
    console.log('logout..................');
    // this.authService.logout();
    this.loadingShow = true;
    //edit data call
    this.logoutDataSubscribe = this.http.get('logout').subscribe(
      (res:any) => {
        this.loadingShow = false;
        console.log("Edit data  res >", res.return_data);
        if(res.return_status > 0){
          this.authService.logout();

          // user menu call
          // this.appComponent.userInfoData();

        }
      },
      errRes => {
        this.loadingShow = false;
      }
    );
  }

  //----get storage user data start---------
    get_global_params = this.authService.getTokenSessionMaster();
  // get storage user data start end


  // ..... change Password modal start ......
    async changePasswordOpenModal(_identifier, _item, _items) {
      // console.log('_identifier >>', _identifier);
      let principle_modal;
      if(_identifier == 'change_password_modal'){
        principle_modal = await this.modalController.create({
          component: AddCommonModelPage,
          cssClass: 'mymodalClass',
          componentProps: { 
            identifier: _identifier,
            modalForm_item: _item,
            modalForm_array: _items
          }
        });
      }else{
        principle_modal = await this.modalController.create({
          component: AddCommonModelPage,
          componentProps: { 
            identifier: _identifier,
            modalForm_item: _item,
            modalForm_array: _items
          }
        });
      }
      
      // modal data back to Component
      principle_modal.onDidDismiss()
      .then((getdata) => {
        // console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
          /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
        }

      });

      return await principle_modal.present();
    }
  // change Password   modal end 


  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.logoutDataSubscribe !== undefined){
      this.logoutDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}
