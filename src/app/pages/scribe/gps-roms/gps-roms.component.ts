import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { EventEmitterService } from 'src/services/event-emitter.service';
import { ValidateAccount } from 'src/services/validateAccount.service';
@Component({
  selector: 'app-gps-roms',
  templateUrl: './gps-roms.component.html',
  styleUrls: ['./gps-roms.component.css'],
})
export class GpsRomsComponent implements OnInit{
  roms: any;
  tmpRoms: any;

  selectedRom: any;

  //start of filtering data
  filterSearchStr: any;

  status: any[] = [
    // { statusName: 'Chờ duyệt', statusCode: 1 }, //pending is 0 but dropdown of primeng need start from 1
    { statusName: 'Chưa tiếp nhận', statusCode: 1 },
    { statusName: 'Đã tiếp nhận', statusCode: 2 },
    { statusName: 'Đã duyệt', statusCode: 7 },
    { statusName: 'Đã từ chối', statusCode: 4 },
    { statusName: 'Đã xử lý', statusCode: 3 },
  ];
  filterStatusCode: any;

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;
  //end of filtering data

  displayRomDetailDialog: boolean = false;
  //start of text compare, using ngx-monaco-editor v2
  options = {
    theme: 'vs',
    renderOverviewRuler: false,
    contextmenu: false,
    fontSize: '18px',
    fontFamily: 'Jaldi',
    maxWidth: '100px',
  };

  originalModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };
  originalModelImg: any;

  changedModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };
  changedModelImg: any;
  //end of text compare, using ngx-monaco-editor v2

  //start of google map

  //end of google map

  constructor(
    private isLoadingService: IsLoadingService,
    private wrapperService: WrapperService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eventEmitterService: EventEmitterService,
    private validateAccount: ValidateAccount,
  ) {}
 
  ngOnInit(): void {
    this.validateAccount.isActiveAccount();
    this.loadRoms();

     //used for displaying rom detail when navigating from notification clicked
     this.eventEmitterService.invokeScribeNoti.subscribe((emittedRom: any) => {
      if (emittedRom !== null && emittedRom !== undefined) {
        var tmpRom = this.tmpRoms.filter((r: any) => {
          if(
            r.modifyingGpssignId !== undefined &&
            emittedRom.modifyingGpssignId !== undefined &&
            r.modifyingGpssignId === emittedRom.modifyingGpssignId
          ) {
            return r;
          } 
        })[0];
        this.viewInfo(tmpRom);
      }
    });
  }

  loadRoms() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetGpssignRomList +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.roms = response.data;
          this.tmpRoms = this.roms;
          this.filterData();

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  filterData() {
    this.roms = this.tmpRoms.slice();

    //filter by "Trạng thái"
    if (this.filterStatusCode) {
      this.roms = this.roms?.filter(
        (r: any) => r.status === this.filterStatusCode
      )
    }

    //filter by filterSearchStr
    if (this.filterSearchStr) {
      this.roms = this.roms?.filter((r: any) => {
        return r.modifyingGpssign?.sign?.name
          ? toNonAccentVietnamese(
              r.modifyingGpssign?.sign?.name?.toLowerCase()
            ).trim().includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase()).trim()
            )
          : null;
      });
    }

    //filter by date range
    if (this.filterRangeDates) {
      const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
      const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

      if (startDate && endDate) {
        this.roms = this.roms?.filter((r: any) => {
          return (
            r.createdDate.toLocaleString().slice(0, 10) >= startDate &&
            r.createdDate.toLocaleString().slice(0, 10) <= endDate
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

  viewInfo(rom: any) {
    this.validateAccount.isActiveAccount();
    this.selectedRom = rom;
    this.originalModel.code = '';
    this.changedModel.code = '';

    if (this.selectedRom?.modifiedGpssign !== null) {
      this.originalModel.code =
        `Biển:\n` +
        `\t${this.selectedRom?.modifiedGpssign?.sign?.name}\n` +
        `Kinh độ:\n` +
        `\t${this.selectedRom?.modifiedGpssign?.longitude}\n` +
        `Vĩ độ:\n` +
        `\t${this.selectedRom?.modifiedGpssign?.longitude}\n`;
    } else {
      this.originalModel.code = ' ';
    }

    if (this.selectedRom.operationType !== OperationType.Delete) {
      this.changedModel.code =
        `Biển:\n` +
        `\t${this.selectedRom?.modifyingGpssign?.sign?.name}\n` +
        `Kinh độ:\n` +
        `\t${this.selectedRom?.modifyingGpssign?.longitude}\n` +
        `Vĩ độ:\n` +
        `\t${this.selectedRom?.modifyingGpssign?.longitude}\n`;
    } else {
      this.changedModel.code = ' ';
    }

    this.displayRomDetailDialog = true;
  }

  confirmClaimRom(event: any) {
    this.validateAccount.isActiveAccount();
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmClaim',
      message: 'Sau khi tiếp nhận, bạn sẽ phải xử lý yêu cầu này. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedRom.scribeId = decodeToken(
          getStorageToken() || ''
        )?.Id;

        this.isLoadingService.add();
        this.wrapperService.put(
          paths.ScribeClaimGpssignRom +
            '/' +
            this.selectedRom.modifyingGpssign?.id,
          this.selectedRom,
          getStorageToken(),
          {
            successCallback: (response) => {
              this.clearData();
              this.loadRoms();
              this.messageService.add({
                severity: 'success',
                summary: commonStr.success,
                detail: commonStr.dataUpdatedSuccessfully,
              });
              this.isLoadingService.remove();
            },
            errorCallback: (error) => {
              this.clearData();
              this.loadRoms();
              this.messageService.add({
                severity: 'error',
                summary: commonStr.fail,
                detail: error?.response?.data || commonStr.errorOccur,
              });
              this.isLoadingService.remove();
            },
          }
        );
      },
      reject: () => {},
    });
  }

  clearData() {
    this.selectedRom = undefined;
    this.displayRomDetailDialog = false;
  }
}
