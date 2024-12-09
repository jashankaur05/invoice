import { CustomerComponent } from './modules/customer/customer.component';
import { AddCompanyComponent } from './modules/company/add-company/add-company.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './shared/modules/admin/admin.component';
import { InvoiceGuard } from './core/guard/invoice.guard';
import { CompanySelectGuard } from './core/guard/company-select.guard';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/default',
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'import',
        loadComponent: () => import('./modules/import/import.component').then((m) => m.ImportComponent)
      },
      // {
      //   path: 'customer-list',
      //   loadComponent: () => import('./modules/customer/customer.component').then((m) => m.CustomerComponent)
      // },
      {
        path: 'add-customer',
        loadComponent: () => import('./modules/customer/add-customer/add-customer.component').then((m) => m.AddCustomerComponent),
        canActivate: [CompanySelectGuard]
      },
      {
        path: 'add-company',
        loadComponent: () => import('./modules/company/add-company/add-company.component').then((m) => m.AddCompanyComponent)
      },
      {
        path: 'generate-invoice',
        loadComponent: () => import('./modules/invoice/invoice-form/invoice-form.component').then((m) => m.InvoiceFormComponent),
        canActivate: [CompanySelectGuard]
      },
      {
        path: 'edit-invoice/:id',
        loadComponent: () => import('./modules/invoice/invoice-form/invoice-form.component').then((m) => m.InvoiceFormComponent),
        canActivate: [InvoiceGuard, CompanySelectGuard]
      },
      {
        path: 'invoice',
        loadComponent: () => import('./modules/invoice/invoice-list/invoice-list.component').then((m) => m.InvoiceListComponent),
        canActivate: [CompanySelectGuard]
      },
      {
        path: 'invoice-view/:id',
        loadComponent: () => import('./modules/invoice/invoice-view/invoice-view.component').then((m) => m.InvoiceViewComponent),
        canActivate: [CompanySelectGuard]
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/user-login/user-login.component').then((m) => m.UserLoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/register/register.component').then((m) => m.RegisterComponent)
  },
];
