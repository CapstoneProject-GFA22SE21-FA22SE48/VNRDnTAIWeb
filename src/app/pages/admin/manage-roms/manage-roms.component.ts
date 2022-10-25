import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-manage-roms',
  templateUrl: './manage-roms.component.html',
  styleUrls: ['./manage-roms.component.css'],
})
export class ManageRomsComponent implements OnInit {
  roms: any;
  tmpRoms: any;
  selectedRom: any;

  //start of filtering data
  filterSearchStr: any;

  status: any[] = [
    { statusName: 'Chờ duyệt', statusCode: 0 },
    { statusName: 'Đã xác nhận', statusCode: 3 },
    { statusName: 'Đang hoạt động', statusCode: 6 },
    { statusName: 'Ngưng hoạt động', statusCode: 7 },
    { statusName: 'Đã từ chối', statusCode: 5 },
    { statusName: 'Đã duyệt', statusCode: 4 },
  ];
  filterStatusCode: any;

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;

  requesters: any;
  filterRequesterId: any;

  romTypes: any[] = [
    { romTypeName: 'Luật', romTypeCode: 1 },
    { romTypeName: 'Biển báo', romTypeCode: 2 },
    { romTypeName: 'Câu hỏi', romTypeCode: 3 },
    { romTypeName: 'Đề xuất', romTypeCode: 4 },
  ];
  filterRomTypeCode: any;
  //end of filtering data

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    this.loadRoms();
  }

  loadRoms() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetRomList + '/' + decodeToken(getStorageToken() || '').Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.roms = response.data.lawRoms
            .concat(response.data.signRoms)
            .concat(response.data.questionRoms)
            .concat(response.data.userRoms);

          this.tmpRoms = this.roms;
          this.requesters = [];

          this.roms.forEach((rom: any) => {
            if (
              !this.requesters.some(
                (r: any) =>
                  r.requesterId === rom.scribeId ||
                  r.requesterId === rom.userId ||
                  r.requesterId === rom.promotingAdminId
              )
            ) {
              this.requesters.push({
                requesterId: rom.scribeId || rom.userId || rom.promotingAdminId,
                requesterName: rom.username || rom.promotingAdminUsername,
              });
            }
          });

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  //start of filtering data
  filterData() {
    this.roms = this.tmpRoms.slice();

    //Filter by "Loại"
    if (this.filterRomTypeCode) {
      if (this.filterRomTypeCode === 1) {
        //law
        this.roms = this.roms.filter((r: any) => r.lawRomId);
      } else if (this.filterRomTypeCode === 2) {
        //sign
        this.roms = this.roms.filter((r: any) => r.signRomId);
      } else if (this.filterRomTypeCode === 3) {
        //question
        this.roms = this.roms.filter((r: any) => r.modifyingQuestionId);
      } else {
        this.roms = this.roms.filter((r: any) => r.modifyingUserId);
      }
    }

    //Filter by "Người yêu cầu"
    if (this.filterRequesterId) {
      this.roms = this.roms.filter(
        (r: any) =>
          r.ScribeId === this.filterRequesterId ||
          r.userId === this.filterRequesterId ||
          r.promotingAdminId === this.filterRequesterId
      );
    }

    //filter by "Trạng thái"
    if (this.filterStatusCode) {
      this.roms = this.roms.filter(
        (r: any) => r.status === this.filterStatusCode
      );
    }

    //filter by filterSearchStr
    if (this.filterSearchStr) {
      console.log(this.filterSearchStr);
      
      this.roms = this.roms.filter(
        (r: any) =>
          toNonAccentVietnamese(r.modifyingStatueName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modifyingSectionName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modifyingParagraphName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modifyingSignName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modifyingGpssignName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modifyingQuestionContent?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase())) ||
          toNonAccentVietnamese(r.modfifyingUserName?.toLowerCase()).includes(toNonAccentVietnamese(this.filterSearchStr.toLowerCase()))
      );
    }

    //filter by date range
    if (this.filterRangeDates) {
      const startDate = this.filterRangeDates[0]?.toLocaleDateString('sv');
      const endDate = this.filterRangeDates[1]?.toLocaleDateString('sv');

      if (startDate && endDate) {
        this.roms = this.roms.filter((r: any) => {
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
  //end of filtering data

  viewInfo(rom: any) {
    this.selectedRom = rom;
  }
}
