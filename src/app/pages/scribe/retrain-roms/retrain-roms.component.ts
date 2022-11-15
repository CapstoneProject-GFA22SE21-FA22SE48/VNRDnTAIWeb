import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { ValidateAccount } from 'src/services/validateAccount.service';
import { Shape, Sign } from 'src/app/models/General.model';
import { Subject } from 'rxjs';
import { FileUploadService } from 'src/services/file-upload.service';
import * as signClasses from '../../../../assets/sign-classes/signClasses.json';
import { getStorage, ref, getBytes, listAll } from 'firebase/storage';
import { Status } from 'src/app/common/status';

@Component({
  selector: 'app-retrain-roms',
  templateUrl: './retrain-roms.component.html',
  styleUrls: ['./retrain-roms.component.css'],
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
    // { statusName: 'Đã duyệt', statusCode: 7 },
    // { statusName: 'Đã từ chối', statusCode: 4 },
    { statusName: 'Đã xử lý', statusCode: 3 },
  ];
  filterStatusCode: any;

  @ViewChild('calendar') private calendar: any;
  filterRangeDates: any;
  //end of filtering data

  //start of image labelling
  imgFile: any;
  @Input() labels: Shape[] = [];
  @Input() currentLabel: Subject<Shape> | undefined;

  imgWidth: any;
  imgHeight: any;

  createdLabel: Shape | undefined;

  signs: any;
  selectedSign: any;
  //end of image labelling

  constructor(
    private isLoadingService: IsLoadingService,
    private wrapperService: WrapperService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private validateAccount: ValidateAccount,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.validateAccount.isActiveAccount();
    this.loadRoms();
    this.loadAssigedSigns();
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
          this.roms = response.data?.sort(
            (a: any, b: any) =>
              b.status - a.status ||
              <any>new Date(a.createdDate) - <any>new Date(b.createdDate)
          );

          this.tmpRoms = this.roms;
          // this.filterData();

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  loadAssigedSigns() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAssignedSigns +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.signs = response.data;
          this.signs.sort((s1: Sign, s2: Sign) => (s1.name > s2.name ? 1 : -1));
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
      );
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

  viewImgEvidence(rom: any) {
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
        this.selectedRom.scribeId = decodeToken(getStorageToken() || '')?.Id;

        this.isLoadingService.add();
        this.wrapperService.put(
          paths.ScribeClaimRetrainRom + '/' + this.selectedRom.id,
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
    this.displayImgEvidence = false;
  }

  resolveRom(rom: any) {
    this.validateAccount.isActiveAccount();
    this.selectedRom = rom;
    this.displayResolveRom = true;

    this.imgFile = new Image();
    this.imgFile.src = this.selectedRom?.imageUrl;

    this.imgFile.onload = () => {
      this.imgWidth = this.imgFile?.width;
      this.imgHeight = this.imgFile?.height;
    };
  }

  startLabelling(evt: MouseEvent) {
    this.labels = [];
    this.createdLabel = {
      x: evt?.offsetX,
      y: evt?.offsetY,
      w: 0,
      h: 0,
    };
    if (this.labels && this.labels.length === 1) {
      return;
    } else {
      this.labels.push(this.createdLabel);
    }
  }

  keepLabelling(evt: MouseEvent) {
    if (this.createdLabel) {
      this.currentLabel?.next(this.createdLabel);
      this.createdLabel.w = evt?.offsetX - this.createdLabel?.x;
      this.createdLabel.h = evt?.offsetY - this.createdLabel?.y;
    }
  }

  stopLabelling() {
    if (this.createdLabel?.w === 0 || this.createdLabel?.h === 0) {
      this.labels = [];
      return;
    }
    this.createdLabel = undefined;
  }

  clearLabelData() {
    this.selectedSign = undefined;
    this.createdLabel = undefined;
    this.labels = [];
  }

  confirmSaveLabel(event: any) {
    this.validateAccount.isActiveAccount();

    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmClaim',
      message: 'Lưu file hình ảnh cùng file label lên firebase. Bạn có chắc?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //Count current sign class existing incidents
        var existingIndcidentCount = 0;
        listAll(
          ref(
            getStorage(),
            `user-feedbacks/retrain-resolved-sign-images/${
              this.selectedSign?.name?.split(' ')[2]
            }/imgs`
          )
        ).then((value: any) => {
          existingIndcidentCount = value?.items?.length;

          //send email to AI Department if incidents >= 30
          if (existingIndcidentCount >= 29) {
            this.isLoadingService.add();
            this.wrapperService.post(
              paths.AutoMailingExceededSignIncidents,
              JSON.parse(
                JSON.stringify(
                  `Biển ${
                    this.selectedSign?.name?.split(' ')[2]
                  } cần được re-train.\nVui lòng kiểm tra images & labels ở đường dẫn bên dưới.\nhttps://console.firebase.google.com/u/0/project/vnrdntai/storage/vnrdntai.appspot.com/files/~2Fuser-feedbacks~2Fretrain-resolved-sign-images`
                )
              ),
              getStorageToken(),
              {
                successCallback: (response) => {
                  this.isLoadingService.remove();
                },
                errorCallback: (error) => {
                  console.log(error);
                  this.isLoadingService.remove();
                },
              }
            );
          }

          var selectedSignClass = '-1';

          Object.entries(JSON.parse(JSON.stringify(signClasses))).forEach(
            ([key, value]) => {
              if (value === this.selectedSign?.name?.split(' ')[2]) {
                selectedSignClass = key;
              }
            }
          );

          var labelTxt =
            selectedSignClass +
            ' ' +
            (
              (this.labels[0]?.x + this.labels[0]?.w / 2) /
              this.imgWidth
            ).toFixed(6) +
            ' ' +
            (
              (this.labels[0]?.y + this.labels[0]?.h / 2) /
              this.imgHeight
            ).toFixed(6) +
            ' ' +
            (this.labels[0].w / this.imgWidth).toFixed(6) +
            ' ' +
            (this.labels[0].h / this.imgHeight).toFixed(6);

          var labelFile = new Blob([labelTxt], { type: '.txt' });

          //Upload label .txt file to firebase
          this.fileUploadService
            .uploadImageToFirebase(
              labelFile,
              `user-feedbacks/retrain-resolved-sign-images/${
                this.selectedSign?.name?.split(' ')[2]
              }/labels/${this.selectedSign?.name?.split(' ')[2]}_${
                existingIndcidentCount + 1
              }`
            )
            .then(() => {
              //Download and re-upload img .jpg file to firebase
              getBytes(ref(getStorage(), this.selectedRom.imageUrl)).then(
                (value: any) => {
                  this.fileUploadService
                    .uploadImageToFirebase(
                      new Blob([new Uint8Array(value, 0, value?.byteLength)], {
                        type: '.jpg',
                      }),
                      `user-feedbacks/retrain-resolved-sign-images/${
                        this.selectedSign?.name?.split(' ')[2]
                      }/imgs/${this.selectedSign?.name?.split(' ')[2]}_${
                        existingIndcidentCount + 1
                      }`
                    )
                    .then((imgUrl: any) => {
                      this.selectedRom.imageUrl = imgUrl;
                      this.selectedRom.status = Status.Confirmed;
                      this.isLoadingService.add();
                      this.wrapperService.put(
                        paths.ScribeResolveRetrainRom +
                          '/' +
                          this.selectedRom.id,
                        this.selectedRom,
                        getStorageToken(),
                        {
                          successCallback: (response) => {
                            this.clearData();
                            this.clearLabelData();
                            this.loadRoms();

                            this.displayResolveRom = false;
                            this.isLoadingService.remove();

                            this.messageService.add({
                              severity: 'success',
                              summary: commonStr.success,
                              detail: commonStr.dataUpdatedSuccessfully,
                            });
                          },
                          errorCallback: (error) => {
                            this.clearData();
                            this.clearLabelData();
                            this.loadRoms();

                            this.displayResolveRom = false;
                            this.isLoadingService.remove();

                            this.messageService.add({
                              severity: 'error',
                              summary: commonStr.fail,
                              detail:
                                error?.response?.data || commonStr.errorOccur,
                            });
                          },
                        }
                      );
                    });
                }
              );
            });
        });
      },
      reject: () => {},
    });
  }
}
