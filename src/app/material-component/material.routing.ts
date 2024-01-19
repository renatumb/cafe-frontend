import {Routes} from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ManageCategoryComponent} from './manage-category/manage-category.component';
import {RouteGuardService} from '../services/route-guard.service';
import {ManageProductComponent} from './manage-product/manage-product.component';
import {ManageOrderComponent} from './manage-order/manage-order.component';
import {ViewBillComponent} from './view-bill/view-bill.component';
import {ManageUserComponent} from './manage-user/manage-user.component';


export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: ManageCategoryComponent,
    data: {
      expectedRole: ['admin']
    },
    canActivate: [RouteGuardService]
  },
  {
    path: 'product',
    component: ManageProductComponent,
    data: {
      expectedRole: ['admin']
    },
    canActivate: [RouteGuardService]
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    data: {
      expectedRole: ['admin', 'user']
    },
    canActivate: [RouteGuardService]
  },
  //
  {
    path: 'bill',
    component: ViewBillComponent,
    data: {
      expectedRole: ['admin', 'user']
    },
    canActivate: [RouteGuardService]
  },
  // -
  {
    path: 'user',
    component: ManageUserComponent,
    data: {
      expectedRole: ['admin', 'user']
    },
    canActivate: [RouteGuardService]
  }
];
