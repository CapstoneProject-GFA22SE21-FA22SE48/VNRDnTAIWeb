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

  searchStr: string = '';
  filterStatus: any;

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

  closeDateRangePick() {
    if (this.filterRangeDates[1]) {
      this.calendar.overlayVisible = false;
      this.filterData();
    }
  }

  filterData() {
    this.members = this.tmpMembers;

    //Search
    if (this.searchStr != '') {
      this.members = this.members.filter((m) =>
        m.username?.toLowerCase().includes(this.searchStr.toLowerCase())
      );
    } else {
      this.members = this.tmpMembers;
    }
    

    //Status
    if (this.filterStatus) {
      if (this.filterStatus.name === 'Hoạt động') {
        this.members = this.members.filter((m) => m.status === 5);
      } else {
        this.members = this.members.filter((m) => m.status === 6);
      }
    }

    //Date Range
    if (this.filterRangeDates) {
      const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
      const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

      if (startDate && endDate) {
        this.members = this.members.filter((m) => {
          return (
            m.createdDate.toLocaleString().slice(0, 10) >= startDate &&
            m.createdDate.toLocaleString().slice(0, 10) <= endDate
          );
        });
      }
    }
  }
}
