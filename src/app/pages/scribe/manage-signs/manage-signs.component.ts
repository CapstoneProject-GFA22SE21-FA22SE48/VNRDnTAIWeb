import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { Sign, SignCategory } from 'src/app/models/General.model';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { FileUploadService } from 'src/services/file-upload.service';
import { OperationType } from 'src/app/common/operationType';
import { MessageService } from 'primeng/api';
import * as commonStr from '../../../common/commonStr';

@Component({
  selector: 'app-manage-signs',
  templateUrl: './manage-signs.component.html',
  styleUrls: ['./manage-signs.component.css'],
})
export class ManageSignsComponent implements OnInit {
  signCategories: SignCategory[] = [];
  signs: Sign[] = [];
  tmpSigns: Sign[] = [];

  admins: any;
  selectedAdmin: any;

  chosenSign: any;
  tmpChosenSign: any;

  status: any[] = [
    { statusCode: 5, name: 'Hoạt động' },
    { statusCode: 6, name: 'Ngưng hoạt động' },
  ];
  filterchosenSignCategoryId: any;
  filterSelectedStatusCode: any;
  filterSearchStr: any;

  //start of update
  isUpdatingChosenSign: boolean = false;
  tmpChosenSignNewName: any;
  tmpChosenSignNewDescription: any;
  tmpChosenSignNewSignCategoryId: any;
  tmpChosenSignNewImageUrl: any;

  tmpChosenSignNewImageFile: any;

  isValidUpdateChosenSign: boolean = false;
  //end of update
 
