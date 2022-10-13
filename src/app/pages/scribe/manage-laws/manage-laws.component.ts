import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-laws',
  templateUrl: './manage-laws.component.html',
  styleUrls: ['./manage-laws.component.css'],
})
export class ManageLawsComponent implements OnInit {
  scribe: any;
  decree: any;
  column: any;
  subMenuSelectedColumnId: any;

  //Statue
  searchStatueStr: string = '';
  statues: any;
  tmpStatues: any;
  selectedStatue: any;
  chosenStatue: any;
  tmpChosenStatue: any;
  isUpdatingChosenStatue: boolean = false;

  newChosenStatueDesc: any;
  invalidChosenStatueNewDesc: boolean = false;
  isValidUpdatingStatue: boolean = false;
  //end statue

  // Section
  sections: any;
  tmpSections: any;
  selectedSection: any;
  chosenSection: any;
  tmpChosenSection: any;
  isUpdatingChosenSection: boolean = false;
  invalidChosenSectionNewDesc: boolean = false;
  isValidUpdatingSection: boolean = false;

  newChosenSectionDesc: any;
  selectedChosenSectionVehicleCatId: any;
  newChosenSectionMinPenalty: any;
  invalidChosenSectionNewPenaltyMsg: any;
  newChosenSectionMaxPenalty: any;

  searchSectionStr: string = '';
  filterSectionMinPenalty: any;
  filterSectionMaxPenalty: any;
  filterSectionVehicleCategory: any;

  invalidFilterSectionMinPenalty: boolean = false;
  invalidFilterSectionMinPenaltyMsg: any;
  invalidFilterSectionMaxPenalty: boolean = false;
  invalidFilterSectionMaxPenaltyMsg: any;
  //end section

  //paragraph
  paragraphs: any;
  tmpParagraphs: any;
  selectedparagraph: any;
  chosenParagraph: any;
  tmpChosenParagraph: any;
  isUpdatingChosenParagraph: boolean = false;
  //end of paragraph

  vehicleCats: any;
  selectedVehicleCat: any;

  admins: any;
  selectedAdmin: any;

  displayConfirmUpdateStatueDialog: boolean = false;
  displayConfirmDeleteStatueDialog: boolean = false;

