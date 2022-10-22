import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User, Comment } from 'src/app/models/General.model';
import { getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
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

  selectedMember: any;
  userComments: Comment[] = [];

  searchStr: string = '';
  filterStatus: any;

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }
  
  loadMembers() {
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
    if (this.searchStr && this.searchStr.trim() != '') {
      this.members = this.members.filter((m) =>
      toNonAccentVietnamese(m.username?.toLowerCase()).includes(toNonAccentVietnamese(this.searchStr.toLowerCase()))
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

  confirmDeactivateMember() {
    this.isLoadingService.add();
    this.confirmationService.confirm({
      key: 'cdDeactivate',
      message:
        'Các bình luận của người dùng này đồng thời bị gỡ bỏ. Bạn có chắc chắn?',
      accept: () => {
        this.wrapperService.put(
          paths.AdminDeactivateMember + '/' + this.selectedMember?.id,
          this.selectedMember,
          getStorageToken(),
          {
            successCallback: (response) => {
              this.loadMembers();
              this.viewInfo(response.data);
              this.messageService.add({
                key: 'deactivateSuccess',
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật dữ liệu thành công',
              });
              this.isLoadingService.remove();
            },
            errorCallback: (error) => {
              console.log(error);
              this.messageService.add({
                key: 'deactivateFail',
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Có lỗi xảy ra',
              });
              this.isLoadingService.remove();
            },
          }
        );
      },
      reject: () => {
        this.isLoadingService.remove();
      },
    });
  }

  // confirmReEnableMember() {
  //   this.isLoadingService.add();
  //   this.confirmationService.confirm({
  //     key: 'cdReEnable',
  //     message:
  //       'Tài khoản thành viên này sẽ được kích hoạt trở lại. Bạn có chắc chắn?',
  //     accept: () => {
  //       this.wrapperService.put(
  //         paths.AdminReEnableMember + '/' + this.selectedMember?.id,
  //         this.selectedMember,
  //         getStorageToken(),
  //         {
  //           successCallback: (response) => {
  //             this.loadMembers();
  //             this.viewInfo(response.data);
  //             this.messageService.add({
  //               key: 'reEnableSuccess',
  //               severity: 'success',
  //               summary: 'Thành công',
  //               detail: 'Cập nhật dữ liệu thành công',
  //             });
  //             this.isLoadingService.remove();
  //           },
  //           errorCallback: (error) => {
  //             console.log(error);
  //             this.messageService.add({
  //               key: 'reEnableFail',
  //               severity: 'error',
  //               summary: 'Thất bại',
  //               detail: 'Có lỗi xảy ra',
  //             });
  //             this.isLoadingService.remove();
  //           },
  //         }
  //       );
  //     },
  //     reject: () => {
  //       this.isLoadingService.remove();
  //     },
  //   });
  // }
}
