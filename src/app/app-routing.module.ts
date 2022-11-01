import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  { path: '', 
    redirectTo: 'transaction-list', 
    pathMatch: 'full' 
  }, // ================= Auth start ===================================
  { 
    path: 'auth',
    loadChildren: './pages/auth/auth.module#AuthPageModule',
  },
  { 
    path: 'forgot-password',
    loadChildren: './pages/auth/forgot-password/forgot-password.module#ForgotPasswordPageModule'
  },
  { 
    path: 'dashboard', 
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    canLoad: [AuthGuard]  
  }, // ================= Transaction start (list)==================================
  { path: 'transaction-list', 
    loadChildren: './pages/transaction_management/transaction-list/transaction-list.module#TransactionListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'interest-incurred', 
    loadChildren: './pages/transaction_management/interest-incurred/interest-incurred.module#InterestIncurredPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'recived-payment', 
    loadChildren: './pages/transaction_management/recived-payment/recived-payment.module#RecivedPaymentPageModule' ,
    canLoad: [AuthGuard]
  },
  { 
    path: 'reject-payment', 
    loadChildren: './pages/transaction_management/reject-payment/reject-payment.module#RejectPaymentPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'expiring-transaction', 
    loadChildren: './pages/transaction_management/expiring-transaction/expiring-transaction.module#ExpiringTransactionPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'group-transaction-list', 
    loadChildren: './pages/transaction_management/group-transaction-list/group-transaction-list.module#GroupTransactionListPageModule' ,
    canLoad: [AuthGuard]  
  }, 
  { 
    path: 'conflicted-transaction', 
    loadChildren: './pages/transaction_management/conflicted-transaction/conflicted-transaction.module#ConflictedTransactionPageModule',
    canLoad: [AuthGuard]
  },
  //---------------add edit Transaction start ------------
  { 
    path: 'add-transaction/:action/:id', 
    loadChildren: './pages/transaction_management/add-transaction/add-transaction.module#AddTransactionPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'add-recive-payment/:action/:id', 
    loadChildren: './pages/transaction_management/add-recive-payment/add-recive-payment.module#AddRecivePaymentPageModule',
    canLoad: [AuthGuard]
  }, //--------------- Transaction view start ------------
  { 
    path: 'transaction-view/:id', 
    loadChildren: './pages/transaction_management/transaction-view/transaction-view.module#TransactionViewPageModule',
    canLoad: [AuthGuard]
  },// ================= Brokerage start (list) ==================================
  { 
    path: 'brokerage-list', 
    loadChildren: './pages/brokerage_management/brokerage-list/brokerage-list.module#BrokerageListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'recived-brokerage-list', 
    loadChildren: './pages/brokerage_management/recived-brokerage-list/recived-brokerage-list.module#RecivedBrokerageListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'rejectedbrokerage-list', 
    loadChildren: './pages/brokerage_management/rejected-brokerage-list/rejected-brokerage-list.module#RejectedBrokerageListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'invoice-list', 
    loadChildren: './pages/brokerage_management/invoice-list/invoice-list.module#InvoiceListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'generate-invoice', 
    loadChildren: './pages/brokerage_management/generate-invoice/generate-invoice.module#GenerateInvoicePageModule',
    canLoad: [AuthGuard] 
  },
   //---------------add edit brokerage start ------------
  { 
    path: 'add-recive-brokerage/:action/:id', 
    loadChildren: './pages/brokerage_management/add-recive-brokerage/add-recive-brokerage.module#AddReciveBrokeragePageModule' 
  }, // ================= Contact Manager start (list) ==================================
  { 
    path: 'group-list', 
    loadChildren: './pages/contact_manager/group-list/group-list.module#GroupListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'client-list',
    loadChildren: './pages/contact_manager/compnay-list/compnay-list.module#CompnayListPageModule',
    canLoad: [AuthGuard] 
  }, //---------------add edit Transaction start ------------
  { 
    path: 'add-group/:action/:id', 
    loadChildren: './pages/contact_manager/add-group/add-group.module#AddGroupPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-company/:action/:id', 
    loadChildren: './pages/contact_manager/add-company/add-company.module#AddCompanyPageModule',
    canLoad: [AuthGuard] 
  }, // ================= Report Management start ==================================
  { 
    path: 'report-list11111', 
    loadChildren: './pages/report_management/report-list/report-list.module#ReportListPageModule',
    canLoad: [AuthGuard]   
  }, // ================= Organization Manager start (list)==================================
  { path: 'location-list', 
    loadChildren: './pages/organization-manager/locations-list/locations-list.module#LocationsListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'country-list', 
    loadChildren: './pages/organization-manager/country-list/country-list.module#CountryListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'state-list', 
    loadChildren: './pages/organization-manager/states-list/states-list.module#StatesListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'currency-list', 
    loadChildren: './pages/organization-manager/currency-list/currency-list.module#CurrencyListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'pages-list', 
    loadChildren: './pages/organization-manager/pages-list/pages-list.module#PagesListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'module-list', 
    loadChildren: './pages/organization-manager/modules-list/modules-list.module#ModulesListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'role-list', 
    loadChildren: './pages/organization-manager/role-list/role-list.module#RoleListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'report-list', 
    loadChildren: './pages/organization-manager/account-list/account-list.module#AccountListPageModule',
    canLoad: [AuthGuard] 
  }, //-------------add edit Organization Manager start-------------------
  { 
    path: 'add-location/:action/:id', 
    loadChildren: './pages/organization-manager/add-location/add-location.module#AddLocationPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-country/:action/:id', 
    loadChildren: './pages/organization-manager/add-country/add-country.module#AddCountryPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-state/:action/:id', 
    loadChildren: './pages/organization-manager/add-state/add-state.module#AddStatePageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-currency/:action/:id', 
    loadChildren: './pages/organization-manager/add-currency/add-currency.module#AddCurrencyPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-page/:action/:id', 
    loadChildren: './pages/organization-manager/add-page/add-page.module#AddPagePageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-module/:action/:id', 
    loadChildren: './pages/organization-manager/add-module/add-module.module#AddModulePageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-role/:action/:id', 
    loadChildren: './pages/organization-manager/add-role/add-role.module#AddRolePageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-report/:action/:id', 
    loadChildren: './pages/organization-manager/add-accounts/add-accounts.module#AddAccountsPageModule',
    canLoad: [AuthGuard]  
  }, // ================= Master Types start ==================================
  { 
    path: 'employee-list', 
    loadChildren: './pages/master_types/employee-list/employee-list.module#EmployeeListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'fiscalyear-list', 
    loadChildren: './pages/master_types/fiscal-year-list/fiscal-year-list.module#FiscalYearListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'accountbranch-list', 
    loadChildren: './pages/master_types/account-list/account-list.module#AccountListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'phonetype-list', 
    loadChildren: './pages/master_types/phonetype-list/phonetype-list.module#PhonetypeListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'emailtype-list', 
    loadChildren: './pages/master_types/emailtype-list/emailtype-list.module#EmailtypeListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'addresstype-list', 
    loadChildren: './pages/master_types/addresstype-list/addresstype-list.module#AddresstypeListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'graceday', 
    loadChildren: './pages/master_types/graceday-list/graceday-list.module#GracedayListPageModule',
    canLoad: [AuthGuard]   
  },
  { 
    path: 'notification-list', 
    loadChildren: './pages/master_types/notification-list/notification-list.module#NotificationListPageModule',
    canLoad: [AuthGuard]   
  },
  { 
    path: 'gst-list', 
    loadChildren: './pages/master_types/gst-list/gst-list.module#GstListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'tds-list', 
    loadChildren: './pages/master_types/tds-list/tds-list.module#TdsListPageModule',
    canLoad: [AuthGuard]
  },
  
  //-------------add edit Master Types start-------------------
  { 
    path: 'add-employee/:action/:id', 
    loadChildren: './pages/master_types/add-employee/add-employee.module#AddEmployeePageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-fiscalyear/:action/:id', 
    loadChildren: './pages/master_types/add-fiscalyear/add-fiscalyear.module#AddFiscalyearPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'add-account/:action/:id', 
    loadChildren: './pages/master_types/add-account/add-account.module#AddAccountPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-phonetype/:action/:id', 
    loadChildren: './pages/master_types/add-phonetype/add-phonetype.module#AddPhonetypePageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-emailtype/:action/:id', 
    loadChildren: './pages/master_types/add-emailtype/add-emailtype.module#AddEmailtypePageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-addresstype/:action/:id', 
    loadChildren: './pages/master_types/add-addresstype/add-addresstype.module#AddAddresstypePageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-graceday/:action/:id', 
    loadChildren: './pages/master_types/add-graceday/add-graceday.module#AddGracedayPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'add-notification/:action/:id/:identifier', 
    loadChildren: './pages/master_types/add-notification/add-notification.module#AddNotificationPageModule',
    canLoad: [AuthGuard]   
  },
  { 
    path: 'add-gst/:action/:id', 
    loadChildren: './pages/master_types/add-gst/add-gst.module#AddGstPageModule',
    canLoad: [AuthGuard]   
  },
  { 
    path: 'add-tds/:action/:id', 
    loadChildren: './pages/master_types/add-tds/add-tds.module#AddTdsPageModule',
    canLoad: [AuthGuard]
  },
  //error page
  { 
    path: 'error', 
    loadChildren: './pages/error/error.module#ErrorPageModule' 
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// RouterModule.forRoot(routes, { useHash: true })