  displayConfirmUpdateSectionDialog: boolean = false;
  displayConfirmDeleteSectionDialog: boolean = false;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private messageService: MessageService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.subMenuSelectedColumnId = params.get('id');
      this.loadStatuesOfSubmenuSelectedAssignColumn();
      this.loadDecree();
      this.loadVehicleCat();
      this.loadAdmins();
    });
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

  loadDecree() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetDecrees, getStorageToken(), {
      successCallback: (response) => {
        this.decree = response.data[0];
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  loadStatuesOfSubmenuSelectedAssignColumn() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetPersonalInfo +
        '/' +
        decodeToken(getStorageToken() || '').Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.scribe = response.data;
          this.wrapperService.get(
            paths.ScribeGetAssignedColumnData +
              '/' +
              this.subMenuSelectedColumnId,
            getStorageToken(),
            {
              successCallback: (response) => {
                this.column = response.data[0];
                this.statues = this.column.statues;
                this.tmpStatues = this.column.statues;
                this.statues = this.statues.sort(
                  (s1: any, s2: any) =>
                    parseInt(s1.name.split(' ')[1]) -
                    parseInt(s2.name.split(' ')[1])
                );
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.isLoadingService.remove();
              },
            }
          );
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  loadVehicleCat() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetVehicleCats, getStorageToken(), {
      successCallback: (response) => {
        this.vehicleCats = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  filterStatueData() {
    this.statues = this.tmpStatues;

    //Search
    if (this.searchStatueStr != '') {
      this.statues = this.statues.filter(
        (s: any) =>
          s.name?.toLowerCase().includes(this.searchStatueStr.toLowerCase()) ||
          s.description
            ?.toLowerCase()
            .includes(this.searchStatueStr.toLowerCase())
      );
    }
  }

  checkFilterSectionMinPenalty(event: any) {
    this.filterSectionMinPenalty = event.value;

    if (
      this.filterSectionMinPenalty &&
      this.filterSectionMaxPenalty &&
      this.filterSectionMinPenalty >= this.filterSectionMaxPenalty
    ) {
      this.invalidFilterSectionMinPenalty = true;
      this.invalidFilterSectionMinPenaltyMsg =
        'Vui lòng nhập mức phạt tối thiểu nhỏ hơn mức phạt tối đa';
    } else {
      this.invalidFilterSectionMinPenalty = false;
      this.invalidFilterSectionMinPenaltyMsg = '';
    }

    this.filterSectionData();
  }

  checkFilterSectionMaxPenalty(event: any) {
    this.filterSectionMaxPenalty = event.value;

    if (
      this.filterSectionMinPenalty &&
      this.filterSectionMaxPenalty &&
      this.filterSectionMaxPenalty <= this.filterSectionMinPenalty
    ) {
      this.invalidFilterSectionMaxPenalty = true;
      this.invalidFilterSectionMaxPenaltyMsg =
        'Vui lòng nhập mức phạt tối đa lớn hơn mức phạt tối thiểu';
    } else {
      this.invalidFilterSectionMaxPenalty = false;
      this.invalidFilterSectionMaxPenaltyMsg = '';
    }
    this.filterSectionData();
  }

  filterSectionData() {
    this.sections = this.tmpSections;

    //Search
    if (this.searchSectionStr != '') {
      this.sections = this.sections.filter(
        (s: any) =>
          s.name?.toLowerCase().includes(this.searchSectionStr.toLowerCase()) ||
          s.description
            ?.toLowerCase()
            .includes(this.searchSectionStr.toLowerCase())
      );
    }

    if(this.filterSectionMinPenalty && this.filterSectionMaxPenalty){
      this.sections = this.sections.filter(
        (s: any) =>
          parseInt(s.minPenalty) >= parseInt(this.filterSectionMinPenalty)
          && parseInt(s.maxPenalty) <= parseInt(this.filterSectionMaxPenalty)
      );
    } else if (this.filterSectionMinPenalty && !this.filterSectionMaxPenalty) {
      this.sections = this.sections.filter(
        (s: any) =>
          parseInt(s.minPenalty) >= parseInt(this.filterSectionMinPenalty)
      );
    } else if (this.filterSectionMaxPenalty && !this.filterSectionMinPenalty) {
      this.sections = this.sections.filter(
        (s: any) =>
          parseInt(s.maxPenalty) <= parseInt(this.filterSectionMaxPenalty)
      );
    }

    //Filter by vehicleCategory
    if (this.filterSectionVehicleCategory) {
      this.sections = this.sections.filter(
        (s: any) => s.vehicleCategoryId === this.filterSectionVehicleCategory.id
      );
    }
  }

  viewStatueInfo(statue: any) {
    this.chosenStatue = statue;

    this.isUpdatingChosenStatue = false;
    this.tmpChosenStatue = JSON.parse(JSON.stringify(this.chosenStatue));
  }

  viewSectionInfo(section: any) {
    this.chosenSection = section;

    this.isUpdatingChosenSection = false;
    this.tmpChosenSection = JSON.parse(JSON.stringify(this.chosenSection));

    // this.newChosenSectionDesc = undefined;

    // this.selectedChosenSectionVehicleCatId =
    //   this.chosenSection.vehicleCategoryId;
    // this.tmpChosenSection.vehicleCategoryId =
    //   this.selectedChosenSectionVehicleCatId;

    // this.newChosenSectionMinPenalty = undefined;
    // this.newChosenSectionMaxPenalty = undefined;
    this.clearChosenSectionData();
  }

  selectStatue() { //when first select a statue or select for changing a statue
    this.chosenStatue = undefined;
    this.isUpdatingChosenSection = false;

    if (this.selectedStatue) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSectionsByStatueId + '/' + this.selectedStatue?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.chosenSection = undefined;
            this.sections = response.data;
            this.tmpSections = response.data;
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

  selectSection() { //when first select a section or select for changing a section
    this.chosenSection = undefined;
    this.isUpdatingChosenParagraph = false;

    if (this.selectedSection) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId + '/' + this.selectedSection?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.paragraphs = response.data;
            console.log(this.paragraphs);
            this.tmpParagraphs = response.data;
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

  clearStatue() {
    //clear statue
    this.selectedStatue = undefined;
    this.chosenStatue = undefined;
    this.isUpdatingChosenStatue = false;

    this.clearSection();
  }

  clearSection(){
    //clear section
    this.selectedSection = undefined;
    this.chosenSection = undefined;
    this.isUpdatingChosenSection = false;
  }

  returnToManegeStatues(){
    this.clearStatue();
  }

  goToManageSectionsOfChosenStatue(){
    this.selectedStatue = this.chosenStatue;
    this.selectStatue();
  }

  openUpdateChosenSection() {
    this.isUpdatingChosenSection = true;
    this.tmpChosenSection = JSON.parse(JSON.stringify(this.chosenSection));

    this.newChosenSectionDesc = this.tmpChosenSection.description;
    this.selectedChosenSectionVehicleCatId =
      this.tmpChosenSection.vehicleCategoryId;
    this.newChosenSectionMinPenalty = this.tmpChosenSection.minPenalty;
    this.newChosenSectionMaxPenalty = this.tmpChosenSection.maxPenalty;
  }

  openUpdateChosenStatue() {
    this.isUpdatingChosenStatue = true;
    this.tmpChosenStatue = JSON.parse(JSON.stringify(this.chosenStatue));

    this.newChosenStatueDesc = this.tmpChosenStatue.description;
  }

  getUpdatedSectionDescription(event: any) {
    let newDesc = event.target.value;
    if (newDesc !== '') {
      this.invalidChosenSectionNewDesc = false;
      this.tmpChosenSection.desc = newDesc;
    } else {
      this.invalidChosenSectionNewDesc = true;
    }
    this.detectChangeSection();
  }

  getUpdatedStatueDescription(event: any) {
    let newDesc = event.target.value;
    if (newDesc !== '') {
      this.invalidChosenStatueNewDesc = false;
      this.tmpChosenStatue.desc = newDesc;
    } else {
      this.invalidChosenStatueNewDesc = true;
    }
    this.detectChangeStatue();
  }

  changeChosenSectionVehicleCat() {
    this.tmpChosenSection.vehicleCategoryId =
      this.selectedChosenSectionVehicleCatId;
    this.detectChangeSection();
  }

  checkChosenSectionNewMinPenalty(event: any) {
    if (event.value) {
      this.newChosenSectionMinPenalty = event.value;
      this.tmpChosenSection.minPenalty = this.newChosenSectionMinPenalty;
    }

    if (
      this.newChosenSectionMinPenalty &&
      this.newChosenSectionMaxPenalty &&
      this.newChosenSectionMinPenalty >= this.newChosenSectionMaxPenalty
    ) {
      this.invalidChosenSectionNewPenaltyMsg =
        'Vui lòng nhập mức phạt tối thiểu nhỏ hơn mức phạt tối đa';
    } else {
      this.invalidChosenSectionNewPenaltyMsg = '';
    }
    this.detectChangeSection();
  }

  checkChosenSectionNewMaxPenalty(event: any) {
    if (event.value) {
      this.newChosenSectionMaxPenalty = event.value;
      this.tmpChosenSection.maxPenalty = this.newChosenSectionMaxPenalty;
    }
    if (
      this.newChosenSectionMinPenalty &&
      this.newChosenSectionMaxPenalty &&
      this.newChosenSectionMaxPenalty <= this.newChosenSectionMinPenalty
    ) {
      this.invalidChosenSectionNewPenaltyMsg =
        'Vui lòng nhập mức phạt tối đa lớn hơn mức phạt tối thiểu';
    } else {
      this.invalidChosenSectionNewPenaltyMsg = '';
    }
    this.detectChangeSection();
  }

  detectChangeStatue() {
    if (
      JSON.stringify(this.chosenStatue) !==
        JSON.stringify(this.tmpChosenStatue) &&
      !this.invalidChosenStatueNewDesc
    ) {
      this.isValidUpdatingStatue = true;
    } else {
      this.isValidUpdatingStatue = false;
    }
  }

  detectChangeSection() {
    if (
      JSON.stringify(this.chosenSection) !==
        JSON.stringify(this.tmpChosenSection) &&
      !this.invalidChosenSectionNewDesc &&
      !this.invalidChosenSectionNewPenaltyMsg
    ) {
      this.isValidUpdatingSection = true;
    } else {
      this.isValidUpdatingSection = false;
    }
  }

  clearChosenSectionData() {
    this.newChosenSectionDesc = undefined;

    this.selectedChosenSectionVehicleCatId =
      this.chosenSection.vehicleCategoryId;
    this.tmpChosenSection.vehicleCategoryId =
      this.selectedChosenSectionVehicleCatId;

    this.newChosenSectionMinPenalty = undefined;
    this.newChosenSectionMaxPenalty = undefined;

    this.invalidChosenStatueNewDesc = false;
    this.isValidUpdatingStatue = false;
    this.invalidChosenSectionNewPenaltyMsg = undefined;
  }

  clearChosenStatueData() {
    this.newChosenStatueDesc = undefined;
    this.invalidChosenStatueNewDesc = false;
    this.isValidUpdatingStatue = false;
  }

  cancelUpdateChosenStatue() {
    this.isUpdatingChosenStatue = false;
    this.clearChosenStatueData();

    this.detectChangeStatue();
  }

  cancelUpdateChosenSection() {
    this.isUpdatingChosenSection = false;
    this.clearChosenSectionData();

    this.detectChangeSection();
  }

  updateChosenStatue() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateStatueForROM,
      {
        name: this.tmpChosenStatue.name,
        columnId: this.subMenuSelectedColumnId,
        description: this.newChosenStatueDesc,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingStatueId: response.data?.id,
              modifiedStatueId: this.chosenStatue.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmUpdateStatueDialog = false;
                this.isUpdatingChosenStatue = false;
                this.clearChosenStatueData();
                this.messageService.add({
                  key: 'updateStatueSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmUpdateStatueDialog = false;
                this.messageService.add({
                  key: 'updateStatueError',
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
          this.displayConfirmUpdateStatueDialog = false;
          this.messageService.add({
            key: 'updateStatueError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  updateChosenSection() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateSectionForROM,
      {
        name: this.tmpChosenSection.name,
        vehicleCategoryId: this.selectedChosenSectionVehicleCatId,
        statueId: this.selectedStatue.id,
        description: this.newChosenSectionDesc,
        minPenalty: this.newChosenSectionMinPenalty,
        maxPenalty: this.newChosenSectionMaxPenalty,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingSectionId: response.data?.id,
              modifiedSectionId: this.chosenSection.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmUpdateSectionDialog = false;
                this.isUpdatingChosenSection = false;
                this.clearChosenSectionData();
                this.messageService.add({
                  key: 'updateSectionSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmUpdateSectionDialog = false;
                this.messageService.add({
                  key: 'updateSectionError',
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
          this.displayConfirmUpdateSectionDialog = false;
          this.messageService.add({
            key: 'updateSectionError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  deleteChosenStatue() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateStatueForROM,
      {
        name: this.chosenStatue.name,
        columnId: this.subMenuSelectedColumnId,
        description: this.chosenStatue.description,
        isDeleted: true,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingStatueId: response.data?.id,
              modifiedStatueId: this.chosenStatue.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmDeleteStatueDialog = false;
                this.isUpdatingChosenStatue = false;
                this.clearChosenStatueData();
                this.messageService.add({
                  key: 'deleteStatueSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmDeleteStatueDialog = false;
                this.messageService.add({
                  key: 'deleteStatueError',
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
          this.displayConfirmDeleteStatueDialog = false;
          this.messageService.add({
            key: 'deleteStatueError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  deleteChosenSection() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateSectionForROM,
      {
        name: this.chosenSection.name,
        vehicleCategoryId: this.selectedChosenSectionVehicleCatId,
        statueId: this.selectedStatue.id,
        description: this.chosenSection.description,
        minPenalty: this.chosenSection.minPenalty,
        maxPenalty: this.chosenSection.maxPenalty,
        isDeleted: true,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingSectionId: response.data?.id,
              modifiedSectionId: this.chosenSection.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmDeleteSectionDialog = false;
                this.isUpdatingChosenSection = false;
                this.clearChosenSectionData();
                this.messageService.add({
                  key: 'deleteSectionSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmDeleteSectionDialog = false;
                this.messageService.add({
                  key: 'deleteSectionError',
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
          this.displayConfirmDeleteSectionDialog = false;
          this.messageService.add({
            key: 'deleteSectionError',
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
