import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { async, BehaviorSubject, Observable, of } from 'rxjs';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { EventEmitterService } from 'src/services/event-emitter.service';
import { NotificationService } from 'src/services/notification.service';
import { SubjectType } from 'src/app/common/subjectType';
import axios from 'axios';
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
    { statusName: 'Chờ duyệt', statusCode: 1 }, //pending is 0 but dropdown of primeng need start from 1
    // { statusName: 'Đang hoạt động', statusCode: 5 },
    // { statusName: 'Ngưng hoạt động', statusCode: 6 },
    { statusName: 'Đã duyệt', statusCode: 7 },
    { statusName: 'Đã từ chối', statusCode: 4 },
    { statusName: 'Đã xử lý', statusCode: 3 },
    { statusName: 'Đã bị hủy', statusCode: 8 },
    { statusName: 'Đã tiếp nhận', statusCode: 2 },
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
    { romTypeName: 'GPS', romTypeCode: 5 },
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

  deniedReason: any;
  isValidSubmitDenyRom: boolean = false;
  isValidDeniedReason: boolean = true;

  displayConfirmDenyDialog: boolean = false;

  isPromotingAdminPromotionRom: boolean = false;
  isArbitratingAdminPromotionRom: boolean = false;

  //start of google map
  displayMapChanged: any;
  centerMapChanged: any;
  markerMapChangedPosition: any;

  zoom = 14;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  //end of google map

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eventEmitterService: EventEmitterService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRoms();

    //used for displaying rom detail when navigating from notification clicked
    this.eventEmitterService.invokeAdminNoti.subscribe((emittedRom: any) => {
      // this.loadRoms();
      if (emittedRom !== null && emittedRom !== undefined) {
        var tmpRom = this.tmpRoms.filter((r: any) => {
          if (
            r.lawRomId !== undefined &&
            emittedRom.lawRomId !== undefined &&
            r.lawRomId === emittedRom.lawRomId
          ) {
            return r;
          } else if (
            r.modifyingSignId !== undefined &&
            emittedRom.modifyingSignId !== undefined &&
            r.modifyingSignId === emittedRom.modifyingSignId
          ) {
            return r;
          } else if (
            r.modifyingGpssignId !== undefined &&
            emittedRom.modifyingGpssignId !== undefined &&
            r.modifyingGpssignId === emittedRom.modifyingGpssignId
          ) {
            return r;
          } else if (
            r.modifyingQuestionId !== undefined &&
            emittedRom.modifyingQuestionId !== undefined &&
            r.modifyingQuestionId === emittedRom.modifyingQuestionId
          ) {
            return r;
          } else if (
            r.modifyingUserId !== undefined &&
            emittedRom.modifyingUserId !== undefined &&
            r.modifyingUserId === emittedRom.modifyingUserId
          ) {
            return r;
          } else {
            return;
          }
        })[0];
        this.viewInfo(tmpRom);
      }
    });
  }

  loadRoms() {
    var token = getStorageToken();
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetRomList +
        '/' +
        decodeToken(token !== null ? token : '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.roms = response.data.lawRoms
            .concat(response.data.signRoms)
            .concat(response.data.questionRoms)
            .concat(response.data.userRoms)
            .concat(response.data.gpsSignRoms);
          this.tmpRoms = this.roms;
          this.requesters = [];

          this.roms.forEach((rom: any) => {
            if (
              !this.requesters.some(
                (r: any) =>
                  r.requesterId === rom?.scribeId ||
                  r.requesterId === rom?.userId ||
                  r.requesterId === rom?.promotingAdminId
              )
            ) {
              this.requesters.push({
                requesterId:
                  rom?.scribeId || rom?.userId || rom?.promotingAdminId,
                requesterName:
                  rom?.scribe?.username ||
                  rom?.username ||
                  rom?.promotingAdminUsername,
              });
            }
          });
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
        this.roms = this.roms.filter((r: any) => r.modifyingSignId);
      } else if (this.filterRomTypeCode === 3) {
        //question
        this.roms = this.roms.filter((r: any) => r.modifyingQuestionId);
      } else if (this.filterRomTypeCode === 5) {
        //GPS
        this.roms = this.roms.filter((r: any) => r.modifyingGpssignId);
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
      if (this.filterStatusCode === 1) {
        //pending is 0 but dropdown of primeng need start from 1
        this.roms = this.roms?.filter((r: any) => r.status === 0);
      } else {
        this.roms = this.roms?.filter(
          (r: any) => r.status === this.filterStatusCode
        );
      }
    }

    //filter by filterSearchStr
    if (this.filterSearchStr) {
      this.roms = this.roms?.filter((r: any) => {
        return r?.modifyingStatueName
          ? toNonAccentVietnamese(
              r?.modifyingStatueName?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modifyingSectionName
          ? toNonAccentVietnamese(
              r?.modifyingSectionName?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modifyingParagraphName
          ? toNonAccentVietnamese(
              r?.modifyingParagraphName?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modifyingSignName
          ? toNonAccentVietnamese(
              r.modifyingSignName?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modifyingGpssign?.sign?.name
          ? toNonAccentVietnamese(
              r?.modifyingGpssign?.sign?.name?.toLowerCase()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modifyingQuestionContent
          ? toNonAccentVietnamese(
              r?.modifyingQuestionContent?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
            )
          : r?.modfifyingUserName
          ? toNonAccentVietnamese(
              r.modfifyingUserName?.toLowerCase().trim()
            ).includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase().trim())
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
    this.changedModelImg = undefined;
    this.originalModelImg = undefined;

    this.isPromotingAdminPromotionRom = false;
    this.isArbitratingAdminPromotionRom = false;

    if (this.selectedRom.lawRomId) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.AdminGetLawRomDetail + '/' + this.selectedRom.lawRomId,
        getStorageToken(),
        {
          successCallback: (response) => {
            if (response.data.modifyingStatue !== null) {
              this.selectedRom.modifyingStatue = response.data.modifyingStatue;
              // if (!this.selectedRom.modifyingStatue.isDeleted) {
              if (this.selectedRom.operationType !== OperationType.Delete) {
                this.changedModel.code =
                  `Tên điều:\n` +
                  `\t${this.selectedRom.modifyingStatue?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingStatue?.description}\n`;
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (response.data.modifiedStatue !== null) {
                this.selectedRom.modifiedStatue = response.data.modifiedStatue;
                this.originalModel.code =
                  `Tên điều:\n` +
                  `\t${this.selectedRom.modifiedStatue?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedStatue?.description}\n`;
              } else {
                this.originalModel.code = ' '; //must be a whitespace to open text compare
              }
            } else if (response.data.modifyingSection !== null) {
              this.selectedRom.modifyingSection =
                response.data.modifyingSection;

              //paragraph list of section if ROM of ADDING new section
              var newSectionParagraphs = ``;
              if (this.selectedRom.operationType === OperationType.Add) {
                if (this.selectedRom.modifyingSection.paragraphs !== null) {
                  if (
                    this.selectedRom.modifyingSection?.paragraphs?.length !==
                      1 &&
                    this.selectedRom.modifyingSection?.paragraphs[0]?.name?.trim() !==
                      ''
                  ) {
                    newSectionParagraphs += `Các điểm thuộc khoản (nếu có):\n`;
                    this.selectedRom.modifyingSection?.paragraphs?.forEach(
                      (p: any, i: number) => {
                        if (p.name.trim() !== '') {
                          newSectionParagraphs +=
                            `\t ${i + 1}) Tên điểm:\n` +
                            `\t\t${p.name}\n` +
                            `\tNội dung:\n` +
                            `\t\t${p.description}\n`;
                        }
                      }
                    );
                  }
                }
              }
              // if (!this.selectedRom.modifyingSection.isDeleted) {
              if (this.selectedRom.operationType !== OperationType.Delete) {
                this.changedModel.code =
                  `Tên khoản: \n` +
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
                  `${newSectionParagraphs}`;
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (response.data.modifiedSection !== null) {
                this.selectedRom.modifiedSection =
                  response.data.modifiedSection;
                this.originalModel.code =
                  `Tên khoản:\n` +
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
                  )}\n`;
              } else {
                this.originalModel.code = ' '; //must be a whitespace to open text compare
              }
            } else if (response.data.modifyingParagraph !== null) {
              this.selectedRom.modifyingParagraph =
                response.data.modifyingParagraph;

              var tmpChangedModelCode = '';
              // if (!this.selectedRom.modifyingParagraph.isDeleted) {
              if (this.selectedRom.operationType !== OperationType.Delete) {
                tmpChangedModelCode =
                  `Tên điểm:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${
                    this.selectedRom.modifyingParagraph?.additionalPenalty !==
                    null
                      ? this.selectedRom.modifyingParagraph?.additionalPenalty
                      : '{không}'
                  }\n`;

                if (!this.selectedRom.modifyingParagraphId) {
                  this.viewInfo(this.selectedRom);
                } else {
                  this.isLoadingService.add();
                  this.wrapperService.get(
                    paths.AdminGetParagraphRomDetailReference +
                      '/' +
                      this.selectedRom.modifyingParagraphId,
                    getStorageToken(),
                    {
                      successCallback: async (response) => {
                        if (response.data?.length > 0) {
                          tmpChangedModelCode += `Các hành vi liên quan:\n`;
                          for await (const r of response.data) {
                            tmpChangedModelCode += `\t${
                              r.referenceParagraphSectionStatueName
                            } > ${r.referenceParagraphSectionName} > ${
                              r.referenceParagraphName
                            } (${
                              r.referenceParagraphIsExcluded
                                ? 'ngoại trừ'
                                : 'bao gồm'
                            })\n`;

                            if (
                              response.data?.indexOf(r) ===
                              response.data?.length - 1
                            ) {
                              this.changedModel.code = tmpChangedModelCode;
                              this.isLoadingService.remove();
                            }
                          }
                        } else if (response.data?.length === 0) {
                          this.changedModel.code = tmpChangedModelCode;
                          this.isLoadingService.remove();
                        }
                      },
                      errorCallback: (error) => {
                        console.log(error);
                        this.isLoadingService.remove();
                      },
                    }
                  );
                }
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (this.selectedRom.modifiedParagraph !== null) {
                this.selectedRom.modifiedParagraph =
                  response.data.modifiedParagraph;

                var tmpOriginalModelCode = '';
                tmpOriginalModelCode =
                  `Tên điểm:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${
                    this.selectedRom.modifiedParagraph?.additionalPenalty
                      ? this.selectedRom.modifiedParagraph?.additionalPenalty
                      : '{không}'
                  }\n`;

                if (!this.selectedRom.modifiedParagraphId) {
                  this.viewInfo(this.selectedRom);
                } else {
                  this.isLoadingService.add();
                  this.wrapperService.get(
                    paths.AdminGetParagraphRomDetailReference +
                      '/' +
                      this.selectedRom.modifiedParagraphId,
                    getStorageToken(),
                    {
                      successCallback: async (response) => {
                        if (response.data?.length > 0) {
                          tmpOriginalModelCode += `Các hành vi liên quan:\n`;
                          for await (const r of response.data) {
                            tmpOriginalModelCode += `\t${
                              r.referenceParagraphSectionStatueName
                            } > ${r.referenceParagraphSectionName} > ${
                              r.referenceParagraphName
                            } (${
                              r.referenceParagraphIsExcluded
                                ? 'ngoại trừ'
                                : 'bao gồm'
                            })\n`;

                            if (
                              response.data?.indexOf(r) ===
                              response.data?.length - 1
                            ) {
                              this.originalModel.code = tmpOriginalModelCode;
                              this.isLoadingService.remove();
                            }
                          }
                        } else if (response.data?.length === 0) {
                          this.originalModel.code = tmpOriginalModelCode;
                          this.isLoadingService.remove();
                        }
                      },
                      errorCallback: (error) => {
                        console.log(error);
                        this.isLoadingService.remove();
                      },
                    }
                  );
                }
              } else {
                this.originalModel.code = ' '; //must be a whitespace to open text compare
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
    } else if (this.selectedRom.modifyingSignId) {
      this.changedModelImg = undefined;
      this.originalModelImg = undefined;
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.AdminGetSignRomDetail + '/' + this.selectedRom.modifyingSignId,
        getStorageToken(),
        {
          successCallback: (response) => {
            if (response.data.modifyingSign !== null) {
              this.selectedRom.modifyingSign = response.data.modifyingSign;
              // if (!this.selectedRom.modifyingSign.isDeleted) {
              if (this.selectedRom.operationType !== OperationType.Delete) {
                this.changedModel.code =
                  `Loại biển báo:\n` +
                  `\t${this.selectedRom.modifyingSign?.signCategory?.name}\n` +
                  `Tên biển báo:\n` +
                  `\t${this.selectedRom.modifyingSign?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingSign?.description}\n`;

                if (
                  this.selectedRom.modifyingSign?.signParagraphs !== null &&
                  this.selectedRom.modifyingSign?.signParagraphs !==
                    undefined &&
                  this.selectedRom.modifyingSign?.signParagraphs?.length > 0
                ) {
                  this.changedModel.code += `Các điểm liên quan (nếu có):\n`;

                  this.selectedRom.modifyingSign?.signParagraphs
                    ?.sort(
                      (sp1: any, sp2: any) =>
                        sp1?.signParagraphStatueName?.split(' ')[1] -
                          sp2?.signParagraphStatueName?.split(' ')[1] ||
                        sp1?.signParagraphSectionName?.split(' ')[1] -
                          sp2?.signParagraphSectionName?.split(' ')[1] ||
                        (sp1?.signParagraphParagraphName >
                        sp2?.signParagraphParagraphName
                          ? 1
                          : -1)
                    )
                    .forEach((sp: any) => {
                      this.changedModel.code += `\t${sp.signParagraphStatueName} > ${sp.signParagraphSectionName} > ${sp.signParagraphParagraphName}\n`;
                    });
                }

                if (this.selectedRom.modifyingSign?.imageUrl) {
                  this.changedModelImg =
                    this.selectedRom.modifyingSign?.imageUrl;
                }
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (response.data.modifiedSign !== null) {
                this.selectedRom.modifiedSign = response.data.modifiedSign;
                this.originalModel.code =
                  `Loại biển báo:\n` +
                  `\t${this.selectedRom.modifiedSign?.signCategory?.name}\n` +
                  `Tên biển báo:\n` +
                  `\t${this.selectedRom.modifiedSign?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedSign?.description}\n`;

                if (
                  this.selectedRom.modifiedSign?.signParagraphs !== null &&
                  this.selectedRom.modifiedSign?.signParagraphs !== undefined &&
                  this.selectedRom.modifiedSign?.signParagraphs?.length > 0
                ) {
                  this.originalModel.code += `Các điểm liên quan (nếu có):\n`;
                  this.selectedRom.modifiedSign?.signParagraphs
                    ?.sort(
                      (sp1: any, sp2: any) =>
                        sp1?.signParagraphStatueName?.split(' ')[1] -
                          sp2?.signParagraphStatueName?.split(' ')[1] ||
                        sp1?.signParagraphSectionName?.split(' ')[1] -
                          sp2?.signParagraphSectionName?.split(' ')[1] ||
                        (sp1?.signParagraphParagraphName >
                        sp2?.signParagraphParagraphName
                          ? 1
                          : -1)
                    )
                    .forEach((sp: any) => {
                      this.originalModel.code += `\t${sp.signParagraphStatueName} > ${sp.signParagraphSectionName} > ${sp.signParagraphParagraphName}\n`;
                    });
                }

                if (this.selectedRom.modifiedSign?.imageUrl) {
                  this.originalModelImg =
                    this.selectedRom.modifiedSign?.imageUrl;
                }
              } else {
                this.originalModel.code = ' '; //must be a whitespace to open text compare
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
    } else if (this.selectedRom.modifyingGpssignId) {
      // this.changedModelImg = undefined;
      // this.originalModelImg = undefined;
      // this.isLoadingService.add();
      // this.wrapperService.get(
      //   paths.AdminGetGpssignRomList +
      //     '/' +
      //     decodeToken(getStorageToken() || '')?.Id,
      //   getStorageToken(),
      //   {
      //     successCallback: (response) => {
      //       console.log(response);

      // //       this.selectedRom = response.data?.filter(
      // //         (r: any) => r.modifyingGpssignId === this.selectedRom.modifyingGpssignId
      // //       );

      // //       if (this.selectedRom?.modifiedGpssign !== null) {
      // //         this.originalModel.code =
      // //           `Biển:\n` +
      // //           `\t${this.selectedRom?.modifiedGpssign?.sign?.name}\n` +
      // //           `Kinh độ:\n` +
      // //           `\t${this.selectedRom?.modifiedGpssign?.longitude}\n` +
      // //           `Vĩ độ:\n` +
      // //           `\t${this.selectedRom?.modifiedGpssign?.longitude}\n`;
      // //       } else {
      // //         this.originalModel.code = ' ';
      // //       }

      // //       if (this.selectedRom.operationType !== OperationType.Delete) {
      // //         this.changedModel.code =
      // //           `Biển:\n` +
      // //           `\t${this.selectedRom?.modifyingGpssign?.sign?.name}\n` +
      // //           `Kinh độ:\n` +
      // //           `\t${this.selectedRom?.modifyingGpssign?.longitude}\n` +
      // //           `Vĩ độ:\n` +
      // //           `\t${this.selectedRom?.modifyingGpssign?.longitude}\n`;
      // //       } else {
      // //         this.changedModel.code = ' ';
      // //       }

      // //       this.centerMapChanged = {
      // //         lat: this.selectedRom?.modifyingGpssign?.latitude,
      // //         lng: this.selectedRom?.modifyingGpssign?.longitude,
      // //       };

      // //       this.markerMapChangedPosition = {
      // //         lat: this.selectedRom?.modifyingGpssign?.latitude,
      // //         lng: this.selectedRom?.modifyingGpssign?.longitude,
      // //       };

      // // this.displayRomDetailDialog = true;

      //       this.isLoadingService.remove();
      //     },
      //     errorCallback: (error) => {
      //       console.log(error);
      //       this.isLoadingService.remove();
      //     },
      //   }
      // );

      if (this.selectedRom?.modifiedGpssign !== null) {
        this.originalModel.code =
          `Biển:\n` +
          `\t${this.selectedRom?.modifiedGpssign?.sign?.name}\n` +
          `Kinh độ:\n` +
          `\t${this.selectedRom?.modifiedGpssign?.longitude}\n` +
          `Vĩ độ:\n` +
          `\t${this.selectedRom?.modifiedGpssign?.latitude}\n`;
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
          `\t${this.selectedRom?.modifyingGpssign?.latitude}\n`;
      } else {
        this.changedModel.code = ' ';
      }

      this.centerMapChanged = {
        lat: this.selectedRom?.modifyingGpssign?.latitude,
        lng: this.selectedRom?.modifyingGpssign?.longitude,
      };

      this.markerMapChangedPosition = {
        lat: this.selectedRom?.modifyingGpssign?.latitude,
        lng: this.selectedRom?.modifyingGpssign?.longitude,
      };

      this.displayRomDetailDialog = true;
    } else if (this.selectedRom.modifyingQuestionId) {
      this.changedModelImg = undefined;
      this.originalModelImg = undefined;
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.AdminGetQuestionRomDetail +
          '/' +
          this.selectedRom.modifyingQuestionId,
        getStorageToken(),
        {
          successCallback: (response) => {
            if (response.data.modifyingQuestion !== null) {
              this.selectedRom.modifyingQuestion =
                response.data.modifyingQuestion;
              // if (!this.selectedRom.modifyingQuestion.isDeleted) {
              if (this.selectedRom.operationType !== OperationType.Delete) {
                var tmpChangedModelCode = '';
                tmpChangedModelCode =
                  `Hạng:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.testCategory?.name}\n` +
                  `Loại:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.questionCategory?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.content}\n` +
                  `Đáp án:\n`;

                this.selectedRom.modifyingQuestion?.answers
                  .sort((a1: any, a2: any) =>
                    a1?.description < a2?.description
                      ? 1
                      : a2?.description < a1?.description
                      ? -1
                      : 0
                  )
                  .forEach((a: any, i: number) => {
                    tmpChangedModelCode += `\t${
                      i === 0
                        ? 'A) '
                        : i === 1
                        ? 'B) '
                        : i === 2
                        ? 'C) '
                        : i === 3
                        ? 'D) '
                        : ''
                    }${a.description} ${a.isCorrect ? '(câu đúng)' : ''}\n`;
                    if (
                      i ===
                      this.selectedRom.modifyingQuestion?.answers?.length - 1
                    ) {
                      this.changedModel.code = tmpChangedModelCode;
                    }
                  });

                if (this.selectedRom.modifyingQuestion?.imageUrl) {
                  this.changedModelImg =
                    this.selectedRom.modifyingQuestion?.imageUrl;
                }
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (response.data.modifiedQuestion !== null) {
                this.selectedRom.modifiedQuestion =
                  response.data.modifiedQuestion;

                tmpChangedModelCode = '';
                tmpChangedModelCode =
                  `Hạng:\n` +
                  `\t${this.selectedRom.modifiedQuestion?.testCategory?.name}\n` +
                  `Loại:\n` +
                  `\t${this.selectedRom.modifiedQuestion?.questionCategory?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedQuestion?.content}\n` +
                  `Đáp án:\n`;

                this.selectedRom.modifiedQuestion?.answers
                  .sort((a1: any, a2: any) =>
                    a1?.description < a2?.description
                      ? 1
                      : a2?.description < a1?.description
                      ? -1
                      : 0
                  )
                  .forEach((a: any, i: number) => {
                    tmpChangedModelCode += `\t${
                      i === 0
                        ? 'A) '
                        : i === 1
                        ? 'B) '
                        : i === 2
                        ? 'C) '
                        : i === 3
                        ? 'D) '
                        : ''
                    }${a.description} ${a.isCorrect ? '(câu đúng)' : ''}\n`;
                    if (
                      i ===
                      this.selectedRom.modifiedQuestion?.answers?.length - 1
                    ) {
                      this.originalModel.code = tmpChangedModelCode;
                    }
                  });

                if (this.selectedRom.modifiedQuestion?.imageUrl) {
                  this.originalModelImg =
                    this.selectedRom.modifiedQuestion?.imageUrl;
                }
              } else {
                this.originalModel.code = ' '; //must be a whitespace to open text compare
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
    } else {
      //ROM detail promoting scribe
      this.changedModelImg = undefined;
      this.originalModelImg = undefined;
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.AdminGetUserRomDetail + '/' + this.selectedRom.modifyingUserId,
        getStorageToken(),
        {
          successCallback: (response) => {
            if (response.data.modifyingUser !== null) {
              this.selectedRom.modifyingUser = response.data.modifyingUser;
              this.changedModel.code =
                `Tên đăng nhập:\n` +
                `\t${this.selectedRom.modifyingUser?.username}\n` +
                `Vai trò:\n` +
                `\t${
                  this.selectedRom.modifyingUser?.role === 1
                    ? 'Nhân viên'
                    : 'Quản trị viên'
                }\n`;

              this.selectedRom.modifiedUser = response.data.modifiedUser;
              this.originalModel.code =
                `Tên đăng nhập:\n` +
                `\t${this.selectedRom.modifiedUser?.username}\n` +
                `Vai trò:\n` +
                `\t${
                  this.selectedRom.modifiedUser?.role === 1
                    ? 'Nhân viên'
                    : 'Quản trị viên'
                }\n`;

              if (
                response.data?.promotingAdminId ===
                decodeToken(getStorageToken() || '')?.Id
              ) {
                (this.selectedRom.promotingAdmin =
                  response.data.promotingAdmin),
                  (this.selectedRom.arbitratingAdmin =
                    response.data.arbitratingAdmin),
                  (this.isPromotingAdminPromotionRom = true);
                this.isArbitratingAdminPromotionRom = false;
              } else if (
                response.data?.arbitratingAdminId ===
                decodeToken(getStorageToken() || '')?.Id
              ) {
                (this.selectedRom.promotingAdmin =
                  response.data.promotingAdmin),
                  (this.selectedRom.arbitratingAdmin =
                    response.data.arbitratingAdmin),
                  (this.isPromotingAdminPromotionRom = false);
                this.isArbitratingAdminPromotionRom = true;
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

  confirmApproveRom(event: any) {
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmApprove',
      message:
        'Thao tác này sẽ cập nhật dữ liệu của hệ thống cùng các dữ liệu liên quan. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedRom.modifyingStatueId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveStatueRom +
              '/' +
              this.selectedRom.modifyingStatueId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                // add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingStatueId,
                  subjectType: SubjectType.Statue,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: response.data?.modifyingStatue?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else if (this.selectedRom.modifyingSectionId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveSectionRom +
              '/' +
              this.selectedRom.modifyingSectionId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingSectionId,
                  subjectType: SubjectType.Section,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: response.data?.modifyingSection?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else if (this.selectedRom.modifyingParagraphId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveParagraphRom +
              '/' +
              this.selectedRom.modifyingParagraphId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingParagraphId,
                  subjectType: SubjectType.Paragraph,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: response.data?.modifyingParagraph?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else if (this.selectedRom.modifyingSignId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveSignRom + '/' + this.selectedRom.modifyingSignId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingSignId,
                  subjectType: SubjectType.Sign,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: response.data?.modifyingSign?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else if (this.selectedRom.modifyingGpssignId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveGpssignRom +
              '/' +
              this.selectedRom.modifyingGpssignId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingGpssignId,
                  subjectType: SubjectType.GPSSign,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: ' GPS',
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else if (this.selectedRom.modifyingQuestionId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveQuestionRom +
              '/' +
              this.selectedRom.modifyingQuestionId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingQuestionId,
                  subjectType: SubjectType.Question,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response.data?.admin?.username || '',
                  receiverId: response.data?.scribe?.id,
                  receiverUsername: response.data?.scribe?.username,
                  action:
                    commonStr.approveRom +
                    (response.data?.operationType === 0
                      ? ' thêm'
                      : response.data?.operationType === 1
                      ? ' sửa'
                      : ' xóa'),
                  relatedDescription: response.data?.modifyingQuestion?.content,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        } else {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.AdminApproveUserRom + '/' + this.selectedRom.modifyingUserId,
            {},
            getStorageToken(),
            {
              successCallback: (response) => {
                //add notification
                this.notiService.create({
                  subjectId: response.data?.modifyingUserId,
                  subjectType: SubjectType.Promotion,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername:
                    response.data?.arbitratingAdmin?.username || '',
                  receiverId: response.data?.promotingAdmin?.id,
                  receiverUsername: response.data?.promotingAdmin?.username,
                  action: commonStr.approveRom,
                  relatedDescription:
                    response.data?.modifyingUser?.username +
                    ' trở thành quản trị viên',
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.clearData();
                this.displayRomDetailDialog = false;
                this.loadRoms();

                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.dataUpdatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                // console.log(error);
                this.clearData();
                this.displayRomDetailDialog = false;
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
        }
      },
      reject: () => {},
    });
  }

  confirmedDenyRom() {
    if (this.selectedRom.modifyingStatueId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenyStatueRom + '/' + this.selectedRom.modifyingStatueId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingStatueId,
              subjectType: SubjectType.Statue,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: response.data?.modifyingStatue?.name,
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else if (this.selectedRom.modifyingSectionId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenySectionRom + '/' + this.selectedRom.modifyingSectionId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingSectionId,
              subjectType: SubjectType.Section,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: response.data?.modifyingSection?.name,
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else if (this.selectedRom.modifyingParagraphId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenyParagraphRom +
          '/' +
          this.selectedRom.modifyingParagraphId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingParagraphId,
              subjectType: SubjectType.Paragraph,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: response.data?.modifyingParagraph?.name,
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else if (this.selectedRom.modifyingSignId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenySignRom + '/' + this.selectedRom.modifyingSignId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingSignId,
              subjectType: SubjectType.Sign,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: response.data?.modifyingSign?.name,
              createdDate: new Date().toString(),
              isRead: false,
            });
            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else if (this.selectedRom.modifyingGpssignId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenyGpssignRom + '/' + this.selectedRom.modifyingGpssignId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingGpssignId,
              subjectType: SubjectType.GPSSign,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: ' GPS',
              createdDate: new Date().toString(),
              isRead: false,
            });
            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else if (this.selectedRom.modifyingQuestionId) {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenyQuestionRom + '/' + this.selectedRom.modifyingQuestionId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingQuestionId,
              subjectType: SubjectType.Question,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.admin?.username || '',
              receiverId: response.data?.scribe?.id,
              receiverUsername: response.data?.scribe?.username,
              action:
                commonStr.denyRom +
                (response.data?.operationType === 0
                  ? ' thêm'
                  : response.data?.operationType === 1
                  ? ' sửa'
                  : ' xóa'),
              relatedDescription: response.data?.modifyingQuestion?.content,
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    } else {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.AdminDenyUserRom + '/' + this.selectedRom.modifyingUserId,
        this.deniedReason,
        getStorageToken(),
        {
          successCallback: (response) => {
            //add notification
            this.notiService.create({
              subjectId: response.data?.modifyingUserId,
              subjectType: SubjectType.Promotion,
              senderId: decodeToken(getStorageToken() || '')?.Id,
              senderUsername: response.data?.arbitratingAdmin?.username || '',
              receiverId: response.data?.promotingAdmin?.id,
              receiverUsername: response.data?.promotingAdmin?.username,
              action: commonStr.denyRom,
              relatedDescription:
                response.data?.modifyingUser?.username +
                ' trở thành quản trị viên',
              createdDate: new Date().toString(),
              isRead: false,
            });

            this.clearData();
            this.displayRomDetailDialog = false;
            this.loadRoms();

            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            // console.log(error);
            this.clearData();
            this.displayRomDetailDialog = false;
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
    }
  }

  getDeniedReason() {
    if (this.deniedReason && this.deniedReason?.length <= 2000) {
      this.isValidDeniedReason = true;
      this.isValidSubmitDenyRom = true;
    } else {
      this.isValidDeniedReason = false;
      this.isValidSubmitDenyRom = false;
    }
  }

  clearData() {
    this.selectedRom = undefined;
    this.deniedReason = undefined;
    this.displayConfirmDenyDialog = false;
    this.displayRomDetailDialog = false;
    this.isValidDeniedReason = true;
    this.isValidSubmitDenyRom = false;

    this.isPromotingAdminPromotionRom = false;
    this.isArbitratingAdminPromotionRom = false;
  }

  moveMapChanged(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.centerMapChanged = event.latLng.toJSON();
    }
  }

  moveChanged(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.displayMapChanged = event.latLng.toJSON();
    }
  }
}
