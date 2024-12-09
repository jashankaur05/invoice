import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: true
      }
    ]
  },
  // {
  //   id: 'page',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'Authentication',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'ti ti-key',
  //       children: [
  //         {
  //           id: 'login',
  //           title: 'Login',
  //           type: 'item',
  //           url: '/guest/login',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'register',
  //           title: 'Register',
  //           type: 'item',
  //           url: '/guest/register',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'ti ti-typography'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'ti ti-brush'
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://tabler-icons.io/',
  //       icon: 'ti ti-plant-2',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'ti ti-brand-chrome'
  //     },
  //     {
  //       id: 'import',
  //       title: 'Import',
  //       type: 'item',
  //       url: '/import',
  //       classes: 'nav-item',
  //       icon: 'ti ti-file-import'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'ti ti-vocabulary',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },
  {
    id: 'company',
    title: 'Company',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'add-company',
        title: 'Add Company',
        type: 'item',
        url: '/add-company',
        classes: 'nav-item',
        icon: 'ti ti-table'
      }
    ]
  },
  {
    id: 'customer',
    title: 'Customers',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      // {
      //   id: 'customer-list',
      //   title: 'Customer List',
      //   type: 'item',
      //   url: '/customer-list',
      //   classes: 'nav-item',
      //   icon: 'ti ti-table'
      // },
      {
        id: 'add-customer',
        title: 'Add Customer',
        type: 'item',
        url: '/add-customer',
        classes: 'nav-item',
        icon: 'ti ti-table'
      },
    ]
  },
  {
    id: 'invoice',
    title: 'Invoice',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'invoice-list',
        title: 'Invoice List',
        type: 'item',
        url: '/invoice',
        classes: 'nav-item',
        icon: 'ti ti-table'
      },
      {
        id: 'invoice',
        title: 'Generate Invoice',
        type: 'item',
        url: '/generate-invoice',
        classes: 'nav-item',
        icon: 'ti ti-file-dollar'
      },
    ]
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
