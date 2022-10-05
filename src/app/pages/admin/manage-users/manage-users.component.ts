import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { User, Comment } from 'src/app/models/General.model';
import { getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  tmpMembers: User[] = [];
  members: User[] = [];
  status: any = [
    {
      name: 'Hoạt động',
    },
    { name: 'Ngưng hoạt động' },
  ];

  selectedMember: User | undefined;
  userComments: Comment[] = [];

  timeOut: any;
  searchStr: string = '';
  filterStatus: string = '';

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetMembers, getStorageToken(), {
      successCallback: (response) => {
        this.members = response.data;
        this.tmpMembers = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  viewInfo(member: User) {
    this.isLoadingService.add();
    this.selectedMember = member;

    this.wrapperService.get(
      paths.AdminGetMemberComments + '/' + this.selectedMember.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.userComments = response?.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  closeInfo() {
    this.selectedMember = undefined;
  }

  debounce(callback: any, wait: number = 800) {
    this.isLoadingService.add();
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(callback, wait);
    this.isLoadingService.remove();
  }

  search() {
    // if (this.filterStatus != '') {
    //   this.members = this.tmpMembers;

    //   if (this.filterStatus === 'Hoạt động') {
    //     this.members = this.members.filter((m) => m.status === 5);
    //   } else {
    //     this.members = this.members.filter((m) => m.status === 6);
    //   }
    // }
    this.debounce(() => {
      if (this.searchStr != '') {
        this.members = this.members.filter((m) =>
          m.username?.toLowerCase().includes(this.searchStr.toLowerCase())
        );
      } else {
        this.members = this.tmpMembers;
      }
    });
  }

  filterByStatus(event: any) {
    // if (this.searchStr == '') {
    //   this.members = this.tmpMembers;
    // }
    if (event.value) {
      if (event.value.name === 'Hoạt động') {
        this.members = this.members.filter((m) => m.status === 5);
      } else {
        this.members = this.members.filter((m) => m.status === 6);
      }
    } else {
      this.members = this.tmpMembers;
    }

    this.filterStatus = event.value?.name;
  }

  closeDateRangePick() {
    if (this.filterRangeDates[1]) {
      this.calendar.overlayVisible = false;
      this.filterByDate();
    }
  }

  filterByDate() {
    const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
    const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

    this.members = this.tmpMembers;
    this.members = this.members.filter((m) => {
      return m.createdDate >= startDate && m.createdDate <= endDate;
    });
  }
}
