import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { ActivatedRoute } from '@angular/router';

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
  selectedParagraph: any;
  chosenParagraph: any;
  tmpChosenParagraph: any;
  isUpdatingChosenParagraph: boolean = false;

  isCollapsedChosenParagraph: boolean = false;

  searchParagraphStr = '';

  // used for updating chosen paragraph -> collect data to create new paragraph and ROM
  newChosenParagraphDesc: any;
  invalidChosenParagraphNewDesc: boolean = false;
  newChosenParagraphReferenceList: any;
  newChosenParagraphAdditionalPenalty: any;

  isValidUpdatingParagraph: boolean = false;

  displayAddChosenParagraphReference: boolean = false;

  addingChosenParagraphStatueList: any;
  addingChosenParagraphStatue: any;
  addingChosenParagraphSectionList: any;
  addingChosenParagraphSection: any;
  addingChosenParagraphParagraphList: any;
  addingChosenParagraphParagraph: any;
  emptyParagraphSectionMsg: any;

  tmpChosenParagraphAddingReferenceList: any[] = []; //used for displaying newly added included reference paragraphs in dialog
  addingErrorChosenParagraphAddingReferenceListReferenceMsg: any;
  isUpdatingChosenParagraphReferenceIncludedList: boolean = false;
  isUpdatingChosenParagraphReferenceExcludedList: boolean = false;
  //end of paragraph

  vehicleCats: any;
  selectedVehicleCat: any;

  admins: any;
  selectedAdmin: any;

  displayConfirmUpdateStatueDialog: boolean = false;
  displayConfirmDeleteStatueDialog: boolean = false;

  displayConfirmUpdateSectionDialog: boolean = false;
  displayConfirmDeleteSectionDialog: boolean = false;

  displayConfirmUpdateParagraphDialog: boolean = false;
  displayConfirmDeleteParagraphDialog: boolean = false;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private messageService: MessageService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.clearStatue();
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
    this.invalidFilterSectionMinPenalty = false;
    this.invalidFilterSectionMaxPenalty = false;
    this.invalidFilterSectionMaxPenaltyMsg = '';

    if (
      this.filterSectionMinPenalty &&
      this.filterSectionMaxPenalty &&
      this.filterSectionMinPenalty >= this.filterSectionMaxPenalty
    ) {
      this.invalidFilterSectionMinPenalty = true;
      this.invalidFilterSectionMinPenaltyMsg =
        'Vui lòng nhập mức phạt tối thiểu nhỏ hơn mức phạt tối đa';
    }
    this.filterSectionData();
  }

  checkFilterSectionMaxPenalty(event: any) {
    this.filterSectionMaxPenalty = event.value;
    this.invalidFilterSectionMinPenalty = false;
    this.invalidFilterSectionMaxPenalty = false;
    this.invalidFilterSectionMaxPenaltyMsg = '';

    if (
      this.filterSectionMinPenalty &&
      this.filterSectionMaxPenalty &&
      this.filterSectionMaxPenalty <= this.filterSectionMinPenalty
    ) {
      this.invalidFilterSectionMaxPenalty = true;
      this.invalidFilterSectionMaxPenaltyMsg =
        'Vui lòng nhập mức phạt tối đa lớn hơn mức phạt tối thiểu';
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

    if (this.filterSectionMinPenalty && this.filterSectionMaxPenalty) {
      this.sections = this.sections.filter(
        (s: any) =>
          parseInt(s.minPenalty) >= parseInt(this.filterSectionMinPenalty) &&
          parseInt(s.maxPenalty) <= parseInt(this.filterSectionMaxPenalty)
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

  filterParagraphData() {
    this.paragraphs = this.tmpParagraphs;

    //Search
    if (this.searchParagraphStr != '') {
      this.paragraphs = this.paragraphs.filter(
        (p: any) =>
          p.name
            ?.toLowerCase()
            .includes(this.searchParagraphStr.toLowerCase()) ||
          p.description
            ?.toLowerCase()
            .includes(this.searchParagraphStr.toLowerCase())
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

    this.clearChosenSectionData();
  }

  viewParagraphInfo(paragraph: any) {
    this.chosenParagraph = paragraph;

    this.isUpdatingChosenParagraph = false;
    this.tmpChosenParagraph = JSON.parse(JSON.stringify(this.chosenParagraph));

    this.clearChosenParagraphData();
  }

  selectStatue() {
    //when first select a statue or select for changing a statue
    this.chosenStatue = undefined;
    this.chosenSection = undefined;
    this.chosenParagraph = undefined;

    this.selectedSection = undefined;

    this.isUpdatingChosenSection = false;
    this.isUpdatingChosenParagraph = false;

    if (this.selectedStatue) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSectionsByStatueId + '/' + this.selectedStatue?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
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

  selectSection() {
    //when first select a section or select for changing a section
    this.chosenSection = undefined;
    this.chosenParagraph = undefined;
    this.isUpdatingChosenSection = false;
    this.isUpdatingChosenParagraph = false;

    if (this.selectedSection) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId + '/' + this.selectedSection?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.paragraphs = response.data;
            this.paragraphs.forEach((p: any) => {
              p.referenceParagraphs.forEach((r: any) => {
                if (r.referenceParagraphIsExcluded) {
                  p.hasExcluded = true;
                }
                if (!r.referenceParagraphIsExcluded) {
                  p.hasIncluded = true;
                }
              });
            });
            this.tmpParagraphs = JSON.parse(JSON.stringify(this.paragraphs));

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
    this.selectedStatue = undefined;
    this.chosenStatue = undefined;
    this.isUpdatingChosenStatue = false;

    this.clearSection();
  }

  clearSection() {
    this.selectedSection = undefined;
    this.chosenSection = undefined;
    this.isUpdatingChosenSection = false;

    this.clearParagraph();
  }

  clearParagraph() {
    this.chosenParagraph = undefined;
    this.isUpdatingChosenParagraph = false;
  }

  returnToManegeStatues() {
    this.clearStatue();
  }

  returnToManegeSections() {
    this.clearSection();
  }

  goToManageSectionsOfChosenStatue() {
    this.selectedStatue = this.chosenStatue;
    this.selectStatue();
  }

  goToManageParagraphsOfChosenSection() {
    this.selectedSection = this.chosenSection;
    this.selectSection();
  }

  openUpdateChosenStatue() {
    this.isUpdatingChosenStatue = true;
    this.isValidUpdatingStatue = false;
    this.tmpChosenStatue = JSON.parse(JSON.stringify(this.chosenStatue));

    this.newChosenStatueDesc = this.tmpChosenStatue.description;
  }

  openUpdateChosenSection() {
    this.isUpdatingChosenSection = true;
    this.isValidUpdatingSection = false;
    this.tmpChosenSection = JSON.parse(JSON.stringify(this.chosenSection));

    this.newChosenSectionDesc = this.tmpChosenSection.description;
    this.selectedChosenSectionVehicleCatId =
      this.tmpChosenSection.vehicleCategoryId;
    this.newChosenSectionMinPenalty = this.tmpChosenSection.minPenalty;
    this.newChosenSectionMaxPenalty = this.tmpChosenSection.maxPenalty;
  }

  openUpdateChosenParagraph() {
    this.isUpdatingChosenParagraph = true;
    this.isValidUpdatingParagraph = false;
    this.tmpChosenParagraph = JSON.parse(JSON.stringify(this.chosenParagraph));

    //Set default value for each field of new data for chosen paragraph
    this.newChosenParagraphDesc = this.tmpChosenParagraph.description;
    this.newChosenParagraphReferenceList =
      this.tmpChosenParagraph.referenceParagraphs;
    this.newChosenParagraphAdditionalPenalty =
      this.tmpChosenParagraph.additionalPenalty;
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

  getUpdatedParagraphDescription(event: any) {
    let newDesc = event.target.value;
    if (newDesc !== '') {
      this.invalidChosenParagraphNewDesc = false;
      this.tmpChosenParagraph.description = newDesc;
    } else {
      this.invalidChosenParagraphNewDesc = true;
    }
    this.detectChangeParagraph();
  }

  getUpdatedParagraphAdditionalPenalty(event: any) {
    this.tmpChosenParagraph.additionalPenalty = event.target.value;
    this.detectChangeParagraph();
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

  detectChangeParagraph() {
    if (
      JSON.stringify(this.chosenParagraph) !==
        JSON.stringify(this.tmpChosenParagraph) &&
      !this.invalidChosenParagraphNewDesc
    ) {
      this.isValidUpdatingParagraph = true;
    } else {
      this.isValidUpdatingParagraph = false;
    }
  }

  clearChosenStatueData() {
    this.newChosenStatueDesc = undefined;
    this.invalidChosenStatueNewDesc = false;

    this.isValidUpdatingStatue = false;
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
    this.invalidChosenSectionNewPenaltyMsg = undefined;
    this.isValidUpdatingStatue = false;
    this.isValidUpdatingSection = false;
  }

  clearChosenParagraphData() {
    this.newChosenParagraphDesc = undefined;
    this.newChosenParagraphReferenceList = undefined;
    this.newChosenParagraphAdditionalPenalty = undefined;

    // this.tmpChosenParagraphAddingReferenceList = [];
    // this.addingErrorChosenParagraphAddingReferenceListReferenceMsg = undefined;
    this.tmpChosenParagraph.referenceParagraphs =
      this.chosenParagraph.referenceParagraphs;

    this.invalidChosenParagraphNewDesc = false;

    this.isValidUpdatingStatue = false;
    this.isValidUpdatingSection = false;
    this.isValidUpdatingParagraph = false;
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

  cancelUpdateChosenParagraph() {
    this.isUpdatingChosenParagraph = false;
    this.clearChosenParagraphData();

    this.detectChangeParagraph();
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
                  key: 'updateSuccess',
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
                  key: 'updateError',
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
            key: 'updateError',
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
                  key: 'updateSuccess',
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
                  key: 'updateError',
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
            key: 'updateError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  updateChosenParagraph() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateParagraphForROM,
      this.tmpChosenParagraph,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingParagraphId: response.data?.id,
              modifiedParagraphId: this.chosenParagraph.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmUpdateParagraphDialog = false;
                this.isUpdatingChosenParagraph = false;
                this.clearChosenParagraphData();
                this.messageService.add({
                  key: 'updateSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmUpdateParagraphDialog = false;
                this.messageService.add({
                  key: 'updateError',
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
          this.displayConfirmUpdateParagraphDialog = false;
          this.messageService.add({
            key: 'updateError',
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
                  key: 'deleteSuccess',
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
                  key: 'deleteError',
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
            key: 'deleteError',
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
                  key: 'deleteSuccess',
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
                  key: 'deleteError',
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
            key: 'deleteError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  deleteChosenParagraph() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateParagraphForROM,
      {
        sectionId: this.chosenParagraph.sectionId,
        name: this.chosenParagraph.name,
        description: this.chosenParagraph.description,
        additionalPenalty: this.chosenParagraph.additionalPenalty,
        isDeleted: true,
      },
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingParagraphId: response.data?.id,
              modifiedParagraphId: this.chosenParagraph.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayConfirmDeleteParagraphDialog = false;
                this.isUpdatingChosenParagraph = false;
                this.clearChosenParagraphData();
                this.messageService.add({
                  key: 'deleteSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayConfirmDeleteParagraphDialog = false;
                this.messageService.add({
                  key: 'deleteError',
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
          this.displayConfirmDeleteParagraphDialog = false;
          this.messageService.add({
            key: 'deleteError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  //Remove chosen paragraph reference from referenc list in updating screen
  removeChosenParagraphReferenceParagraphs(reference: any) {
    this.newChosenParagraphReferenceList =
      this.newChosenParagraphReferenceList.filter(
        (r: any) => r.referenceParagraphId !== reference.referenceParagraphId
      );

    this.tmpChosenParagraph.referenceParagraphs =
      this.newChosenParagraphReferenceList;

    this.detectChangeParagraph();
  }

  // start of adding chosen paragraph reference
  loadAddingChosenParagraphStatueList() {
    this.displayAddChosenParagraphReference = true;
    this.addingChosenParagraphStatueList = JSON.parse(
      JSON.stringify(this.tmpStatues)
    );
  }

  selectAddingChosenParagraphStatue(event: any) {
    this.addingChosenParagraphSection = undefined;
    this.addingChosenParagraphParagraph = undefined;

    this.addingChosenParagraphStatue = event.value;

    if (this.addingChosenParagraphStatue) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetSectionsByStatueId +
          '/' +
          this.addingChosenParagraphStatue?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.addingChosenParagraphSectionList = response.data;
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

  selectAddingChosenParagraphSection(event: any) {
    this.addingChosenParagraphParagraph = undefined;

    this.addingChosenParagraphSection = event.value;

    if (this.addingChosenParagraphSection) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId +
          '/' +
          this.addingChosenParagraphSection?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            //This section has an empty paragraph
            if (response.data.length === 1 && response.data[0].name === '') {
              this.emptyParagraphSectionMsg = 'Khoản này không chứa điểm';
            } else {
              this.addingChosenParagraphParagraphList = response.data;

              //Remove current chosen paragraph from the list of reference paragraph that will be added
              this.addingChosenParagraphParagraphList.forEach(
                (r: any, i: number) => {
                  this.addingChosenParagraphParagraphList =
                    this.addingChosenParagraphParagraphList.filter(
                      (r: any) => r.id !== this.chosenParagraph.id
                    );
                }
              );

              //Remove added reference paragraphs from the list of reference paragraph that will be added
              this.newChosenParagraphReferenceList.forEach((addedRef: any) => {
                this.addingChosenParagraphParagraphList =
                  this.addingChosenParagraphParagraphList.filter(
                    (r: any) => r.id !== addedRef.referenceParagraphId
                  );
              });

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

  selectAddingChosenParagraphParagraph(event: any) {
    this.addingChosenParagraphParagraph = event.value;
  }

  // "Hủy" button clicked or dialog onHide
  clearAddChosenParagraphReference() {
    this.displayAddChosenParagraphReference = false;

    this.isUpdatingChosenParagraphReferenceIncludedList = false;
    this.isUpdatingChosenParagraphReferenceExcludedList = false;

    this.addingChosenParagraphStatueList = undefined;
    this.addingChosenParagraphStatue = null;
    this.addingChosenParagraphSectionList = undefined;
    this.addingChosenParagraphSection = undefined;
    this.addingChosenParagraphParagraphList = undefined;
    this.addingChosenParagraphParagraph = undefined;
    this.emptyParagraphSectionMsg = undefined;
    this.tmpChosenParagraphAddingReferenceList = [];
    this.addingErrorChosenParagraphAddingReferenceListReferenceMsg = undefined;
  }

  //"Lưu lại" button clicked
  addChosenParagraphIncludedReference() {
    if (
      !this.addingChosenParagraphParagraph ||
      !this.addingChosenParagraphSection ||
      !this.addingChosenParagraphStatue
    ) {
      this.addingErrorChosenParagraphAddingReferenceListReferenceMsg =
        'Vui lòng chọn điều, khoản, điểm trước khi lưu lại';
      return;
    } else {
      this.addingErrorChosenParagraphAddingReferenceListReferenceMsg = '';
    }

    let reference = {
      referenceParagraphId: this.addingChosenParagraphParagraph.id,
      referenceParagraphName: this.addingChosenParagraphParagraph.name,
      referenceParagraphDesc: this.addingChosenParagraphParagraph.description,

      referenceParagraphSectionId: this.addingChosenParagraphSection.id,
      referenceParagraphSectionName: this.addingChosenParagraphSection.name,

      referenceParagraphSectionStatueId: this.addingChosenParagraphStatue.id,
      referenceParagraphSectionStatueName:
        this.addingChosenParagraphStatue.name,
      referenceParagraphIsExcluded: this
        .isUpdatingChosenParagraphReferenceExcludedList
        ? true
        : false,
    };

    var existed = false;

    //check with original reference list before adding
    this.tmpChosenParagraph.referenceParagraphs.forEach((r: any) => {
      if (
        r.referenceParagraphId == reference.referenceParagraphId &&
        r.referenceParagraphSectionId ==
          reference.referenceParagraphSectionId &&
        r.referenceParagraphSectionStatueId ==
          reference.referenceParagraphSectionStatueId
      ) {
        this.addingErrorChosenParagraphAddingReferenceListReferenceMsg =
          'Điểm đã tồn tại trong danh sách';
      } else {
        //check with temporary reference list before adding
        existed = this.tmpChosenParagraphAddingReferenceList.some((r: any) => {
          if (
            r.referenceParagraphId == reference.referenceParagraphId &&
            r.referenceParagraphSectionId ==
              reference.referenceParagraphSectionId &&
            r.referenceParagraphSectionStatueId ==
              reference.referenceParagraphSectionStatueId
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
    });

    if (this.tmpChosenParagraphAddingReferenceList.length === 0 || !existed) {
      this.tmpChosenParagraphAddingReferenceList.push(reference);
      this.addingErrorChosenParagraphAddingReferenceListReferenceMsg = '';
    } else {
      this.addingErrorChosenParagraphAddingReferenceListReferenceMsg =
        'Điểm đã tồn tại trong danh sách';
    }
  }

  removeChosenParagraphIncludedReference(i: any) {
    this.tmpChosenParagraphAddingReferenceList.splice(i, 1);
    this.addingErrorChosenParagraphAddingReferenceListReferenceMsg = '';
  }

  //"Hoàn thành" button clicked
  completeAddChosenParagraphIncludedReference() {
    this.tmpChosenParagraphAddingReferenceList.forEach((r: any) => {
      this.newChosenParagraphReferenceList.push(r);
    });
    this.tmpChosenParagraph.referenceParagraphs =
      this.newChosenParagraphReferenceList;
    this.displayAddChosenParagraphReference = false;

    this.detectChangeParagraph();
  }
  // end of adding chosen paragraph reference
}
