import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserRole } from 'src/app/models/General.model';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { Status } from 'src/app/common/status';
import { NotificationService } from 'src/services/notification.service';
import { SubjectType } from 'src/app/common/subjectType';
@Component({
  selector: 'app-manage-scribes',
  templateUrl: './manage-scribes.component.html',
  styleUrls: ['./manage-scribes.component.css'],
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

  searchStr: string = '';
  filterStatus: any;

  scribeDTO: any;

  admins: any;
  selectedAdmin: any;
  displayPromoteDialog: boolean = false;

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;

  monthYearPickNewScribeDTO: Date = new Date();

  // new scribe account
  newScribeUsername: any;
  isValidNewScribeUsername: boolean = true;
  inValidNewScribeUsernameMsg: any;

  newScribePassword: any;
  isValidNewScribePassword: boolean = true;

  newScribeConfirmPassword: any;
  isValidNewScribeConfirmPassword: boolean = true;

  isValidAddNewScribe: boolean = false;
  displayCreateScribe: boolean = false;
  //end of new scribe account

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadScribes();
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetAdmins, getStorageToken(), {
      successCallback: (response) => {
        this.admins = response.data?.filter(
          (a: any) => !(a.id === decodeToken(getStorageToken() || '')?.Id)
        );

        this.selectedAdmin = this.admins[0];
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
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

  confirmDeactivateScribe(i: number) {
    this.confirmationService.confirm({
      key: 'cdDeactivate',
      message:
        'Tài khoản nhân viên này sẽ bị ngưng hoạt động, nhân viên sẽ không còn quản lý các công việc đã được giao hiện tại, các yêu cầu sẽ được xóa vĩnh viễn. Bạn có chắc chắn?',
      accept: () => {
        this.wrapperService.put(
          paths.AdminDeactivateScribe + '/' + this.scribes[i]?.id,

          this.scribes[i],
          getStorageToken(),
          {
            successCallback: (response) => {
              this.loadScribes();
              this.scribeDTO = undefined;
              this.messageService.add({
                key: 'deactivateSuccess',
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật dữ liệu thành công',
              });
            },
            errorCallback: (error) => {
              console.log(error);
              this.messageService.add({
                key: 'deactivateFail',
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Có lỗi xảy ra. Vui lòng thử lại.',
              });
            },
          }
        );
      },
      reject: () => {},
    });
  }

  confirmReEnableScribe(i: number) {
    this.confirmationService.confirm({
      key: 'cdReEnable',
      message:
        'Tài khoản nhân viên này sẽ hoạt động bình thường trở lại. Bạn có chắc chắn?',
      accept: () => {
        this.wrapperService.put(
          paths.AdminReEnableScribe + '/' + this.scribes[i]?.id,
          this.scribes[i],
          getStorageToken(),
          {
            successCallback: (response) => {
              this.loadScribes();
              this.scribeDTO = undefined;
              this.messageService.add({
                key: 'reEnableSuccess',
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật dữ liệu thành công',
              });
            },
            errorCallback: (error) => {
              console.log(error);
              this.messageService.add({
                key: 'reEnableFail',
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Có lỗi xảy ra. Vui lòng thử lại.',
              });
            },
          }
        );
      },
      reject: () => {},
    });
  }

  filterData() {
    this.scribes = this.tmpScribes;

    //Search
    if (this.searchStr && this.searchStr.trim() != '') {
      this.scribes = this.scribes.filter((m) => {
        if (m.username) {
          return toNonAccentVietnamese(m.username?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchStr.toLowerCase())
          );
        } else {
          return m.gmail?.toLowerCase().includes(this.searchStr.toLowerCase());
        }
      });
    }

    //Status filter
    if (this.filterStatus) {
      if (this.filterStatus.name === 'Hoạt động') {
        this.scribes = this.scribes.filter((m) => m.status === 5);
      } else {
        this.scribes = this.scribes.filter((m) => m.status === 6);
      }
    }

    //Date Range filter
    if (this.filterRangeDates) {
      const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
      const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

      if (startDate && endDate) {
        this.scribes = this.scribes.filter((m) => {
          return (
            m.createdDate.toLocaleString().slice(0, 10) >= startDate &&
            m.createdDate.toLocaleString().slice(0, 10) <= endDate
          );
        });
      }
    }
  }

  closeDateRangePick() {
    if (this.filterRangeDates[1]) {
      this.calendar.overlayVisible = false;
      this.filterData();
    }
  }

  viewInfo(scribe: User, month: any, year: any) {
    this.isLoadingService.add();

    if (!month) {
      month = new Date().getMonth() + 1;
    }

    if (!year) {
      year = new Date().getFullYear();
    }

    this.wrapperService.get(
      paths.AdminGetScribeDetail + '/' + month + '/' + year + '/' + scribe.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.scribeDTO = response.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  reRenderScribeDTO() {
    this.viewInfo(
      this.scribeDTO,
      parseInt(
        this.monthYearPickNewScribeDTO.toLocaleDateString('sv').slice(5, 7)
      ),
      parseInt(
        this.monthYearPickNewScribeDTO.toLocaleDateString('sv').slice(0, 4)
      )
    );
  }

  promoteScribe() {
    this.scribeDTO.role = UserRole.ADMIN;

    this.isLoadingService.add();
    this.wrapperService.post(
      paths.AdminPromoteScribe,
      {
        scribeId: this.scribeDTO.id,
        promotingAdminId: decodeToken(getStorageToken() || '')?.Id,
        arbitratingAdminId: this.selectedAdmin?.id,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          if (
            response.data?.errorMessage === null ||
            response.data.errorMessage === undefined
          ) {
            //add notification
            this.notiService.create({
              subjectId: response.data?.scribe.id, //modifyingUserId
              subjectType: SubjectType.Promotion,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername:
                response.data?.promotingAdmin?.username || '',
              receiverId: response.data?.arbitratingAdmin?.id,
              receiverUsername: response.data?.arbitratingAdmin?.username,
              action: commonStr.requestPromote + ' ',
              relatedDescription:  response.data?.scribe?.username + ' thành quản trị viên',
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.messageService.add({
              severity: 'success',
              key: 'promoteSuccess',
              summary: commonStr.success,
              detail: commonStr.romCreatedSuccessfully,
            });
            this.displayPromoteDialog = false;
          } else {
            this.messageService.add({
              severity: 'warn',
              key: 'promoteFail',
              summary: commonStr.fail,
              detail: response.data?.errorMessage,
            });
            this.displayPromoteDialog = false;
          }
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          this.messageService.add({
            severity: 'error',
            key: 'promoteFail',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.displayPromoteDialog = false;
          this.isLoadingService.remove();
        },
      }
    );
  }

  getNewScribeUserame() {
    if (
      this.newScribeUsername &&
      this.newScribeUsername?.trim().length <= 255
    ) {
      if (
        this.tmpScribes.some(
          (s: any) => s.username === this.newScribeUsername.trim()
        )
      ) {
        this.isValidNewScribeUsername = false;
        this.inValidNewScribeUsernameMsg = 'Tên đăng nhập đã tồn tại';
      } else {
        this.isValidNewScribeUsername = true;
        this.inValidNewScribeUsernameMsg =
          'Vui lòng nhập tên đăng nhập (tối đa 255 ký tự)';
      }
    } else {
      this.isValidNewScribeUsername = false;
    }
    this.checkValidNewScribeAccount();
  }

  getNewScribePassword() {
    if (
      this.newScribePassword &&
      this.newScribePassword?.trim().length <= 20 &&
      this.newScribePassword.trim().length >= 6
    ) {
      this.isValidNewScribePassword = true;
      this.newScribeConfirmPassword = undefined;
      this.isValidNewScribeConfirmPassword = true;
    } else {
      this.isValidNewScribePassword = false;
    }
    this.checkValidNewScribeAccount();
  }

  getNewScribeConfirmPassword() {
    if (
      this.newScribeConfirmPassword &&
      this.newScribeConfirmPassword?.trim() === this.newScribePassword
    ) {
      this.isValidNewScribeConfirmPassword = true;
    } else {
      this.isValidNewScribeConfirmPassword = false;
    }
    this.checkValidNewScribeAccount();
  }

  checkValidNewScribeAccount() {
    if (
      this.isValidNewScribeUsername &&
      this.isValidNewScribePassword &&
      this.isValidNewScribeConfirmPassword &&
      this.newScribeUsername &&
      this.newScribeUsername.trim() !== '' &&
      this.newScribePassword &&
      this.newScribePassword.trim() !== '' &&
      this.newScribeConfirmPassword &&
      this.newScribeConfirmPassword.trim() !== ''
    ) {
      this.isValidAddNewScribe = true;
    } else {
      this.isValidAddNewScribe = false;
    }
  }

  clearNewScribeData() {
    this.newScribeUsername = undefined;
    this.isValidNewScribeUsername = true;
    this.inValidNewScribeUsernameMsg = undefined;

    this.newScribePassword = undefined;
    this.isValidNewScribePassword = true;

    this.newScribeConfirmPassword = undefined;
    this.isValidNewScribeConfirmPassword = true;

    this.isValidAddNewScribe = false;
    this.displayCreateScribe = false;
  }

  confirmAddNewScribeAccount(event: any) {
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmCreateNewScribe',
      message: 'Tài khoản nhân viên sẽ đi vào hoạt động. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoadingService.add();
        this.wrapperService.post(
          paths.AdminCreateNewScribe,
          {
            username: this.newScribeUsername,
            password: this.newScribePassword,
            role: UserRole.SCRIBE,
            status: Status.Active,
            createdDate: new Date(),
          },
          getStorageToken(),
          {
            successCallback: (response) => {
              this.clearNewScribeData();
              this.displayCreateScribe = false;
              this.loadScribes();

              this.messageService.add({
                severity: 'success',
                key: 'createScribeSuccess',
                summary: commonStr.success,
                detail: commonStr.dataUpdatedSuccessfully,
              });
              this.isLoadingService.remove();
            },
            errorCallback: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                key: 'createScribeFail',
                summary: commonStr.fail,
                detail: commonStr.errorOccur,
              });
              this.isLoadingService.remove();
            },
          }
        );
      },
      reject: () => {},
    });
  }
}
