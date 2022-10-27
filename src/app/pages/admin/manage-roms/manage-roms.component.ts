import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    { statusName: 'Đã xử lý', statusCode: 3 },
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

  selectedParagraphRomReferenceSub = new BehaviorSubject<string>('');

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService
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

  private paragraphReferencesObservable(
    paragraphId: string
  ): Observable<string> {
    this.selectedParagraphRomReferenceSub.next('');
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetParagraphRomDetailReference + '/' + paragraphId,
      getStorageToken(),
      {
        successCallback: async (response) => {
          if (response.data?.length > 0) {
            this.selectedParagraphRomReferenceSub.next(
              `Các hành vi liên quan:\n`
            );

            for await (const r of response.data) {
              this.selectedParagraphRomReferenceSub.next(
                `\t${r.referenceParagraphSectionStatueName} > ${
                  r.referenceParagraphSectionName
                } > ${r.referenceParagraphName} (${
                  r.referenceParagraphIsExcluded ? 'ngoại trừ' : 'bao gồm'
                })\n`
              );
            }

            this.selectedParagraphRomReferenceSub.complete();
          }
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);

          this.isLoadingService.remove();
        },
      }
    );
    return this.selectedParagraphRomReferenceSub.asObservable();
  }

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
            if (response.data.modifyingStatue !== null) {
              this.selectedRom.modifyingStatue = response.data.modifyingStatue;
              if (!this.selectedRom.modifyingStatue.isDeleted) {
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
              if (!this.selectedRom.modifyingSection.isDeleted) {
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
              if (!this.selectedRom.modifyingParagraph.isDeleted) {
                tmpChangedModelCode =
                  `Tên điểm:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${this.selectedRom.modifyingParagraph?.additionalPenalty}\n`;
                this.paragraphReferencesObservable(
                  this.selectedRom.modifyingParagraphId
                ).subscribe({
                  next: (v) => (tmpChangedModelCode += `${v}`),
                  error: (e) => console.log(e),
                  complete: () => {
                    this.changedModel.code = tmpChangedModelCode;
                  },
                });
              } else {
                this.changedModel.code = ' '; //must be a whitespace to open text compare
              }

              if (
                this.selectedRom.modifiedParagraph !== null
              ) {
                this.selectedRom.modifiedParagraph =
                  response.data.modifiedParagraph;

                var tmpOriginalModelCode = '';
                tmpOriginalModelCode =
                  `Tên điểm:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifiedParagraph?.description}\n` +
                  `Hình phạt bổ sung (nếu có):\n` +
                  `\t${this.selectedRom.modifiedParagraph?.additionalPenalty}\n`;
                this.paragraphReferencesObservable(
                  this.selectedRom.modifiedParagraph?.id
                ).subscribe({
                  next: (v) => (tmpOriginalModelCode += `${v}`),
                  error: (e) => console.log(e),
                  complete: () => {
                    this.originalModel.code = tmpOriginalModelCode;
                  },
                });
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
    } else if (this.selectedRom.signRomId && this.selectedRom.modifyingSignId) {
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
              if (!this.selectedRom.modifyingSign.isDeleted) {
                this.changedModel.code =
                  `Loại biển báo:\n` +
                  `\t${this.selectedRom.modifyingSign?.signCategory?.name}\n` +
                  `Tên biển báo:\n` +
                  `\t${this.selectedRom.modifyingSign?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingSign?.description}\n`;

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

                if (this.selectedRom.modifiedSign?.imageUrl) {
                  this.originalModelImg =
                    this.selectedRom.modifiedSign?.imageUrl;
                }
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
    } else if (
      this.selectedRom.signRomId &&
      this.selectedRom.modifyingGpssignId
    ) {
      //TODO: ROM detail of modifying GPSSign
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
          successCallback: async (response) => {
            if (response.data.modifyingQuestion !== null) {
              this.selectedRom.modifyingQuestion =
                response.data.modifyingQuestion;
              if (!this.selectedRom.modifyingQuestion.isDeleted) {
                var tmpChangedModelCode = '';
                tmpChangedModelCode =
                  `Hạng:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.testCategory?.name}\n` +
                  `Loại:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.questionCategory?.name}\n` +
                  `Nội dung:\n` +
                  `\t${this.selectedRom.modifyingQuestion?.content}\n` +
                  `Đáp án:\n`;

                this.selectedRom.modifyingQuestion?.answers.forEach(
                  (a: any, i: number) => {
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
                  }
                );

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
  
                  this.selectedRom.modifiedQuestion?.answers.forEach(
                    (a: any, i: number) => {
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
                    }
                  );

                if (this.selectedRom.modifiedQuestion?.imageUrl) {
                  this.changedModelImg =
                    this.selectedRom.modifiedQuestion?.imageUrl;
                }
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
      //TODO: ROM detail promoting scribe
    }
  }

  confirmApproveRom(event: any){
    this.confirmationService.confirm({
      target: event?.target,
      message: 'Thao tác này sẽ cập nhật dữ liệu của hệ thống. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
      reject: () => {}
    })
  }

  approveRom() {}

  denyRom(){}
}
