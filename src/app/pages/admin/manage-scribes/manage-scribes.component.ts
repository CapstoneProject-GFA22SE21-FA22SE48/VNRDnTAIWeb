import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/General.model';
import { getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';

@Component({
  selector: 'app-manage-scribes',
  templateUrl: './manage-scribes.component.html',
  styleUrls: ['./manage-scribes.component.css']
})
export class ManageScribesComponent implements OnInit {

  tmpScribes: User[] = [];
  scribes: User[] = [];
  status: any = [
    {
      name: 'Hoạt động',
    },
    { name: 'Ngưng hoạt động' },
  ];

  selectedScribe: any;
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
    this.loadScribes();
  }
  
  loadScribes() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetScribes, getStorageToken(), {
      successCallback: (response) => {
        this.scribes = response.data;
        this.tmpScribes = response.data;
        
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  viewInfo(scribe: User) {
    this.isLoadingService.add();
    this.selectedScribe = scribe;
    // this.wrapperService.get(
      // paths.AdminGetScribeComments + '/' + this.selectedScribe.id,
      // getStorageToken(),
      // {
      //   successCallback: (response) => {
      //     this.userComments = response?.data;
      //     this.isLoadingService.remove();
      //   },
      //   errorCallback: (error) => {
      //     console.log(error);
      //     this.isLoadingService.remove();
      //   },
      // }
    // );
  }

  // closeInfo() {
  //   this.selectedScribe = undefined;
  // }

  // closeDateRangePick() {
  //   if (this.filterRangeDates[1]) {
  //     this.calendar.overlayVisible = false;
  //     this.filterData();
  //   }
  // }

  // filterData() {
  //   this.scribes = this.tmpScribes;

  //   //Search
  //   if (this.searchStr != '') {
  //     this.scribes = this.scribes.filter((m) =>
  //       m.username?.toLowerCase().includes(this.searchStr.toLowerCase())
  //     );
  //   } else {
  //     this.scribes = this.tmpScribes;
  //   }

  //   //Status
  //   if (this.filterStatus) {
  //     if (this.filterStatus.name === 'Hoạt động') {
  //       this.scribes = this.scribes.filter((m) => m.status === 5);
  //     } else {
  //       this.scribes = this.scribes.filter((m) => m.status === 6);
  //     }
  //   }

  //   //Date Range
  //   if (this.filterRangeDates) {
  //     const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
  //     const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

  //     if (startDate && endDate) {
  //       this.scribes = this.scribes.filter((m) => {
  //         return (
  //           m.createdDate.toLocaleString().slice(0, 10) >= startDate &&
  //           m.createdDate.toLocaleString().slice(0, 10) <= endDate
  //         );
  //       });
  //     }
  //   }
  // }

  // confirmDeactivateScribe() {
  //   this.isLoadingService.add();
  //   this.confirmationService.confirm({
  //     key: 'cdDeactivate',
  //     message:
  //       'Các bình luận của người dùng này đồng thời bị gỡ bỏ. Bạn có chắc chắn?',
  //     accept: () => {
  //       this.wrapperService.put(
  //         paths.AdminDeactivateScribe + '/' + this.selectedScribe?.id,
  //         this.selectedScribe,
  //         getStorageToken(),
  //         {
  //           successCallback: (response) => {
  //             this.loadScribes();
  //             this.viewInfo(response.data);
  //             this.messageService.add({
  //               key: 'deactivateSuccess',
  //               severity: 'success',
  //               summary: 'Thành công',
  //               detail: 'Cập nhật dữ liệu thành công',
  //             });
  //             this.isLoadingService.remove();
  //           },
  //           errorCallback: (error) => {
  //             console.log(error);
  //             this.messageService.add({
  //               key: 'deactivateFail',
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

  // confirmReEnableScribe() {
  //   this.isLoadingService.add();
  //   this.confirmationService.confirm({
  //     key: 'cdReEnable',
  //     message:
  //       'Tài khoản thành viên này sẽ được kích hoạt trở lại. Bạn có chắc chắn?',
  //     accept: () => {
  //       this.wrapperService.put(
  //         paths.AdminReEnableScribe + '/' + this.selectedScribe?.id,
  //         this.selectedScribe,
  //         getStorageToken(),
  //         {
  //           successCallback: (response) => {
  //             this.loadScribes();
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
