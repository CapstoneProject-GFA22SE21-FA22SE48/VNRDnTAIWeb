import { Component, OnInit } from '@angular/core';
import {
  decodeToken,
  verifyLocalStorageToken,
  verifySessionStorageToken,
} from 'src/app/utilities/jwt.util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  items: any[] = [];

  adminSidebarItems: any[] = [
    {
      label: 'Bảng điều khiển',
      routerLink: '/admin/dashboard',
    },
    {
      label: 'Quản lý yêu cầu',
      routerLink: '/admin/manage-roms',
    },
    {
      label: 'Quản lý nhân viên',
      routerLink: '/admin/manage-scribes',
    },
    {
      label: 'Quản lý người dùng',
      routerLink: '/admin/manage-users',
    },
  ];

  scribeSidebarItems: any[] = [
    {
      label: 'Bảng điều khiển',
      routerLink: '/admin/dashboard',
    },
    {
      label: 'Quản lý luật',
      routerLink: '/admin/manage-laws',
    },
    {
      label: 'Quản lý biển báo',
      routerLink: '/admin/manage-signs',
    },
    {
      label: 'Quản lý câu hỏi thi GPLX',
      routerLink: '/admin/manage-questions',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    if (verifySessionStorageToken()) {
      const token = sessionStorage.getItem('token') != '' ? sessionStorage.getItem('token') : '';
      switch (parseInt(decodeToken(token ? token : '').Role)) {
        case 0:
          this.items = this.adminSidebarItems;
          break;
        case 1:
          this.items = this.scribeSidebarItems;
          break;
        default:
          this.items = [];
      }
    } else if (verifyLocalStorageToken()) {
      const token = localStorage.getItem('token') != '' ? localStorage.getItem('token') : '';
      switch (parseInt(decodeToken(token ? token : '').Role)) {
        case 0:
          this.items = this.adminSidebarItems;
          break;
        case 1:
          this.items = this.scribeSidebarItems;
          break;
        default:
          this.items = [];
      }
    }
  }
}
