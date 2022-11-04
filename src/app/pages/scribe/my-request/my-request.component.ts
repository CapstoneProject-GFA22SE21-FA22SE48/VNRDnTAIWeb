import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { EventEmitterService } from 'src/services/event-emitter.service';
@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css'],
})
export class MyRequestComponent implements OnInit {
  roms: any;
  tmpRoms: any;

  selectedRom: any;

  //start of filtering data
  filterSearchStr: any;

  status: any[] = [
    { statusName: 'Chờ duyệt', statusCode: 1 }, //pending is 0 but dropdown of primeng need start from 1
    { statusName: 'Đã duyệt', statusCode: 7 },
    { statusName: 'Đã từ chối', statusCode: 4 },
    { statusName: 'Đã xử lý', statusCode: 3 },
    { statusName: 'Đã bị hủy', statusCode: 8 },
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
  ];
  filterRomTypeCode: any;
  //end of filtering data

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

  displayRomDetailDialog: boolean = false;

  constructor(
    private isLoadingService: IsLoadingService,
    private wrapperService: WrapperService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.loadRoms();

    //used for displaying rom detail when navigating from notification clicked
    this.eventEmitterService.invokeScribeNoti.subscribe((emittedRom: any) => {
      if (emittedRom !== null && emittedRom !== undefined) {
        var tmpRom = this.tmpRoms.filter((r: any) => {
          if (
            r.modifyingStatueId !== undefined &&
            emittedRom.modifyingStatueId !== undefined &&
            r.modifyingStatueId === emittedRom.modifyingStatueId
          ) {
            return r;
          } else if (
            r.modifyingSectionId !== undefined &&
            emittedRom.modifyingSectionId !== undefined &&
            r.modifyingSectionId === emittedRom.modifyingSectionId
          ) {
            return r;
          } else if (
            r.modifyingParagraphId !== undefined &&
            emittedRom.modifyingParagraphId !== undefined &&
            r.modifyingParagraphId === emittedRom.modifyingParagraphId
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
          } else {
            return;
          }
        })[0];
        this.viewInfo(tmpRom);
      }
    });
  }

  private paragraphReferencesObservable(
    paragraphId: string
  ): Observable<string> {
    this.selectedParagraphRomReferenceSub.next('');
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetParagraphRomDetailReference + '/' + paragraphId,
      getStorageToken(),
      {
        successCallback: async (response) => {
          if (response.data?.length > 0) {
            this.selectedParagraphRomReferenceSub.next(
              `Các hành vi liên quan:\n`
            );
            // response.data.forEach((r: any, i: number) => {
            //   this.selectedParagraphRomReferenceSub.next(
            //     `\t${r.referenceParagraphSectionStatueName} > ${
            //       r.referenceParagraphSectionName
            //     } > ${r.referenceParagraphName} (${
            //       r.referenceParagraphIsExcluded ? 'ngoại trừ' : 'bao gồm'
            //     })\n`
            //   );
            //   if(i === response.data?.length -1){
            //     this.selectedParagraphRomReferenceSub.complete();
            //     this.isLoadingService.remove();
            //   }
            // });

            for await (const r of response.data) {
              this.selectedParagraphRomReferenceSub.next(
                `\t${r.referenceParagraphSectionStatueName} > ${
                  r.referenceParagraphSectionName
                } > ${r.referenceParagraphName} (${
                  r.referenceParagraphIsExcluded ? 'ngoại trừ' : 'bao gồm'
                })\n`
              );
              if (response.data?.indexOf(r) === response.data?.length - 1) {
                // console.log(response.data?.indexOf(r));
                this.selectedParagraphRomReferenceSub.complete();
                this.isLoadingService.remove();
              }
            }
          } else if (response.data?.length === 0) {
            this.selectedParagraphRomReferenceSub.complete();
            this.isLoadingService.remove();
          }
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
    return this.selectedParagraphRomReferenceSub.asObservable();
  }

  loadRoms() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetRomList + '/' + decodeToken(getStorageToken() || '').Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.roms = response.data.lawRoms
            .concat(response.data.signRoms)
            .concat(response.data.questionRoms);

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
      }
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
    this.selectedRom = rom;
    this.originalModel.code = '';
    this.changedModel.code = '';
    this.changedModelImg = undefined;
    this.originalModelImg = undefined;

    if (this.selectedRom.lawRomId) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetLawRomDetail + '/' + this.selectedRom.lawRomId,
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
                this.paragraphReferencesObservable(
                  // this.selectedRom.modifyingParagraphId
                  this.selectedRom.modifyingParagraph?.id ||
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
                this.paragraphReferencesObservable(
                  this.selectedRom.modifiedParagraph?.id ||
                    this.selectedRom.modifiedParagraphId
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
    } else if (this.selectedRom.modifyingSignId) {
      this.changedModelImg = undefined;
      this.originalModelImg = undefined;
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSignRomDetail + '/' + this.selectedRom.modifyingSignId,
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
                  this.selectedRom.modifyingSign?.signParagraphs?.forEach(
                    (sp: any) => {
                      this.changedModel.code += `\t${sp.signParagraphStatueName} > ${sp.signParagraphSectionName} > ${sp.signParagraphParagraphName}\n`;
                    }
                  );
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
                  this.selectedRom.modifiedSign?.signParagraphs?.forEach(
                    (sp: any) => {
                      this.originalModel.code += `\t${sp.signParagraphStatueName} > ${sp.signParagraphSectionName} > ${sp.signParagraphParagraphName}\n`;
                    }
                  );
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
      //TODO: ROM detail of modifying GPSSign
    } else if (this.selectedRom.modifyingQuestionId) {
      this.changedModelImg = undefined;
      this.originalModelImg = undefined;
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetQuestionRomDetail +
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
    }
  }

  confirmCancelRom(event: any) {
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmCancel',
      message: 'Thao tác này sẽ hủy yêu cầu đang chờ duyệt. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedRom?.lawRomId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCancelLawRom,

            this.selectedRom?.lawRomId,
            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        } else if (this.selectedRom?.signRomId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCancelSignRom,
            this.selectedRom?.signRomId,
            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        } else if (this.selectedRom?.modifyingQuestionId) {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCancelQuestionRom,
            this.selectedRom?.modifyingQuestionId,
            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
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

  confirmDeleteRom(event: any) {
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmCancel',
      message:
        'Thao tác này sẽ xóa yêu cầu cùng các thông tin liên quan. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedRom?.lawRomId) {
          this.isLoadingService.add();
          this.wrapperService.delete(
            paths.ScribeDeleteLawRom + '/' + this.selectedRom?.lawRomId,
            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        } else if (this.selectedRom?.signRomId) {
          this.isLoadingService.add();
          this.wrapperService.delete(
            paths.ScribeDeleteSignRom + '/' + this.selectedRom?.signRomId,

            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        } else if (this.selectedRom?.modifyingQuestionId) {
          this.isLoadingService.add();
          this.wrapperService.delete(
            paths.ScribeDeleteQuestionRom +
              '/' +
              this.selectedRom?.modifyingQuestionId,
            getStorageToken(),
            {
              successCallback: (response) => {
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
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
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

  clearData() {
    this.selectedRom = undefined;
    this.displayRomDetailDialog = false;
  }
}