  displayConfirmUpdateChosenSign: boolean = false;
  displayConfirmDeleteChosenSign: boolean = false;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAssigedSigns();
    this.loadAssignedSignCategories();
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetAdmins, getStorageToken(), {
      successCallback: (response) => {
        this.admins = response.data;
        this.selectedAdmin = this.admins[0];
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }


  loadAssignedSignCategories() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAssignedSignCategories +
        '/' +
        decodeToken(getStorageToken() || '').Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          response.data.forEach((sc: SignCategory) => {
            this.signCategories.push(sc);
          });

          this.signCategories.sort((sc1: SignCategory, sc2: SignCategory) =>
            sc1.name > sc2.name ? 1 : -1
          );

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
        decodeToken(getStorageToken() || '').Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          response.data.forEach((s: Sign) => {
            this.signs.push(s);
          });
          this.signs.sort((s1: Sign, s2: Sign) => (s1.name > s2.name ? 1 : -1));
          this.tmpSigns = this.signs.slice();
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  //filter data
  filterData() {
    this.signs = this.tmpSigns;

    //filter by signCategory
    if (this.filterchosenSignCategoryId) {
      this.isLoadingService.add();
      this.signs = this.signs.filter(
        (sign: Sign) => sign.signCategoryId === this.filterchosenSignCategoryId
      );
      this.isLoadingService.remove();
    }

    //filter by status
    if (this.filterSelectedStatusCode) {
      this.isLoadingService.add();
      this.signs = this.signs.filter(
        (sign: Sign) => sign.status === this.filterSelectedStatusCode
      );
      this.isLoadingService.remove();
    }

    //filter by seachStr
    if (this.filterSearchStr && this.filterSearchStr.trim() !== '') {
      this.isLoadingService.add();
      this.signs = this.signs.filter(
        (sign: Sign) =>
          toNonAccentVietnamese(sign.name.toLowerCase()).includes(
            toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
          ) ||
          toNonAccentVietnamese(sign.description.toLowerCase()).includes(
            toNonAccentVietnamese(this.filterSearchStr.toLowerCase())
          )
      );
      this.isLoadingService.remove();
    }
  }

  openUpdateChosenSign() {
    this.isUpdatingChosenSign = true;
    this.tmpChosenSign = JSON.parse(JSON.stringify(this.chosenSign));
    this.tmpChosenSignNewName = this.tmpChosenSign?.name;
    this.tmpChosenSignNewSignCategoryId = this.tmpChosenSign?.signCategoryId;
    this.tmpChosenSignNewDescription = this.tmpChosenSign?.description;
    this.tmpChosenSignNewImageUrl = this.tmpChosenSign?.imageUrl;
  }

  cancleUpdateChosenSign() {
    this.isUpdatingChosenSign = false;
    this.isValidUpdateChosenSign = false;
    this.clearTmpChosenSignNewData();
  }

  clearTmpChosenSignNewData() {
    this.tmpChosenSignNewName = undefined;
    this.tmpChosenSignNewSignCategoryId = undefined;
    this.tmpChosenSignNewDescription = undefined;
    this.tmpChosenSignNewImageUrl = undefined;

    this.isUpdatingChosenSign = false;

    this.tmpChosenSignNewImageFile = undefined;

    this.isValidUpdateChosenSign = false;
    this.displayConfirmUpdateChosenSign = false;
  }

  getTmpChosenSignNewName() {
    if (this.tmpChosenSignNewName && this.tmpChosenSignNewName.trim() !== '') {
      this.tmpChosenSign.name = this.tmpChosenSignNewName;
      this.detectChange();
    } else {
      this.isValidUpdateChosenSign = false;
    }
  }

  getTmpChosenSignNewSignCategoryId() {
    this.tmpChosenSign.signCategoryId = this.tmpChosenSignNewSignCategoryId;
    this.detectChange();
  }

  getTmpChosenSignNewDescription() {
    if (
      this.tmpChosenSignNewDescription &&
      this.tmpChosenSignNewDescription.trim() !== ''
    ) {
      this.tmpChosenSign.description = this.tmpChosenSignNewDescription;
      this.detectChange();
    } else {
      this.isValidUpdateChosenSign = false;
    }
  }

  gettmpChosenSignNewImageUrl(event: any, imageUploaded: any){
    this.tmpChosenSignNewImageUrl = event.files[0].objectURL?.changingThisBreaksApplicationSecurity;
    this.tmpChosenSignNewImageFile = event.files[0];
    this.tmpChosenSign.imageUrl = this.tmpChosenSignNewImageUrl;
    imageUploaded.clear();
    this.detectChange();
  }

  detectChange() {
    if (
      (JSON.stringify(this.tmpChosenSign) !== JSON.stringify(this.chosenSign)) &&
      this.tmpChosenSign?.name.trim() !== '' &&
      this.tmpChosenSign?.signCategoryId.trim() !== '' &&
      this.tmpChosenSign?.description !== '' &&
      this.tmpChosenSign?.imageUrl.trim() !== ''
    ) {
      this.isValidUpdateChosenSign = true;
    } else {
      this.isValidUpdateChosenSign = false;
    }
  }

  updateChosenSign() {
    this.fileUploadService
      .uploadImageToFirebase(this.tmpChosenSignNewImageFile,  `images/sign-collection/new/${this.tmpChosenSign.name.split(" ")[2]}`)
      .then((imgUrl: any) => {
        this.tmpChosenSign.imageUrl = imgUrl;
      })
      .then( () => {
        this.isLoadingService.add();
        this.wrapperService.post(
          paths.ScribeCreateSignForROM,
          this.tmpChosenSign,
          getStorageToken(),
          {
            successCallback: (response) => {
              this.wrapperService.post(
                paths.ScribeCreateSignModificationRequest,
                {
                  modifiedSignId: this.chosenSign.id,
                  modifyingSignId: response.data.id,
                  scribeId: decodeToken(getStorageToken() || '').Id,
                  adminId: this.selectedAdmin.id,
                  operationType: OperationType.Update,
                },
                getStorageToken(),
                {
                  successCallback: (response) => {
                    this.clearTmpChosenSignNewData();
                    this.displayConfirmUpdateChosenSign = false;
                    this.messageService.add({
                      severity: 'success',
                      summary: commonStr.success,
                      detail: commonStr.romCreatedSuccessfully,
                    });
                    this.isLoadingService.remove();
                  },
                  errorCallback: (error) => {
                    console.log(error);
                    this.displayConfirmUpdateChosenSign = false;
                    this.messageService.add({
                      severity: 'error',
                      summary: commonStr.fail,
                      detail: commonStr.errorOccur,
                    });
                    this.isLoadingService.remove();
                  },
                }
              );
            },
            errorCallback: (error) => {
              console.log(error);
              this.displayConfirmUpdateChosenSign = false;
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
        
      );
    
  }

  deleteChosenSign(){
    this.tmpChosenSign.isDeleted = true;

    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateSignForROM,
      this.tmpChosenSign,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateSignModificationRequest,
            {
              modifiedSignId: this.chosenSign.id,
              modifyingSignId: response.data.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.clearTmpChosenSignNewData();
                this.displayConfirmDeleteChosenSign = false;
                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmDeleteChosenSign = false;
                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        },
        errorCallback: (error) => {
          console.log(error);
          this.displayConfirmDeleteChosenSign = false;
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
}
