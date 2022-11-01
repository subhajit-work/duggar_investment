import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { CommonUtils } from '../../services/common-utils/common-utils';
import{ AppComponent } from'../../app.component';


/* tslint:disable */ 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {

  isLoading = false;

  isLogin = true;
  userTypes;

  constructor( 
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private http : HttpClient,
    private storage: Storage,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/transaction-list');
        }
      }
    });
  }

  ionViewWillEnter() {

    // this.appComponent.userInfoData();

    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/transaction-list');
        }
      }
    });
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  //---------------- login form submit start-----------------
    onSubmitForm(form:NgForm){
      this.isLoading = true;
      // console.log('form >>', form);
      if(!form.valid){
        return;
      }
      const email = form.value.email;
      const password = form.value.password;

      if(this.isLogin){
        // login server data send
      }else{
        // signup server data send
      }

      this.authenticate(form, form.value);
      // form.reset();

    }

    // authenticate function
    authenticate(_form, form_data) {
      this.isLoading = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;
          if (this.isLogin) {
            authObs = this.authService.login('login', form_data)
          } else {
            // authObs = this.authService.signup(email, password);
          }
          authObs.subscribe(
            resData => {
  
              if(resData.return_status > 0)
              {
                console.log('user Type =============))))))))))))))>', resData.return_data.user_type);
                /* this.userTypes = this.commonUtils.userTypes;
                console.log('user Type =============))))))))))))))>', this.userTypes); */

                // this.appComponent.userInfoData();
                // this.appComponent.initializeApp();

                if(resData.return_data.user_type == 'group'){
                  this.router.navigateByUrl('/dashboard');
                }else{
                  this.router.navigateByUrl('/transaction-list');

                }

                /* setTimeout(() => {
                  // user menu call
                  this.appComponent.userInfoData();
                }, 10); */
                
                setTimeout(() => {
                  _form.reset();
                  loadingEl.dismiss();

                }, 2000);
                
              }else{
                loadingEl.dismiss();
                this.commonUtils.presentToast('error', resData.return_message[0]);
              }
              
              // console.log("data login after resData ++++++>", resData);
              this.isLoading = false;
              // loadingEl.dismiss();
              // this.router.navigateByUrl('/places/tabs/discover');
            },
            errRes => {
              loadingEl.dismiss();
            }
          );
        });
    }
  // login form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }


}
