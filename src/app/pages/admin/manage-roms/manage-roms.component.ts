import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { OperationType } from 'src/app/common/operationType';
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
    // { statusName: 'Đang hoạt động', statusCode: 5 },
    // { statusName: 'Ngưng hoạt động', statusCode: 6 },
    { statusName: 'Đã duyệt', statusCode: 7 },
    { statusName: 'Đã từ chối', statusCode: 4 },
    { statusName: 'Đã xác nhận', statusCode: 3 },
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

  displayRomDetailDialog: boolean = false;

  //start of text compare, using ngx-monaco-editor v2
  options = {
    theme: 'vs',
    renderOverviewRuler: false,
    contextmenu: false,
    fontSize: '18px',
    fontFamily: 'Jaldi',
    maxWidth: '100px'
  };

  originalModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };

  changedModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };
  //end of text compare, using ngx-monaco-editor v2

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
          r.scribeId === this.filterRequesterId ||
          r.userId === this.filterRequesterId ||
          r.promotingAdminId === this.filterRequesterId
      );
    }

    //filter by "Trạng thái"
    if (this.filterStatusCode) {
      this.roms = this.roms?.filter(
        (r: any) => r.status === this.filterStatusCode
      );
    }

    //filter by filterSearchStr
    if (this.filterSearchStr) {
      this.roms = this.roms?.filter((r: any) => {
        return r.modifyingStatueName
          ? toNonAccentVietnamese(
              r.modifyingStatueName?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modifyingSectionName
          ? toNonAccentVietnamese(
              r.modifyingSectionName?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modifyingParagraphName
          ? toNonAccentVietnamese(
              r.modifyingParagraphName?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modifyingSignName
          ? toNonAccentVietnamese(r.modifyingSignName?.toLowerCase()).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modifyingGpssignName
          ? toNonAccentVietnamese(
              r.modifyingGpssignName?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modifyingQuestionContent
          ? toNonAccentVietnamese(
              r.modifyingQuestionContent?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
            )
          : r.modfifyingUserName
          ? toNonAccentVietnamese(r.modfifyingUserName?.toLowerCase()).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
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
  //end of filtering data

  viewInfo(rom: any) {
    this.selectedRom = rom;

    this.originalModel.code = '';
    this.changedModel.code = '';

    if (this.selectedRom.lawRomId) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.AdminGetLawRomDetail + '/' + this.selectedRom.lawRomId,
        getStorageToken(),
        {
          successCallback: (response) => {
            console.log(response.data);

            if (response.data.modifyingStatue !== null) {
              this.selectedRom.modifyingStatue = response.data.modifyingStatue;
              if(!this.selectedRom.modifyingStatue.isDeleted) {
                this.changedModel.code =
                `Tên:\n` +
                `\t${this.selectedRom.modifyingStatue?.name}\n` +
                `Nội dung:\n` +
                `\t${this.selectedRom.modifyingStatue?.description}\n`;
              }
              
              if (response.data.modifiedStatue !== null) {
                this.selectedRom.modifiedStatue = response.data.modifiedStatue;
                this.originalModel.code =
                  `Tên:\n` +
                  `\t${this.selectedRom.modifiedStatue?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedStatue?.description}\n`;
              }
            } else if (response.data.modifyingSection !== null) {
              this.selectedRom.modifyingSection =
                response.data.modifyingSection;

                // paragraph list of section if had
                // var pStr = ``;
                // if (this.selectedRom.modifyingSection.paragraphs !== null) {
                //   this.selectedRom.modifyingSection?.paragraphs?.forEach(
                //     (p: any) => {
                //       pStr += 
                //       `\tĐiểm:` 
                //       + `\t\t${p.name}\n` 
                //       + `\tNội dung: `
                //       + `\t\t${p.description}`
                //       ;
                //     }
                //   );
                // }
              

              if(!this.selectedRom.modifyingSection.isDeleted){
                this.changedModel.code =
                `Tên:\n` +
                `\t${this.selectedRom.modifyingSection?.name}\n` +
                `Nội dung:\n` +
                `\t${this.selectedRom.modifyingSection?.description}\n` +
                `Phương tiện:\n` +
                `\t${this.selectedRom.modifyingSection?.vehicleCategory?.name}\n` +
                `Mức phạt tối thiểu:\n` +
                `\t${this.selectedRom.modifyingSection?.minPenalty?.toLocaleString(
                  'vi'
                )}\n` +
                `Mức phạt tối đa:\n` +
                `\t${this.selectedRom.modifyingSection?.maxPenalty?.toLocaleString(
                  'vi'
                )}\n` +
                `Các điểm thuộc khoản (nếu có):\n` 
                // + pStr;
              }
              

              if (response.data.modifiedSection !== null) {
                this.selectedRom.modifiedSection =
                  response.data.modifiedSection;
                this.originalModel.code =
                  `Tên:\n` +
                  `\t${this.selectedRom.modifiedSection?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedSection?.description}\n` +
                  `Phương tiện:\n` +
                  `\t${this.selectedRom.modifiedSection?.vehicleCategory?.name}\n` +
                  `Mức phạt tối thiểu:\n` +
                  `\t${this.selectedRom.modifiedSection?.minPenalty?.toLocaleString(
                    'vi'
                  )}\n` +
                  `Mức phạt tối đa:\n` +
                  `\t${this.selectedRom.modifiedSection?.maxPenalty?.toLocaleString(
                    'vi'
                  )}\n` +
                  `Các điểm thuộc khoản (nếu có):\n`;
              }
            } else if (response.data.modifyingParagraph !== null) {
              this.selectedRom.modifyingParagraph =
                response.data.modifyingParagraph;

                if(!this.selectedRom.modifyingParagraph.isDeleted){
                  this.changedModel.code =
                  `Tên:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${this.selectedRom.modifyingParagraph?.additionalPenalty}\n` +
                  `Các hành vi liên quan (nếu có):\n`;
                }
              

              if(this.selectedRom.modifiedParagraph !== null && this.selectedRom.modifiedParagraph !== undefined){
                this.selectedRom.modifiedParagraph =
                response.data.modifiedParagraph;
                this.originalModel.code =
                  `Tên:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${this.selectedRom.modifiedParagraph?.additionalPenalty}\n` +
                  `Các hành vi liên quan (nếu có):\n`;
              }
            }

            this.isLoadingService.remove();
            this.displayRomDetailDialog = true;
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    } 
   
  }

  approveRom() {}
}
