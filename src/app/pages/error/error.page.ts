import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CommonUtils } from './../../services/common-utils/common-utils';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

  constructor(
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // menu show
    this.menuCtrl.enable(true);

  }

}
