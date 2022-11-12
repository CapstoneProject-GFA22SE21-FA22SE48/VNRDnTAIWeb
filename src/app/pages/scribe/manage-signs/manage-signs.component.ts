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
import { NotificationService } from 'src/services/notification.service';
import { SubjectType } from 'src/app/common/subjectType';
import { ValidateAccount } from 'src/services/validateAccount.service';

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

  filterchosenSignCategoryId: any;
  filterSearchStr: any;

  //start of update
  isUpdatingChosenSign: boolean = false;
  tmpChosenSignNewName: any;
  isValidChosenSignNewName: boolean = true;
  tmpChosenSignNewDescription: any;
  tmpChosenSignNewSignCategoryId: any;
  tmpChosenSignNewImageUrl: any;

  tmpChosenSignNewImageFile: any;

  isValidUpdateChosenSign: boolean = false;

  isValidClickOnCreate: boolean = true;

  tmpChosenSignNewSignParagraphList: any;
  displayAddChosenSignParagraph: boolean = false;

  addingChosenSignStatueList: any;
  addingChosenSignStatue: any;
  addingChosenSignSectionList: any;
  addingChosenSignSection: any;
  addingChosenSignParagraphList: any;
  addingChosenSignParagraph: any;

  emptyParagraphSectionMsg: any;
  addingErrorChosenSignAddingSignParagraphMsg: any;

  //used for holding temporary signParagraph list for adding signParagraph to chosen sign
  newChosenSignSignParagraphList: any;
  tmpChosenSignAddingSignParagraphList: any[] = [];
  //end of update

  //start of create
  isCreatingNewSign: boolean = false;

  newSignName: any;
  isValidNewSignName: boolean = true;

  newSignDescription: any;
  isValidNewSignDescription: boolean = true;

  newSignSignCategoryId: any;

  newSignImageUrl: any;
  newSignImageFile: any;

  isValidCreateNewSign: boolean = false;

  //new sign -> adding signParagraphs
  tmpNewSignNewSignParagraphList: any;
  displayAddNewSignSignParagraph: boolean = false;

  addingNewSignStatueList: any;
  addingNewSignStatue: any;
  addingNewSignSectionList: any;
  addingNewSignSection: any;
  addingNewSignParagraphList: any;
  addingNewSignParagraph: any;

  emptyParagraphSectionOfNewSignMsg: any;
  addingErrorNewSignAddingSignParagraphMsg: any;

  newSignSignParagraphList: any; //used for holding temporary signParagraph list for adding signParagraph to new sign
  tmpNewSignAddingSignParagraphList: any[] = [];
  //end of create

  displayConfirmUpdateChosenSign: boolean = false;
  displayConfirmDeleteChosenSign: boolean = false;
  displayConfirmCreateNewSign: boolean = false;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private notiService: NotificationService,
    private validateAccount: ValidateAccount,
  ) {}

  ngOnInit() {
    this.validateAccount.isActiveAccount();
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
        decodeToken(getStorageToken() || '')?.Id,
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
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.signs = response.data;
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

  filterData() {
    this.validateAccount.isActiveAccount();
    this.signs = this.tmpSigns;

    //filter by signCategory
    if (this.filterchosenSignCategoryId) {
      this.isLoadingService.add();
      this.signs = this.signs.filter(
        (sign: Sign) => sign.signCategoryId === this.filterchosenSignCategoryId
      );
      this.isLoadingService.remove();
    }

    //filter by seachStr
    if (this.filterSearchStr && this.filterSearchStr.trim() !== '') {
      this.isLoadingService.add();
      this.signs = this.signs.filter(
        (sign: Sign) =>
          toNonAccentVietnamese(sign.name.toLowerCase())
            .trim()
            .includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase()).trim()
            ) ||
          toNonAccentVietnamese(sign.description.toLowerCase())
            .trim()
            .includes(
              toNonAccentVietnamese(this.filterSearchStr.toLowerCase()).trim()
            )
      );
      this.isLoadingService.remove();
    }
  }

  openUpdateChosenSign() {
    this.validateAccount.isActiveAccount();
    this.isUpdatingChosenSign = true;
    this.tmpChosenSign = JSON.parse(JSON.stringify(this.chosenSign));
    this.tmpChosenSignNewName = this.tmpChosenSign?.name;
    this.tmpChosenSignNewSignCategoryId = this.tmpChosenSign?.signCategoryId;
    this.tmpChosenSignNewDescription = this.tmpChosenSign?.description;
    this.tmpChosenSignNewImageUrl = this.tmpChosenSign?.imageUrl;

    this.tmpChosenSignNewSignParagraphList = this.tmpChosenSign?.signParagraphs;

    this.newChosenSignSignParagraphList = JSON.parse(
      JSON.stringify(this.tmpChosenSignNewSignParagraphList)
    );

    this.isValidClickOnCreate = false;
  }

  cancleUpdateChosenSign() {
    this.validateAccount.isActiveAccount();
    this.isUpdatingChosenSign = false;
    this.isValidUpdateChosenSign = false;
    this.clearTmpChosenSignNewData();
  }

  clearTmpChosenSignNewData() {
    this.tmpChosenSignNewName = undefined;
    this.isValidChosenSignNewName = true;
    this.tmpChosenSignNewSignCategoryId = undefined;
    this.tmpChosenSignNewDescription = undefined;
    this.tmpChosenSignNewImageUrl = undefined;

    this.isUpdatingChosenSign = false;

    this.tmpChosenSignNewImageFile = undefined;

    this.tmpChosenSignNewSignParagraphList = undefined;
    this.displayAddChosenSignParagraph = false;

    this.addingChosenSignStatueList = undefined;
    this.addingChosenSignStatue = undefined;
    this.addingChosenSignSectionList = undefined;
    this.addingChosenSignSection = undefined;
    this.addingChosenSignParagraphList = undefined;
    this.addingChosenSignParagraph = undefined;

    this.tmpChosenSignAddingSignParagraphList = [];

    this.isValidUpdateChosenSign = false;
    this.displayConfirmUpdateChosenSign = false;

    this.newChosenSignSignParagraphList = undefined;
  }

  getTmpChosenSignNewName() {
    this.validateAccount.isActiveAccount();
    if (
      !this.tmpChosenSignNewName ||
      this.tmpChosenSignNewName?.trim() === '' ||
      this.tmpChosenSignNewName?.length > 150 ||
      !this.tmpChosenSignNewName?.match('^Biển số ([a-zA-Z0-9.]+)[ ]{1}".*"$')
    ) {
      this.isValidUpdateChosenSign = false;
      this.isValidChosenSignNewName = false;
    } else {
      this.isValidChosenSignNewName = true;
      this.tmpChosenSign.name = this.tmpChosenSignNewName;
      this.detectChange();
    }
  }

  getTmpChosenSignNewSignCategoryId() {
    this.validateAccount.isActiveAccount();
    this.tmpChosenSign.signCategoryId = this.tmpChosenSignNewSignCategoryId;
    this.detectChange();
  }

  getTmpChosenSignNewDescription() {
    this.validateAccount.isActiveAccount();
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

  getTmpChosenSignNewImageUrl(event: any, imageUploaded: any) {
    this.validateAccount.isActiveAccount();
    this.tmpChosenSignNewImageUrl =
      event.files[0].objectURL?.changingThisBreaksApplicationSecurity;
    this.tmpChosenSignNewImageFile = event.files[0];
    this.tmpChosenSign.imageUrl = this.tmpChosenSignNewImageUrl;
    imageUploaded.clear();
    this.detectChange();
  }

  removeChosenSignSignParagraph(signParagraph: any) {
    this.validateAccount.isActiveAccount();
    this.newChosenSignSignParagraphList =
      this.newChosenSignSignParagraphList.filter(
        (sp: any) =>
          sp.signParagraphParagraphId !== signParagraph.signParagraphParagraphId
      );

    this.tmpChosenSignNewSignParagraphList =
      this.newChosenSignSignParagraphList;

    this.detectChange();
  }

  // start of adding chosen sign signParagraph
  loadAddingChosenSignStatueList() {
    this.displayAddChosenSignParagraph = true;
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAllStatueForAddingReferences,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.addingChosenSignStatueList = response.data.sort(
            (s1: any, s2: any) =>
              s1.name?.split(' ')[1] - s2.name?.split(' ')[1]
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

  selectAddingChosenSignStatue(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingChosenSignSection = undefined;
    this.addingChosenSignParagraph = undefined;

    this.addingChosenSignStatue = event.value;

    if (this.addingChosenSignStatue) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSectionsByStatueId +
          '/' +
          this.addingChosenSignStatue?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.addingChosenSignSectionList = response.data;
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    }
  }

  selectAddingChosenSignSection(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingChosenSignParagraph = undefined;

    this.addingChosenSignSection = event.value;

    if (this.addingChosenSignSection) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId +
          '/' +
          this.addingChosenSignSection?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            //This section has an empty paragraph
            if (response.data.length === 1 && response.data[0].name === '') {
              this.emptyParagraphSectionMsg = 'Khoản này không chứa điểm';
            } else {
              this.addingChosenSignParagraphList = response.data;

              //Remove added reference paragraphs from the list of reference paragraph that will be added
              if (this.newChosenSignSignParagraphList !== undefined) {
                this.newChosenSignSignParagraphList.forEach(
                  (addedSignParagraph: any) => {
                    this.addingChosenSignParagraphList =
                      this.addingChosenSignParagraphList.filter(
                        (r: any) =>
                          r.id !== addedSignParagraph?.signParagraphParagraphId
                      );
                  }
                );
              }

              this.emptyParagraphSectionMsg = '';
            }
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    }
  }

  selectAddingChosenSignParagraph(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingChosenSignParagraph = event.value;
  }

  //"Hủy" button clicked / dialog add chosen sign signParagraph onHide
  clearAddChosenSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    this.displayAddChosenSignParagraph = false;

    this.addingChosenSignStatueList = undefined;
    this.addingChosenSignStatue = null;
    this.addingChosenSignSectionList = undefined;
    this.addingChosenSignSection = undefined;
    this.addingChosenSignParagraphList = undefined;
    this.addingChosenSignParagraph = undefined;

    this.emptyParagraphSectionMsg = undefined;
    this.addingErrorChosenSignAddingSignParagraphMsg = undefined;

    this.tmpChosenSignAddingSignParagraphList = [];
  }

  //"Lưu lại" button clicked
  addChosenSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    if (
      !this.addingChosenSignParagraph ||
      !this.addingChosenSignSection ||
      !this.addingChosenSignStatue
    ) {
      this.addingErrorChosenSignAddingSignParagraphMsg =
        'Vui lòng chọn điều, khoản, điểm trước khi lưu lại';
      return;
    } else {
      this.addingErrorChosenSignAddingSignParagraphMsg = '';
    }

    let signParagraph = {
      signParagraphParagraphId: this.addingChosenSignParagraph.id,
      signParagraphParagraphName: this.addingChosenSignParagraph.name,
      signParagraphParagraphDesc: this.addingChosenSignParagraph.description,

      signParagraphSectionId: this.addingChosenSignSection.id,
      signParagraphSectionName: this.addingChosenSignSection.name,

      signParagraphStatueId: this.addingChosenSignStatue.id,
      signParagraphStatueName: this.addingChosenSignStatue.name,
    };

    var existed = false;

    //check with original reference list before adding
    this.tmpChosenSign.signParagraphs.forEach((r: any) => {
      if (
        r.signParagraphParagraphId == signParagraph.signParagraphParagraphId &&
        r.signParagraphSectionId == signParagraph.signParagraphSectionId &&
        r.signParagraphStatueId == signParagraph.signParagraphStatueId
      ) {
        this.addingErrorChosenSignAddingSignParagraphMsg =
          'Điểm đã tồn tại trong danh sách';
      } else {
        //check with temporary reference list before adding
        existed = this.tmpChosenSignAddingSignParagraphList.some((r: any) => {
          if (
            r.signParagraphParagraphId ==
              signParagraph.signParagraphParagraphId &&
            r.signParagraphSectionId == signParagraph.signParagraphSectionId &&
            r.signParagraphStatueId == signParagraph.signParagraphStatueId
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
    });

    if (this.tmpChosenSignAddingSignParagraphList.length === 0 || !existed) {
      this.tmpChosenSignAddingSignParagraphList.push(signParagraph);
      this.addingErrorChosenSignAddingSignParagraphMsg = '';
    } else {
      this.addingErrorChosenSignAddingSignParagraphMsg =
        'Điểm đã tồn tại trong danh sách';
    }
  }

  // 'x' button clicked inside adding signParagraphs for chosen sign
  removeChosenSignTmpSignParagraph(i: any) {
    this.validateAccount.isActiveAccount();
    this.tmpChosenSignAddingSignParagraphList.splice(i, 1);
    this.addingErrorChosenSignAddingSignParagraphMsg = '';
  }

  //"Hoàn thành" button clicked
  completeAddChosenSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    if (!this.newChosenSignSignParagraphList) {
      this.newChosenSignSignParagraphList = [];
    }

    this.tmpChosenSignAddingSignParagraphList.forEach((r: any) => {
      this.newChosenSignSignParagraphList.push(r);
    });
    this.tmpChosenSign.signParagraphs = this.newChosenSignSignParagraphList;
    this.displayAddChosenSignParagraph = false;

    this.detectChange();
  }

  detectChange() {
    if (
      JSON.stringify(this.tmpChosenSign) !== JSON.stringify(this.chosenSign) &&
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
  //end of adding chosen sign signParagraphs

  // start of adding new sign signParagraph
  loadAddingNewSignStatueList() {
    this.displayAddNewSignSignParagraph = true;
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAllStatueForAddingReferences,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.addingNewSignStatueList = response.data.sort(
            (s1: any, s2: any) =>
              s1.name?.split(' ')[1] - s2.name?.split(' ')[1]
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

  selectAddingNewSignStatue(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingNewSignSection = undefined;
    this.addingNewSignParagraph = undefined;

    this.addingNewSignStatue = event.value;

    if (this.addingNewSignStatue) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSectionsByStatueId + '/' + this.addingNewSignStatue?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.addingNewSignSectionList = response.data;
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    }
  }

  selectAddingNewSignSection(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingNewSignParagraph = undefined;

    this.addingNewSignSection = event.value;

    if (this.addingNewSignSection) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId +
          '/' +
          this.addingNewSignSection?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            //This section has an empty paragraph
            if (response.data.length === 1 && response.data[0].name === '') {
              this.emptyParagraphSectionOfNewSignMsg =
                'Khoản này không chứa điểm';
            } else {
              this.addingNewSignParagraphList = response.data;

              //Remove added reference paragraphs from the list of reference paragraph that will be added
              if (this.newSignSignParagraphList !== undefined) {
                this.newSignSignParagraphList.forEach(
                  (addedSignParagraph: any) => {
                    this.addingNewSignParagraphList =
                      this.addingNewSignParagraphList.filter(
                        (r: any) =>
                          r.id !== addedSignParagraph?.signParagraphParagraphId
                      );
                  }
                );
              }

              this.emptyParagraphSectionOfNewSignMsg = '';
            }
            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    }
  }

  selectAddingNewSignParagraph(event: any) {
    this.validateAccount.isActiveAccount();
    this.addingNewSignParagraph = event.value;
  }

  //"Hủy" button clicked / dialog add new sign signParagraph onHide
  clearAddNewSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    this.displayAddNewSignSignParagraph = false;

    this.addingNewSignStatueList = undefined;
    this.addingNewSignStatue = null;
    this.addingNewSignSectionList = undefined;
    this.addingNewSignSection = undefined;
    this.addingNewSignParagraphList = undefined;
    this.addingNewSignParagraph = undefined;

    this.emptyParagraphSectionOfNewSignMsg = undefined;
    this.addingErrorNewSignAddingSignParagraphMsg = undefined;

    this.tmpNewSignAddingSignParagraphList = [];
  }

  //"Lưu lại" button clicked
  addNewSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    if (
      !this.addingNewSignParagraph ||
      !this.addingNewSignSection ||
      !this.addingNewSignStatue
    ) {
      this.addingErrorNewSignAddingSignParagraphMsg =
        'Vui lòng chọn điều, khoản, điểm trước khi lưu lại';
      return;
    } else {
      this.addingErrorNewSignAddingSignParagraphMsg = '';
    }

    let signParagraph = {
      signParagraphParagraphId: this.addingNewSignParagraph.id,
      signParagraphParagraphName: this.addingNewSignParagraph.name,
      signParagraphParagraphDesc: this.addingNewSignParagraph.description,

      signParagraphSectionId: this.addingNewSignSection.id,
      signParagraphSectionName: this.addingNewSignSection.name,

      signParagraphStatueId: this.addingNewSignStatue.id,
      signParagraphStatueName: this.addingNewSignStatue.name,
    };

    var existed = false;

    //check with original reference list before adding
    // this.tmpChosenSign.signParagraphs.forEach((r: any) => {
    //   if (
    //     r.signParagraphParagraphId == signParagraph.signParagraphParagraphId &&
    //     r.signParagraphSectionId ==
    //     signParagraph.signParagraphSectionId &&
    //     r.signParagraphStatueId ==
    //     signParagraph.signParagraphStatueId
    //   ) {
    //     this.addingErrorChosenSignAddingSignParagraphMsg =
    //       'Điểm đã tồn tại trong danh sách';
    //   } else {
    //check with temporary reference list before adding
    existed = this.tmpNewSignAddingSignParagraphList.some((r: any) => {
      if (
        r.signParagraphParagraphId == signParagraph.signParagraphParagraphId &&
        r.signParagraphSectionId == signParagraph.signParagraphSectionId &&
        r.signParagraphStatueId == signParagraph.signParagraphStatueId
      ) {
        return true;
      } else {
        return false;
      }
    });
    // }
    // });

    if (this.tmpNewSignAddingSignParagraphList.length === 0 || !existed) {
      this.tmpNewSignAddingSignParagraphList.push(signParagraph);
      this.addingErrorNewSignAddingSignParagraphMsg = '';
    } else {
      this.addingErrorNewSignAddingSignParagraphMsg =
        'Điểm đã tồn tại trong danh sách';
    }
  }

  // 'x' button clicked inside adding signParagraphs for new sign
  removeNewSignTmpSignParagraph(i: any) {
    this.validateAccount.isActiveAccount();
    this.tmpNewSignAddingSignParagraphList.splice(i, 1);
    this.addingErrorNewSignAddingSignParagraphMsg = '';
  }

  //"Hoàn thành" button clicked
  completeAddNewSignSignParagraph() {
    this.validateAccount.isActiveAccount();
    if (!this.newSignSignParagraphList) {
      this.newSignSignParagraphList = [];
    }

    this.tmpNewSignAddingSignParagraphList.forEach((r: any) => {
      this.newSignSignParagraphList.push(r);
    });
    // this.tmpChosenSign.signParagraphs =
    //   this.newChosenSignSignParagraphList;
    this.displayAddNewSignSignParagraph = false;
  }
  //end of adding new sign signParagraphs

  updateChosenSign() {
    this.validateAccount.isActiveAccount();
    if (this.tmpChosenSignNewImageFile !== undefined) {
      this.fileUploadService
        .uploadImageToFirebase(
          this.tmpChosenSignNewImageFile,
          `images/sign-collection/new/${this.tmpChosenSign.name.split(' ')[2]}`
        )
        .then((imgUrl: any) => {
          this.tmpChosenSign.imageUrl = imgUrl;
        })
        .then(() => {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCreateSignForROM,
            this.tmpChosenSign,
            getStorageToken(),
            {
              successCallback: (response1) => {
                this.wrapperService.post(
                  paths.ScribeCreateSignModificationRequest,
                  {
                    modifiedSignId: this.chosenSign.id,
                    modifyingSignId: response1.data.id,
                    scribeId: decodeToken(getStorageToken() || '')?.Id,
                    adminId: this.selectedAdmin.id,
                    operationType: OperationType.Update,
                  },
                  getStorageToken(),
                  {
                    successCallback: (response2) => {
                      //add notification
                      this.notiService.create({
                        subjectId: response2.data?.modifyingSignId,
                        subjectType: SubjectType.Sign,
                        senderId: decodeToken(getStorageToken() || '')?.Id,
                        senderUsername: response2.data?.scribe?.username || '',
                        receiverId: this.selectedAdmin.id,
                        receiverUsername: this.selectedAdmin?.username || '',
                        action: commonStr.requestUpdate,
                        relatedDescription: this.tmpChosenSign?.name,
                        createdDate: new Date().toString(),
                        isRead: false,
                      });
                      this.clearTmpChosenSignNewData();
                      this.loadAdmins();
                      this.loadAssigedSigns();
                      this.displayConfirmUpdateChosenSign = false;

                      this.isLoadingService.remove();

                      this.messageService.add({
                        severity: 'success',
                        summary: commonStr.success,
                        detail: commonStr.romCreatedSuccessfully,
                      });
                    },
                    errorCallback: (error) => {
                      this.clearTmpChosenSignNewData();
                      this.loadAdmins();
                      this.loadAssigedSigns();
                      this.displayConfirmUpdateChosenSign = false;

                      this.chosenSign = undefined;

                      this.isLoadingService.remove();

                      this.messageService.add({
                        severity: 'error',
                        summary: commonStr.fail,
                        detail: error?.response?.data || commonStr.errorOccur,
                      });
                    },
                  }
                );
              },
              errorCallback: (error) => {
                this.clearTmpChosenSignNewData();
                this.loadAdmins();
                this.loadAssigedSigns();
                this.displayConfirmUpdateChosenSign = false;

                this.isLoadingService.remove();

                this.messageService.add({
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
              },
            }
          );
        });
    } else {
      this.isLoadingService.add();
      this.wrapperService.post(
        paths.ScribeCreateSignForROM,
        this.tmpChosenSign,
        getStorageToken(),
        {
          successCallback: (response1) => {
            this.wrapperService.post(
              paths.ScribeCreateSignModificationRequest,
              {
                modifiedSignId: this.chosenSign.id,
                modifyingSignId: response1.data.id,
                scribeId: decodeToken(getStorageToken() || '')?.Id,
                adminId: this.selectedAdmin.id,
                operationType: OperationType.Update,
              },
              getStorageToken(),
              {
                successCallback: (response2) => {
                  //add notification
                  this.notiService.create({
                    subjectId: response2.data?.modifyingSignId,
                    subjectType: SubjectType.Sign,
                    senderId: decodeToken(getStorageToken() || '')?.Id,
                    senderUsername: response2.data?.scribe?.username || '',
                    receiverId: this.selectedAdmin.id,
                    receiverUsername: this.selectedAdmin?.username || '',
                    action: commonStr.requestUpdate,
                    relatedDescription: this.tmpChosenSign?.name,
                    createdDate: new Date().toString(),
                    isRead: false,
                  });
                  this.clearTmpChosenSignNewData();
                  this.loadAdmins();
                  this.loadAssigedSigns();
                  this.displayConfirmUpdateChosenSign = false;

                  this.isLoadingService.remove();

                  this.messageService.add({
                    severity: 'success',
                    summary: commonStr.success,
                    detail: commonStr.romCreatedSuccessfully,
                  });
                },
                errorCallback: (error) => {
                  this.clearTmpChosenSignNewData();
                  this.loadAdmins();
                  this.loadAssigedSigns();
                  this.displayConfirmUpdateChosenSign = false;

                  this.chosenSign = undefined;

                  this.isLoadingService.remove();

                  this.messageService.add({
                    severity: 'error',
                    summary: commonStr.fail,
                    detail: error?.response?.data || commonStr.errorOccur,
                  });
                },
              }
            );
          },
          errorCallback: (error) => {
            this.clearTmpChosenSignNewData();
            this.loadAdmins();
            this.loadAssigedSigns();
            this.displayConfirmUpdateChosenSign = false;

            this.isLoadingService.remove();

            this.messageService.add({
              severity: 'error',
              summary: commonStr.fail,
              detail: commonStr.errorOccur,
            });
          },
        }
      );
    }
  }

  deleteChosenSign() {
    this.validateAccount.isActiveAccount();
    this.chosenSign.isDeleted = true;

    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateSignForROM,
      this.chosenSign,
      getStorageToken(),
      {
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateSignModificationRequest,
            {
              modifiedSignId: this.chosenSign.id,
              modifyingSignId: response1.data.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.modifyingSignId,
                  subjectType: SubjectType.Sign,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestDelete,
                  relatedDescription: this.chosenSign?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });
                this.clearTmpChosenSignNewData();
                this.displayConfirmDeleteChosenSign = false;
                this.messageService.add({
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.loadAdmins();
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

  openCreateSign() {
    this.validateAccount.isActiveAccount();
    this.isCreatingNewSign = true;
    this.newSignSignCategoryId = this.signCategories[0]?.id;
  }

  clearNewSignData() {
    this.isCreatingNewSign = false;
    this.newSignName = undefined;
    this.isValidNewSignName = true;
    this.newSignDescription = undefined;
    this.isValidNewSignDescription = true;
    this.newSignSignCategoryId = undefined;
    this.newSignImageUrl = undefined;
    this.newSignImageFile = undefined;
    this.isValidCreateNewSign = false;

    this.newSignSignParagraphList = undefined;
  }

  getNewSignName() {
    this.validateAccount.isActiveAccount();
    if (
      this.newSignName?.trim() === '' ||
      this.newSignName?.length > 150 ||
      !this.newSignName?.match('^Biển số ([a-zA-Z0-9.]+)[ ]{1}".*"$')
    ) {
      this.isValidNewSignName = false;
    } else {
      this.isValidNewSignName = true;
    }
    this.checkIsValidNewSign();
  }

  getNewSignDescription() {
    this.validateAccount.isActiveAccount();
    if (
      this.newSignDescription?.trim() === '' ||
      this.newSignDescription?.length > 2000
    ) {
      this.isValidNewSignDescription = false;
    } else {
      this.isValidNewSignDescription = true;
    }
    this.checkIsValidNewSign();
  }

  getNewSignImageUrl(event: any, imageUploaded: any) {
    this.validateAccount.isActiveAccount();
    this.newSignImageUrl =
      event.files[0].objectURL?.changingThisBreaksApplicationSecurity;
    this.newSignImageFile = event.files[0];
    imageUploaded.clear();
    this.checkIsValidNewSign();
  }

  checkIsValidNewSign() {
    if (
      this.newSignName !== undefined &&
      this.newSignName?.trim() !== '' &&
      this.isValidNewSignName &&
      this.newSignDescription !== undefined &&
      this.newSignDescription?.trim() !== '' &&
      this.isValidNewSignDescription &&
      this.newSignImageFile !== undefined
    ) {
      this.isValidCreateNewSign = true;
    } else {
      this.isValidCreateNewSign = false;
    }
  }

  createNewSign() {
    this.validateAccount.isActiveAccount();
    this.fileUploadService
      .uploadImageToFirebase(
        this.newSignImageFile,
        `images/sign-collection/new/${this.newSignName.split(' ')[2]}`
      )
      .then((imgUrl: any) => {
        this.newSignImageUrl = imgUrl;
      })
      .then(() => {
        this.isLoadingService.add();
        this.wrapperService.post(
          paths.ScribeCreateSignForROM,
          {
            name: this.newSignName,
            description: this.newSignDescription,
            signCategoryId: this.newSignSignCategoryId,
            imageUrl: this.newSignImageUrl,

            signParagraphs: this.newSignSignParagraphList,
          },
          getStorageToken(),
          {
            successCallback: (response1) => {
              this.wrapperService.post(
                paths.ScribeCreateSignModificationRequest,
                {
                  modifyingSignId: response1.data.id,
                  scribeId: decodeToken(getStorageToken() || '')?.Id,
                  adminId: this.selectedAdmin.id,
                  operationType: OperationType.Add,
                },
                getStorageToken(),
                {
                  successCallback: (response2) => {
                    //add notification
                    this.notiService.create({
                      subjectId: response2.data?.modifyingSignId,
                      subjectType: SubjectType.Sign,
                      senderId: decodeToken(getStorageToken() || '')?.Id,
                      senderUsername: response2.data?.scribe?.username || '',
                      receiverId: this.selectedAdmin.id,
                      receiverUsername: this.selectedAdmin?.username || '',
                      action: commonStr.requestCreate,
                      relatedDescription: this.newSignName,
                      createdDate: new Date().toString(),
                      isRead: false,
                    });
                    this.clearNewSignData();
                    this.displayConfirmCreateNewSign = false;
                    this.messageService.add({
                      severity: 'success',
                      summary: commonStr.success,
                      detail: commonStr.romCreatedSuccessfully,
                    });
                    this.loadAdmins();
                    this.isLoadingService.remove();
                  },
                  errorCallback: (error) => {
                    console.log(error);
                    this.displayConfirmCreateNewSign = false;
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
              this.displayConfirmCreateNewSign = false;
              this.messageService.add({
                severity: 'error',
                summary: commonStr.fail,
                detail: commonStr.errorOccur,
              });
              this.isLoadingService.remove();
            },
          }
        );
      });
  }
}
