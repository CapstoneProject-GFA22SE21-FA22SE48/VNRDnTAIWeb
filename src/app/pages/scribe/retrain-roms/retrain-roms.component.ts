import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { ValidateAccount } from 'src/services/validateAccount.service';

@Component({
  selector: 'app-retrain-roms',
  templateUrl: './retrain-roms.component.html',
  styleUrls: ['./retrain-roms.component.css']
})
export class RetrainRomsComponent implements OnInit {
  roms: any;
  tmpRoms: any;

  selectedRom: any;

  displayImgEvidence: boolean = false;
  displayResolveRom: boolean = false;

  //start of filtering data
  status: any[] = [
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
  
  constructor(
    private isLoadingService: IsLoadingService,
    private wrapperService: WrapperService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private validateAccount: ValidateAccount,
  ) { }

  ngOnInit(): void {
    this.validateAccount.isActiveAccount();
    this.loadRoms();
  }

  loadRoms() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetRetrainRomList +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.roms = response.data;
          this.tmpRoms = this.roms;
          // this.filterData();

          console.log(this.roms);
          

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
    this.validateAccount.isActiveAccount();
    this.roms = this.tmpRoms.slice();

    //filter by "Trạng thái"
    if (this.filterStatusCode) {
      this.roms = this.roms?.filter(
        (r: any) => r.status === this.filterStatusCode
      )
    }

    //filter by date range
    if (this.filterRangeDates) {
      const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
      const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

      if (startDate && endDate) {
        this.roms = this.roms?.filter((r: any) => {
          return (
            r?.createdDate.toLocaleString().slice(0, 10) >= startDate &&
            r?.createdDate.toLocaleString().slice(0, 10) <= endDate
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

  viewImgEvidence(rom: any){
    this.selectedRom = rom;
    this.displayImgEvidence = true;
  }

  confirmClaimRom(event: any, rom: any) {
    this.validateAccount.isActiveAccount();
    this.selectedRom = rom;

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
          paths.ScribeClaimRetrainRom +
            '/' +
            this.selectedRom.id,
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

  clearData(){
    this.selectedRom = undefined;
    this.displayImgEvidence = false;
  }

  resolveRom(rom: any){
    this.validateAccount.isActiveAccount();
    this.selectedRom = rom;
    this.displayResolveRom = true;

    
  }
}
