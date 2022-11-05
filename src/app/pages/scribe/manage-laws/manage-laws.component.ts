import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { ActivatedRoute } from '@angular/router';
import * as vietnameseAlphabet from '../../../../assets/i18n/vietnameseAlphabet.json';
import { NewSectionDTO, NewParagraphDTO } from 'src/app/models/General.model';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { NotificationService } from 'src/services/notification.service';
import { SubjectType } from 'src/app/common/subjectType';
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

  //Start of add new law
  displayAddNewLawDialog: boolean = false;
  isShowingStatueDialog: boolean = false;
  isShowingSectionDialog: boolean = false;
  isShowingParagraphDialog: boolean = false;

  statueListForAddNewLaw: any;
  selectedStatueForAddNewLaw: any;

  selectedSectionForAddNewLaw: any;

  isCollapsedCreatNewSection: boolean = false;

  newSection: any;
  isValidNewSectionMinPenalty: boolean = true;
  isValidNewSectionMaxPenalty: boolean = true;
  newSectionPenaltyInvalidMsg = '';
  newSectionDescriptionInvalidMsg = '';
  isValidGoNextOnSectionDialog: boolean = true;
  isValidFinishOnSectionDialog: boolean = false;
  isAddedNewSection: boolean = false;

  isUpdatingNewSection: boolean = false;
  isValidGobackToStatue: boolean = true;

  displayConfirmDeleteNewSection: boolean = false;

  //start of section with no paragraph
  isSectionWithNoParagraph: boolean = false;
  newSectionWithNoParagraphReferenceStatueList: any;
  newSectionWithNoParagraphReferenceSelectedStatue: any;
  newSectionWithNoParagraphReferenceSectionList: any;
  newSectionWithNoParagraphReferenceSelectedSection: any;
  newSectionWithNoParagraphReferenceParagraphList: any;
  newSectionWithNoParagraphReferenceSelectedParagraph: any;

  tmpReferenceNewSectionWithNoParagraph: any;
  tmpReferenceNewSectionWithNoParagraphIsExcluded: any;
  tmpReferenceListOfNewSectionWithNoParagraph: any[] = [];
  isValidAddReferenceToNewSectionWithNoParagraph: boolean = true;
  //end of section with no paragraph

  //start of new paragraph
  newParagraphListOfSelectedSection: any[] = [];
  newParagraphOfSelectedSection: any;
  newParagraphOfSelectedSectionDescription: any;
  newParagraphOfSelectedSectionAdditionalPenalty: any;
  newParagraphDescriptionInvalidMsg: any;
  newParagraphAdditionalPenaltyInvalidMsg: any;
  isValidSaveNewParagraph: boolean = false;

  newParagraphReferenceStatueList: any;
  newParagraphReferenceSelectedStatue: any;
  newParagraphReferenceSectionList: any;
  newParagraphReferenceSelectedSection: any;
  newParagraphReferenceParagraphList: any;
  newParagraphReferenceSelectedParagraph: any;

  tmpReferenceListOfNewParagraph: any[] = [];
  tmpReferenceOfNewParagraph: any;
  tmpReferenceOfNewParagraphIsExcluded: any;
  isValidAddReferenceToNewParagraph: boolean = true;

  newParagraphKeywordList: any;
  newParagraphSelectedKeyword: any;

  existedParagraphCountOfSelectedSection: any;

  isUpdatingNewParagraph: boolean = false;
  updatingParagraphIndex: any;
  deletingParagraphIndex: any;
  displayConfirmDeleteNewParagraphInNewParagraphList: boolean = false;
  isValidGobackToSection: boolean = true;
  isValidDisplayFinishAndSaveOnParagraphDialog: boolean = true;

  isShowingConfirmAddNewLaw: boolean = false;
  //end of new paragraph

  //start of add new paragraph from paragraph screen
  displayAddNewParagraphDialog: boolean = false;
  //end of add new paragraph from paragraph screen

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private messageService: MessageService,
    public activatedRoute: ActivatedRoute,
    private notiService: NotificationService
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
        decodeToken(getStorageToken() || '')?.Id,
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

                //Set default value for statue dropdown of add new from statue screen
                this.statueListForAddNewLaw = JSON.parse(
                  JSON.stringify(this.statues)
                );
                this.selectedStatueForAddNewLaw =
                  this.statueListForAddNewLaw[0];

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
    if (this.searchStatueStr && this.searchStatueStr.trim() != '') {
      this.statues = this.statues.filter(
        (s: any) =>
          toNonAccentVietnamese(s.name?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchStatueStr.toLowerCase())
          ) ||
          toNonAccentVietnamese(s.description?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchStatueStr.toLowerCase())
          )
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
    if (this.searchSectionStr && this.searchSectionStr.trim() != '') {
      this.sections = this.sections.filter(
        (s: any) =>
          toNonAccentVietnamese(s.name?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchSectionStr.toLowerCase())
          ) ||
          toNonAccentVietnamese(s.description?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchSectionStr.toLowerCase())
          )
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
    if (this.searchParagraphStr && this.searchParagraphStr.trim() != '') {
      this.paragraphs = this.paragraphs.filter(
        (p: any) =>
          toNonAccentVietnamese(p.name?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchParagraphStr.toLowerCase())
          ) ||
          toNonAccentVietnamese(p.description?.toLowerCase()).includes(
            toNonAccentVietnamese(this.searchParagraphStr.toLowerCase())
          )
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
    // if selected an empty paragraph of section with no paragraph, then disabled invalid new paragraph description
    if (
      this.tmpChosenParagraph?.name === '' &&
      this.tmpChosenParagraph?.description === ''
    ) {
      this.invalidChosenParagraphNewDesc = false;
    }

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
    if (newDesc?.trim() !== '' && newDesc?.length <= 2000) {
      this.invalidChosenSectionNewDesc = false;
      this.tmpChosenSection.desc = newDesc;
    } else {
      this.invalidChosenSectionNewDesc = true;
    }
    this.detectChangeSection();
  }

  getUpdatedStatueDescription(event: any) {
    let newDesc = event.target.value;
    if (newDesc?.trim() !== '' && newDesc?.length <= 2000) {
      this.invalidChosenStatueNewDesc = false;
      this.tmpChosenStatue.desc = newDesc;
    } else {
      this.invalidChosenStatueNewDesc = true;
    }
    this.detectChangeStatue();
  }

  getUpdatedParagraphDescription(event: any) {
    let newDesc = event.target.value;
    if (newDesc.trim() !== '' && newDesc?.length < 2000) {
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
    }

    if (
      this.newChosenSectionMinPenalty < 50000 ||
      this.newChosenSectionMinPenalty > 75000000 ||
      this.newChosenSectionMinPenalty > this.newChosenSectionMaxPenalty
    ) {
      this.invalidChosenSectionNewPenaltyMsg =
        'Vui lòng nhập mức phạt tối thiểu nhỏ hơn mức phạt tối đa (50.000đ - 75.000.000đ)';
      this.tmpChosenSection.minPenalty = undefined;
    } else {
      this.invalidChosenSectionNewPenaltyMsg = '';
      this.tmpChosenSection.minPenalty = this.newChosenSectionMinPenalty;
    }
    this.detectChangeSection();
  }

  checkChosenSectionNewMaxPenalty(event: any) {
    if (event.value) {
      this.newChosenSectionMaxPenalty = event.value;
    }
    if (
      this.newChosenSectionMinPenalty < 50000 ||
      this.newChosenSectionMinPenalty > 75000000 ||
      this.newChosenSectionMaxPenalty < this.newChosenSectionMinPenalty
    ) {
      this.invalidChosenSectionNewPenaltyMsg =
        'Vui lòng nhập mức phạt tối đa lớn hơn mức phạt tối thiểu (50.000đ - 75.000.000đ)';
      this.tmpChosenSection.maxPenalty = undefined;
    } else {
      this.invalidChosenSectionNewPenaltyMsg = '';
      this.tmpChosenSection.maxPenalty = this.newChosenSectionMaxPenalty;
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
    // console.log(this.tmpChosenSection);

    if (
      JSON.stringify(this.chosenSection) !==
        JSON.stringify(this.tmpChosenSection) &&
      !this.invalidChosenSectionNewDesc &&
      !this.invalidChosenSectionNewPenaltyMsg &&
      this.tmpChosenSection?.minPenalty !== undefined &&
      this.tmpChosenSection?.maxPenalty !== undefined
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

    this.invalidChosenSectionNewDesc = false;
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingStatueId: response1.data?.id,
              modifiedStatueId: this.chosenStatue.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Statue,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestUpdate,
                  relatedDescription: this.chosenStatue?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmUpdateStatueDialog = false;
                this.isUpdatingChosenStatue = false;
                this.clearChosenStatueData();
                this.loadAdmins();
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingSectionId: response1.data?.id,
              modifiedSectionId: this.chosenSection.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Section,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestUpdate,
                  relatedDescription: this.chosenSection?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmUpdateSectionDialog = false;
                this.isUpdatingChosenSection = false;
                this.clearChosenSectionData();
                this.loadAdmins();
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingParagraphId: response1.data?.id,
              modifiedParagraphId: this.chosenParagraph.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Paragraph,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestUpdate,
                  relatedDescription: this.chosenParagraph?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmUpdateParagraphDialog = false;
                this.isUpdatingChosenParagraph = false;
                this.clearChosenParagraphData();
                this.loadAdmins();
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingStatueId: response1.data?.id,
              modifiedStatueId: this.chosenStatue.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                console.log(response2);

                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Statue,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestDelete,
                  relatedDescription: this.chosenStatue?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmDeleteStatueDialog = false;
                this.isUpdatingChosenStatue = false;
                this.clearChosenStatueData();
                this.loadAdmins();
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingSectionId: response1.data?.id,
              modifiedSectionId: this.chosenSection.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Section,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestDelete,
                  relatedDescription: this.chosenSection?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmDeleteSectionDialog = false;
                this.isUpdatingChosenSection = false;
                this.clearChosenSectionData();
                this.loadAdmins();
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
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateLawModificationRequest,
            {
              modifyingParagraphId: response1.data?.id,
              modifiedParagraphId: this.chosenParagraph.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.id,
                  subjectType: SubjectType.Paragraph,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestDelete,
                  relatedDescription: this.chosenParagraph?.name,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayConfirmDeleteParagraphDialog = false;
                this.isUpdatingChosenParagraph = false;
                this.clearChosenParagraphData();
                this.loadAdmins();
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
    // Modify to get all statue instead of get only the statues that this scribe manages

    // this.addingChosenParagraphStatueList = JSON.parse(
    //   JSON.stringify(this.tmpStatues)
    // );

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAllStatueForAddingReferences,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.addingChosenParagraphStatueList = response.data.sort(
            (s1: any, s2: any) =>
              s1.name?.split(' ')[1] - s2.name?.split(' ')[1]
          );
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
          //backup if error
          this.addingChosenParagraphStatueList = JSON.parse(
            JSON.stringify(this.tmpStatues)
          );
        },
      }
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
              if(this.newChosenParagraphReferenceList){
                this.newChosenParagraphReferenceList.forEach((addedRef: any) => {
                  this.addingChosenParagraphParagraphList =
                    this.addingChosenParagraphParagraphList.filter(
                      (r: any) => r.id !== addedRef.referenceParagraphId
                    );
                });
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
    if(!this.newChosenParagraphReferenceList){
      this.newChosenParagraphReferenceList = [];
    }
    this.tmpChosenParagraphAddingReferenceList.forEach((r: any) => {
      this.newChosenParagraphReferenceList.push(r);
    });
    this.tmpChosenParagraph.referenceParagraphs =
      this.newChosenParagraphReferenceList;
    this.displayAddChosenParagraphReference = false;

    this.detectChangeParagraph();
  }
  // end of adding chosen paragraph reference

  //start of admin ADD new section
  initValueForNewSection() {
    this.newSection = {};
    if (this.selectedStatueForAddNewLaw?.sections?.length > 0) {
      this.newSection.name =
        'Khoản ' +
        (parseInt(
          JSON.parse(JSON.stringify(this.selectedStatueForAddNewLaw.sections))
            .sort(
              (sc1: any, sc2: any) =>
                parseInt(sc2.name.split(' ')[1]) -
                parseInt(sc1.name.split(' ')[1])
            )[0]
            .name?.split(' ')[1]
        ) +
          Number(1));
    } else {
      this.newSection.name = 'Khoản 1';
    }

    this.newSection.vehicleCategoryId = this.vehicleCats[0]?.id;
  }

  // loadSectionListForSelectedStatueInAddnewDialog() {
  //   if (this.selectedStatueForAddNewLaw.sections?.length === 0) {
  //     this.isLoadingService.add();
  //     this.wrapperService.get(
  //       paths.ScribeGetSectionsByStatueId +
  //         '/' +
  //         this.selectedStatueForAddNewLaw?.id,
  //       getStorageToken(),
  //       {
  //         successCallback: (response) => {
  //           this.selectedStatueForAddNewLaw.sections = response.data;
  //           this.selectedSectionForAddNewLaw =
  //             this.selectedStatueForAddNewLaw.sections[this.selectedStatueForAddNewLaw.sections?.length-1];

  //           //Set init value for new section
  //           this.initValueForNewSection();

  //           this.isLoadingService.remove();
  //         },
  //         errorCallback: (error) => {
  //           console.log(error);
  //           this.isLoadingService.remove();
  //         },
  //       }
  //     );
  //   } else {
  //     this.initValueForNewSection();
  //   }
  // }

  getNewSectionName(event: any) {
    this.newSection.description = event.target.value;
    if (
      this.newSection?.description?.trim() === '' ||
      this.newSection?.description?.length > 2000
    ) {
      this.newSectionDescriptionInvalidMsg =
        'Vui lòng nhập nội dung cho khoản (tối đa 2000 ký tự)';
    } else {
      this.newSectionDescriptionInvalidMsg = '';
    }
  }

  checkNewSectionMinPenalty(event: any) {
    this.newSection.minPenalty = event.value;
    this.isValidNewSectionMinPenalty = true;
    this.isValidNewSectionMaxPenalty = true;
    this.newSectionPenaltyInvalidMsg = '';

    if (
      this.newSection.minPenalty < 50000 ||
      this.newSection.minPenalty > 75000000 ||
      (this.newSection.minPenalty &&
        this.newSection.maxPenalty &&
        this.newSection.minPenalty >= this.newSection.maxPenalty)
    ) {
      this.isValidNewSectionMinPenalty = false;
      this.newSectionPenaltyInvalidMsg =
        'Vui lòng nhập mức phạt tối thiểu nhỏ hơn mức phạt tối đa (50.000đ - 75.000.000đ)';
    }
  }

  checkNewSectionMaxPenalty(event: any) {
    this.newSection.maxPenalty = event.value;
    this.isValidNewSectionMinPenalty = true;
    this.isValidNewSectionMaxPenalty = true;
    this.newSectionPenaltyInvalidMsg = '';

    if (
      this.newSection.maxPenalty < 50000 ||
      this.newSection.maxPenalty > 75000000 ||
      (this.newSection.minPenalty &&
        this.newSection.maxPenalty &&
        this.newSection.maxPenalty <= this.newSection.minPenalty)
    ) {
      this.isValidNewSectionMaxPenalty = false;
      this.newSectionPenaltyInvalidMsg =
        'Vui lòng nhập mức phạt tối đa lớn hơn mức phạt tối thiểu (50.000đ - 75.000.000đ)';
    }
  }

  changeNewSectionVehicleCat(event: any) {
    this.newSection.vehicleCategoryId = event.value;
  }

  //"Hủy" button of add new section clicked
  clearNewSection() {
    this.initValueForNewSection();
    this.isCollapsedCreatNewSection = false;
    this.isValidGoNextOnSectionDialog = true;
    this.isAddedNewSection = false;

    this.isValidNewSectionMinPenalty = true;
    this.isValidNewSectionMaxPenalty = true;
    this.newSectionPenaltyInvalidMsg = '';
    this.newSectionDescriptionInvalidMsg = '';

    this.isValidFinishOnSectionDialog = false;

    //Clear data of new section REFERENCE list
    this.isSectionWithNoParagraph = false;
    this.newSectionWithNoParagraphReferenceStatueList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedStatue = undefined;
    this.newSectionWithNoParagraphReferenceSectionList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedSection = undefined;
    this.newSectionWithNoParagraphReferenceParagraphList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceNewSectionWithNoParagraph = undefined;
    this.tmpReferenceNewSectionWithNoParagraphIsExcluded = undefined;
    this.tmpReferenceListOfNewSectionWithNoParagraph = [];
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;
  }

  //"Thêm" button of add new section clicked
  addNewSectionDataToSectionList() {
    this.isCollapsedCreatNewSection = false;

    this.isAddedNewSection = true;
    if (this.isSectionWithNoParagraph) {
      this.isValidGoNextOnSectionDialog = false;
      this.isValidFinishOnSectionDialog = true;

      this.newSection.isSectionWithNoParagraph = true;
      // if is a section with no paragraph and has reference list
      if (this.tmpReferenceListOfNewSectionWithNoParagraph) {
        this.newSection.referenceParagraphs =
          this.tmpReferenceListOfNewSectionWithNoParagraph.slice();
      }
    } else {
      this.isValidGoNextOnSectionDialog = true;
      this.isValidFinishOnSectionDialog = false;

      this.newSection.isSectionWithNoParagraph = false;
    }
    this.selectedSectionForAddNewLaw = this.newSection;

    this.selectedStatueForAddNewLaw.sections.push(this.newSection);

    // because only add one section at a time, so no need to init value for a second new section
    // this.initValueForNewSection();

    this.isSectionWithNoParagraph = false;
  }

  // start of adding reference for new section with no paragraph
  toggleIsSectionWithNoParagraph(isSectionWithNoParagraph: boolean) {
    if (isSectionWithNoParagraph === true) {
      this.loadStatuesForAddingReferenceOfNewSectionWithNoParagraph();
      if (this.newSection === undefined) {
        this.newSection = {};
        this.newSection.isSectionWithNoParagraph = true;
      }
    } else {
      this.newSection.isSectionWithNoParagraph = false;
    }
  }

  loadStatuesForAddingReferenceOfNewSectionWithNoParagraph() {
    // Modify to get all statue instead of get only the statues that this scribe manages
    // this.newSectionWithNoParagraphReferenceStatueList = JSON.parse(
    //   JSON.stringify(this.statues)
    // );

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAllStatueForAddingReferences,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.newSectionWithNoParagraphReferenceStatueList =
            response.data.sort(
              (s1: any, s2: any) =>
                s1.name?.split(' ')[1] - s2.name?.split(' ')[1]
            );
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
          //backup if error
          this.newSectionWithNoParagraphReferenceStatueList = JSON.parse(
            JSON.stringify(this.tmpStatues)
          );
        },
      }
    );
  }

  selectStatueReferenceForNewSection(event: any) {
    this.newSectionWithNoParagraphReferenceSelectedStatue = event.value;
    this.newSectionWithNoParagraphReferenceSelectedSection = undefined;
    this.newSectionWithNoParagraphReferenceSelectedParagraph = undefined;

    if (this.tmpReferenceNewSectionWithNoParagraph === undefined)
      this.tmpReferenceNewSectionWithNoParagraph = {};
    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphSectionStatueId =
      event.value.id;
    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphSectionStatueName =
      event.value.name;

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetSectionsByStatueId + '/' + event.value.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.newSectionWithNoParagraphReferenceSectionList = response.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  selectSectionReferenceForNewSection(event: any) {
    this.newSectionWithNoParagraphReferenceSelectedSection = event.value;
    this.newSectionWithNoParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphSectionId =
      event.value.id;
    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphSectionName =
      event.value.name;

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetParagraphsBySectionId + '/' + event.value.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.newSectionWithNoParagraphReferenceParagraphList = response.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  selectParagraphReferenceForNewSection(event: any) {
    this.newSectionWithNoParagraphReferenceSelectedParagraph = event.value;

    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphId =
      event.value.id;
    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphName =
      event.value.name;
    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphDescription =
      event.value.description;
  }

  chooseNewSectionWithNoParagraphIncludedExcluded(event: any) {
    if (this.tmpReferenceNewSectionWithNoParagraph === undefined) {
      this.tmpReferenceNewSectionWithNoParagraph = {};
    }

    this.tmpReferenceNewSectionWithNoParagraphIsExcluded = event.value;

    this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphIsExcluded =
      this.tmpReferenceNewSectionWithNoParagraphIsExcluded;
  }

  // "Thêm" button of adding references to new section
  addNewSectionReference() {
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;

    if (
      this.tmpReferenceListOfNewSectionWithNoParagraph &&
      this.tmpReferenceListOfNewSectionWithNoParagraph.length > 0
    ) {
      this.tmpReferenceListOfNewSectionWithNoParagraph.forEach((r: any) => {
        if (
          r.referenceParagraphId ===
          this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphId
        ) {
          this.isValidAddReferenceToNewSectionWithNoParagraph = false;
        }
      });
    } else {
      this.tmpReferenceListOfNewSectionWithNoParagraph = [];
      this.isValidAddReferenceToNewSectionWithNoParagraph = true;
    }

    if (this.isValidAddReferenceToNewSectionWithNoParagraph) {
      this.tmpReferenceListOfNewSectionWithNoParagraph.push(
        JSON.parse(JSON.stringify(this.tmpReferenceNewSectionWithNoParagraph))
      );
      // this.tmpReferenceNewSectionWithNoParagraph = undefined;
      // this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphIsExcluded = undefined;
    }
  }

  // "x" button of removing references from new section
  removeNewSectionReference(i: number) {
    this.tmpReferenceListOfNewSectionWithNoParagraph.splice(i, 1);
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;
  }
  // end of adding reference for new section with no paragraph

  //start of add new paragraph
  initValueForNewParagraph() {
    this.newParagraphOfSelectedSection = {};

    this.newParagraphOfSelectedSection.name =
      'Điểm ' +
      JSON.parse(JSON.stringify(vietnameseAlphabet))[
        this.newParagraphListOfSelectedSection
          ? this.newParagraphListOfSelectedSection?.length +
            parseInt(this.existedParagraphCountOfSelectedSection)
          : 0
      ];
  }

  getNewParagraphDescription(event: any) {
    this.newParagraphOfSelectedSectionDescription = event.target.value;

    this.newParagraphOfSelectedSection.description = event.target.value;
    if (
      this.newParagraphOfSelectedSection?.description === '' ||
      this.newParagraphOfSelectedSection?.description?.length > 2000
    ) {
      this.newParagraphDescriptionInvalidMsg =
        'Vui lòng nhập nội dung cho điều (tối đa 2000 ký tự)';
    } else {
      this.newParagraphDescriptionInvalidMsg = '';
    }

    this.checkValidSaveNewParagraph();
  }

  checkValidSaveNewParagraph() {
    if (
      this.newParagraphOfSelectedSection.description !== undefined &&
      this.newParagraphDescriptionInvalidMsg === '' &&
      (this.newParagraphAdditionalPenaltyInvalidMsg === undefined ||
        this.newParagraphAdditionalPenaltyInvalidMsg === '')
    ) {
      this.isValidSaveNewParagraph = true;
    } else {
      this.isValidSaveNewParagraph = false;
    }
  }

  getNewParagraphAdditionalPenalty(event: any) {
    this.newParagraphOfSelectedSectionAdditionalPenalty = event.target.value;
    if (this.newParagraphOfSelectedSectionAdditionalPenalty?.length > 2000) {
      this.newParagraphAdditionalPenaltyInvalidMsg =
        'Nội dung hình phạt bổ sung không được vượt quá 2000 ký tự';
    } else {
      this.newParagraphAdditionalPenaltyInvalidMsg = '';
    }
    this.newParagraphOfSelectedSection.additionalPenalty = event.target.value;

    this.checkValidSaveNewParagraph();
  }

  loadKeywordListForNewParagraph() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetKeywords, getStorageToken(), {
      successCallback: (response) => {
        this.newParagraphKeywordList = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  selectKeywordForNewParagraph(event: any) {
    if (event.value) {
      this.newParagraphOfSelectedSection.keywordId = event.value.id;
    }
  }

  loadStatuesForAddingReferenceOfNewParagraph() {
    this.newParagraphReferenceStatueList = JSON.parse(
      JSON.stringify(this.statues)
    );
  }

  selectStatueReferenceForNewParagraph(event: any) {
    this.newParagraphReferenceSelectedStatue = event.value;
    this.newParagraphReferenceSelectedSection = undefined;
    this.newParagraphReferenceSelectedParagraph = undefined;

    if (this.tmpReferenceOfNewParagraph === undefined)
      this.tmpReferenceOfNewParagraph = {};
    this.tmpReferenceOfNewParagraph.referenceParagraphSectionStatueId =
      event.value.id;
    this.tmpReferenceOfNewParagraph.referenceParagraphSectionStatueName =
      event.value.name;

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetSectionsByStatueId + '/' + event.value.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.newParagraphReferenceSectionList = response.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  selectSectionReferenceForNewParagraph(event: any) {
    this.newParagraphReferenceSelectedSection = event.value;
    this.newParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceOfNewParagraph.referenceParagraphSectionId =
      event.value.id;
    this.tmpReferenceOfNewParagraph.referenceParagraphSectionName =
      event.value.name;

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetParagraphsBySectionId + '/' + event.value.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.newParagraphReferenceParagraphList = response.data;
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  selectParagraphReferenceForNewParagraph(event: any) {
    this.newParagraphReferenceSelectedParagraph = event.value;

    this.tmpReferenceOfNewParagraph.referenceParagraphId = event.value.id;
    this.tmpReferenceOfNewParagraph.referenceParagraphName = event.value.name;
    this.tmpReferenceOfNewParagraph.referenceParagraphDescription =
      event.value.description;
  }

  chooseNewParagraphIncludedExcluded(event: any) {
    if (this.tmpReferenceOfNewParagraph === undefined) {
      this.tmpReferenceOfNewParagraph = {};
    }

    this.tmpReferenceOfNewParagraphIsExcluded = event.value;

    this.tmpReferenceOfNewParagraph.referenceParagraphIsExcluded =
      this.tmpReferenceOfNewParagraphIsExcluded;
  }

  addNewParagraphReferenceToTmpReferenceList() {
    this.isValidAddReferenceToNewParagraph = true;

    this.tmpReferenceListOfNewParagraph.forEach((r: any) => {
      if (
        r.referenceParagraphId ===
        this.tmpReferenceOfNewParagraph.referenceParagraphId
      ) {
        this.isValidAddReferenceToNewParagraph = false;
      }
    });
    if (this.isValidAddReferenceToNewParagraph) {
      this.tmpReferenceListOfNewParagraph.push(
        JSON.parse(JSON.stringify(this.tmpReferenceOfNewParagraph))
      );
      // this.tmpReferenceNewSectionWithNoParagraph = undefined;
      // this.tmpReferenceNewSectionWithNoParagraph.referenceParagraphIsExcluded = undefined;
    }
  }

  removeNewParagraphReference(i: number) {
    this.tmpReferenceListOfNewParagraph.splice(i, 1);
    this.isValidAddReferenceToNewParagraph = true;
  }

  // "Lưu lại" button on paragraph dialog clicked -> add new paragraph to list new Paragraphs
  saveNewParagraph() {
    this.newParagraphOfSelectedSection.referenceParagraphs =
      this.tmpReferenceListOfNewParagraph;
    this.newParagraphListOfSelectedSection.push(
      this.newParagraphOfSelectedSection
    );
    if (
      this.selectedSectionForAddNewLaw.paragraphs &&
      this.selectedSectionForAddNewLaw.paragraphs.length === 0
    ) {
      this.selectedSectionForAddNewLaw.paragraphs = [];
    }
    this.clearNewParagraphForAddingNextGround();
  }

  clearNewParagraphForAddingNextGround() {
    this.initValueForNewParagraph();
    this.newParagraphOfSelectedSectionDescription = undefined;
    this.newParagraphOfSelectedSectionAdditionalPenalty = undefined;
    this.newParagraphDescriptionInvalidMsg = undefined;
    this.newParagraphAdditionalPenaltyInvalidMsg = undefined;
    this.isValidSaveNewParagraph = false;

    //Keep statue list for next creation of new paragraph
    this.newParagraphReferenceSelectedStatue = null;
    this.newParagraphReferenceSectionList = undefined;
    this.newParagraphReferenceSelectedSection = null;
    this.newParagraphReferenceParagraphList = undefined;
    this.newParagraphReferenceSelectedParagraph = null;

    //Clear new paragraph REFERENCE list
    this.tmpReferenceListOfNewParagraph = [];
    this.tmpReferenceOfNewParagraph = undefined;
    this.tmpReferenceOfNewParagraphIsExcluded = undefined;
    this.isValidAddReferenceToNewParagraph = true;

    this.newParagraphSelectedKeyword = undefined;
  }

  clearAllNewParagraphs() {
    this.newParagraphListOfSelectedSection = [];
    this.newParagraphOfSelectedSection = undefined;
    this.newParagraphOfSelectedSectionDescription = undefined;
    this.newParagraphOfSelectedSectionAdditionalPenalty = undefined;
    this.newParagraphDescriptionInvalidMsg = undefined;
    this.newParagraphAdditionalPenaltyInvalidMsg = undefined;
    this.isValidSaveNewParagraph = false;

    this.newParagraphReferenceStatueList = undefined;
    this.newParagraphReferenceSelectedStatue;
    this.newParagraphReferenceSectionList = undefined;
    this.newParagraphReferenceSelectedSection = undefined;
    this.newParagraphReferenceParagraphList = undefined;
    this.newParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceListOfNewParagraph = [];
    this.tmpReferenceOfNewParagraph = undefined;
    this.tmpReferenceOfNewParagraphIsExcluded = undefined;
    this.isValidAddReferenceToNewParagraph = true;

    this.newParagraphKeywordList = undefined;
    this.newParagraphSelectedKeyword = undefined;
  }

  //TODO: add notification
  //"Hoàn thành" button on paragraph dialog clicked
  confirmedAddNewLaw() {
    // if new section created & that section is a section with no paragraph
    if (
      this.isAddedNewSection &&
      this.selectedSectionForAddNewLaw?.isSectionWithNoParagraph
    ) {
      var payload1: NewSectionDTO = {
        statueId: this.selectedStatueForAddNewLaw?.id,
        name: this.selectedSectionForAddNewLaw?.name,
        description: this.selectedSectionForAddNewLaw?.description,
        vehicleCategoryId: this.selectedSectionForAddNewLaw?.vehicleCategoryId,
        minPenalty: this.selectedSectionForAddNewLaw?.minPenalty,
        maxPenalty: this.selectedSectionForAddNewLaw?.maxPenalty,
        isSectionWithNoParagraph:
          this.selectedSectionForAddNewLaw?.isSectionWithNoParagraph,

        referenceParagraphs:
          this.selectedSectionForAddNewLaw?.referenceParagraphs,
      };

      this.isLoadingService.add();
      this.wrapperService.post(
        paths.ScribeCreateNewSection,
        payload1,
        getStorageToken(),
        {
          successCallback: (response1) => {
            this.wrapperService.post(
              paths.ScribeCreateLawModificationRequest,
              {
                modifyingSectionId: response1.data?.id,
                modifiedSectionId: null,
                scribeId: decodeToken(getStorageToken() || '')?.Id,
                adminId: this.selectedAdmin.id,
                operationType: OperationType.Add,
              },
              getStorageToken(),
              {
                successCallback: (response2) => {
                  //add notification
                  this.notiService.create({
                    subjectId: response2.data?.id,
                    subjectType: SubjectType.Section,
                    senderId: decodeToken(getStorageToken() || '')?.Id,
                    senderUsername: response2.data?.scribe?.username || '',
                    receiverId: this.selectedAdmin.id,
                    receiverUsername: this.selectedAdmin?.username || '',
                    action: commonStr.requestCreate,
                    relatedDescription: payload1?.name,
                    createdDate: new Date().toString(),
                    isRead: false,
                  });

                  this.loadAdmins();
                  this.messageService.add({
                    key: 'createSuccess',
                    severity: 'success',
                    summary: commonStr.success,
                    detail: commonStr.romCreatedSuccessfully,
                  });
                  this.isLoadingService.remove();
                },
                errorCallback: (error) => {
                  console.log(error);
                  this.messageService.add({
                    key: 'createError',
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
            this.messageService.add({
              key: 'createError',
              severity: 'error',
              summary: commonStr.fail,
              detail: commonStr.errorOccur,
            });
            this.isLoadingService.remove();
          },
        }
      );
    } else if (
      this.isAddedNewSection &&
      !this.selectedSectionForAddNewLaw?.isSectionWithNoParagraph
    ) {
      var payload2: NewSectionDTO = {
        statueId: this.selectedStatueForAddNewLaw?.id,
        name: this.selectedSectionForAddNewLaw?.name,
        description: this.selectedSectionForAddNewLaw?.description,
        vehicleCategoryId: this.selectedSectionForAddNewLaw?.vehicleCategoryId,
        minPenalty: this.selectedSectionForAddNewLaw?.minPenalty,
        maxPenalty: this.selectedSectionForAddNewLaw?.maxPenalty,
        isSectionWithNoParagraph:
          this.selectedSectionForAddNewLaw?.isSectionWithNoParagraph,

        paragraphs: this.newParagraphListOfSelectedSection,
      };

      this.isLoadingService.add();
      this.wrapperService.post(
        paths.ScribeCreateNewSection,
        payload2,
        getStorageToken(),
        {
          successCallback: (response1) => {
            this.wrapperService.post(
              paths.ScribeCreateLawModificationRequest,
              {
                modifyingSectionId: response1.data?.id,
                modifiedSectionId: null,
                scribeId: decodeToken(getStorageToken() || '')?.Id,
                adminId: this.selectedAdmin.id,
                operationType: OperationType.Add,
              },
              getStorageToken(),
              {
                successCallback: (response2) => {
                  //add notification
                  this.notiService.create({
                    subjectId: response2.data?.id,
                    subjectType: SubjectType.Section,
                    senderId: decodeToken(getStorageToken() || '')?.Id,
                    senderUsername: response2.data?.scribe?.username || '',
                    receiverId: this.selectedAdmin.id,
                    receiverUsername: this.selectedAdmin?.username || '',
                    action: commonStr.requestCreate,
                    relatedDescription: payload2?.name,
                    createdDate: new Date().toString(),
                    isRead: false,
                  });

                  this.loadAdmins();
                  this.messageService.add({
                    key: 'createSuccess',
                    severity: 'success',
                    summary: commonStr.success,
                    detail: commonStr.romCreatedSuccessfully,
                  });
                  this.isLoadingService.remove();
                },
                errorCallback: (error) => {
                  console.log(error);
                  this.messageService.add({
                    key: 'createError',
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
            this.messageService.add({
              key: 'createError',
              severity: 'error',
              summary: commonStr.fail,
              detail: commonStr.errorOccur,
            });
            this.isLoadingService.remove();
          },
        }
      );
    } else {
      var payload3: NewParagraphDTO[] = this.newParagraphListOfSelectedSection;
      payload3.forEach((p: NewParagraphDTO) => {
        p.sectionId = this.selectedSectionForAddNewLaw?.id;
        this.isLoadingService.add();
        this.wrapperService.post(
          paths.ScribeCreateParagraphForROM,
          p,
          getStorageToken(),
          {
            successCallback: (response1) => {
              this.wrapperService.post(
                paths.ScribeCreateLawModificationRequest,
                {
                  modifyingParagraphId: response1.data?.id,
                  modifiedParagraphId: null,
                  scribeId: decodeToken(getStorageToken() || '')?.Id,
                  adminId: this.selectedAdmin.id,
                  operationType: OperationType.Add,
                },
                getStorageToken(),
                {
                  successCallback: (response2) => {
                    //add notification
                    this.notiService.create({
                      subjectId: response2.data?.id,
                      subjectType: SubjectType.Paragraph,
                      senderId: decodeToken(getStorageToken() || '')?.Id,
                      senderUsername: response2.data?.scribe?.username || '',
                      receiverId: this.selectedAdmin.id,
                      receiverUsername: this.selectedAdmin?.username || '',
                      action: commonStr.requestCreate,
                      relatedDescription: p?.name,
                      createdDate: new Date().toString(),
                      isRead: false,
                    });

                    this.loadAdmins();
                    this.messageService.add({
                      key: 'createSuccess',
                      severity: 'success',
                      summary: commonStr.success,
                      detail: commonStr.romCreatedSuccessfully,
                    });
                    this.isLoadingService.remove();
                  },
                  errorCallback: (error) => {
                    console.log(error);
                    this.messageService.add({
                      key: 'createError',
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
              this.messageService.add({
                key: 'createError',
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

    this.clearAddNewAllData();
  }

  selectAnotherStatueOrDefaultStatueSelected() {
    this.clearNewSection();
    this.clearAllNewParagraphs();
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetSectionsByStatueId +
        '/' +
        this.selectedStatueForAddNewLaw?.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.selectedStatueForAddNewLaw.sections = response.data;
          this.selectedSectionForAddNewLaw =
            // this.selectedStatueForAddNewLaw.sections[this.selectedStatueForAddNewLaw.sections?.length-1];
            this.selectedStatueForAddNewLaw.sections[0];

          //Set init value for new section
          this.initValueForNewSection();

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  selectAnotherSectionOrDefaultSectionSelected() {
    this.clearAllNewParagraphs();
    //load existing paragraph data to get length to init paragraph name for new paragraph
    if (this.selectedSectionForAddNewLaw.paragraphs?.length > 0) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId +
          '/' +
          this.selectedSectionForAddNewLaw?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.existedParagraphCountOfSelectedSection = response.data.length;
            this.initValueForNewParagraph();

            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    } else {
      this.existedParagraphCountOfSelectedSection = 0;
      this.initValueForNewParagraph();
    }
  }

  openUpdateNewSectionParagraph(i: number) {
    this.updatingParagraphIndex = i;

    this.newParagraphOfSelectedSectionDescription =
      this.newParagraphListOfSelectedSection[i].description;
    this.newParagraphOfSelectedSectionAdditionalPenalty =
      this.newParagraphListOfSelectedSection[i].additionalPenalty;
    this.newParagraphSelectedKeyword = this.newParagraphKeywordList.filter(
      (k: any) => k.id === this.newParagraphListOfSelectedSection[i]?.keywordId
    )[0];
    this.tmpReferenceListOfNewParagraph =
      this.newParagraphListOfSelectedSection[i].referenceParagraphs.slice();

    this.isUpdatingNewParagraph = true;
    this.isValidGobackToSection = false;
    this.isValidDisplayFinishAndSaveOnParagraphDialog = false;
    this.isValidAddReferenceToNewParagraph = true;
  }

  saveUpdatedNewParagraph() {
    this.newParagraphListOfSelectedSection[this.updatingParagraphIndex] = {
      name: this.newParagraphListOfSelectedSection[this.updatingParagraphIndex]
        .name,
      description: this.newParagraphOfSelectedSectionDescription,
      additionalPenalty: this.newParagraphOfSelectedSectionAdditionalPenalty,
      keywordId: this.newParagraphSelectedKeyword?.id,
      referenceParagraphs: this.tmpReferenceListOfNewParagraph,
    };
    this.updatingParagraphIndex = undefined;

    this.newParagraphOfSelectedSectionDescription = undefined;
    this.newParagraphOfSelectedSectionAdditionalPenalty = undefined;
    this.newParagraphSelectedKeyword = undefined;
    this.tmpReferenceListOfNewParagraph = [];

    this.isUpdatingNewParagraph = false;
    this.isValidGobackToSection = true;
    this.isValidDisplayFinishAndSaveOnParagraphDialog = true;
    this.isValidAddReferenceToNewParagraph = true;

    this.newParagraphOfSelectedSection.description = undefined;
  }

  cancleUpdatedNewParagraph() {
    this.updatingParagraphIndex = undefined;

    this.newParagraphOfSelectedSectionDescription = undefined;
    this.newParagraphOfSelectedSectionAdditionalPenalty = undefined;
    this.newParagraphSelectedKeyword = undefined;
    this.tmpReferenceListOfNewParagraph = [];

    this.isUpdatingNewParagraph = false;
    this.isValidGobackToSection = true;
    this.isValidDisplayFinishAndSaveOnParagraphDialog = true;
    this.isValidAddReferenceToNewParagraph = true;

    this.isValidSaveNewParagraph = false;
    this.newParagraphDescriptionInvalidMsg = undefined;
    this.newParagraphAdditionalPenaltyInvalidMsg = undefined;
  }

  confirmDeleteNewParagraphInNewParagraphList(i: number) {
    this.deletingParagraphIndex = i;
    this.displayConfirmDeleteNewParagraphInNewParagraphList = true;
  }

  deleteNewParagraphInNewParagraphList() {
    this.newParagraphListOfSelectedSection.splice(
      this.deletingParagraphIndex,
      1
    );

    let i = 0;
    this.newParagraphListOfSelectedSection.forEach((p: any) => {
      p.name =
        'Điểm ' +
        JSON.parse(JSON.stringify(vietnameseAlphabet))[
          this.newParagraphListOfSelectedSection
            ? parseInt(this.existedParagraphCountOfSelectedSection) + i
            : 0
        ];
      i++;
    });
    this.displayConfirmDeleteNewParagraphInNewParagraphList = false;
    this.initValueForNewParagraph();
  }

  openUpdateNewSection() {
    this.isUpdatingNewSection = true;
    this.isValidGobackToStatue = false;
    this.isValidGoNextOnSectionDialog = false;
    this.isValidFinishOnSectionDialog = false;
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;

    //render data for newSection from selectedStatueForAddNewLaw.sections
    this.newSection = {
      name: this.selectedStatueForAddNewLaw.sections[
        this.selectedStatueForAddNewLaw.sections?.length - 1
      ]?.name,
      description:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.description,
      vehicleCategoryId:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.vehicleCategoryId,
      minPenalty:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.minPenalty,
      maxPenalty:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.maxPenalty,
      isSectionWithNoParagraph:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.isSectionWithNoParagraph,
      referenceParagraphs:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.referenceParagraphs?.slice(),
    };

    this.isSectionWithNoParagraph = this.newSection.isSectionWithNoParagraph;

    this.tmpReferenceListOfNewSectionWithNoParagraph =
      this.newSection.referenceParagraphs;
  }

  saveUpdatedNewSection() {
    this.isAddedNewSection = true;
    if (this.isSectionWithNoParagraph) {
      this.isValidGoNextOnSectionDialog = false;
      this.isValidFinishOnSectionDialog = true;

      this.newSection.isSectionWithNoParagraph = true;
      // if is a section with no paragraph and has reference list
      if (this.tmpReferenceListOfNewSectionWithNoParagraph) {
        this.newSection.referenceParagraphs =
          this.tmpReferenceListOfNewSectionWithNoParagraph;
      }
    } else {
      this.isValidGoNextOnSectionDialog = true;
      this.isValidFinishOnSectionDialog = false;

      this.newSection.isSectionWithNoParagraph = false;
    }
    this.selectedSectionForAddNewLaw = this.newSection;

    //pop selectedStatueForAddNewLaw.sections last -> push newSection again to it
    this.selectedStatueForAddNewLaw.sections.pop();
    this.selectedStatueForAddNewLaw.sections.push({ ...this.newSection });

    this.isUpdatingNewSection = false;
    this.isValidGobackToStatue = false;
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;
    this.isValidGobackToStatue = true;
  }

  cancleUpdatedNewSection() {
    this.isUpdatingNewSection = false;
    this.isValidGobackToStatue = true;
    if (this.isSectionWithNoParagraph) {
      this.isValidGoNextOnSectionDialog = false;
      this.isValidFinishOnSectionDialog = true;
    } else {
      this.isValidGoNextOnSectionDialog = true;
      this.isValidFinishOnSectionDialog = false;
    }
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;

    //rollback data for newSection from selectedStatueForAddNewLaw.sections
    this.newSection = {
      name: this.selectedStatueForAddNewLaw.sections[
        this.selectedStatueForAddNewLaw.sections?.length - 1
      ]?.name,
      description:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.description,
      vehicleCategoryId:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.vehicleCategoryId,
      minPenalty:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.minPenalty,
      maxPenalty:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.maxPenalty,
      isSectionWithNoParagraph:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.isSectionWithNoParagraph,
      referenceParagraphs:
        this.selectedStatueForAddNewLaw.sections[
          this.selectedStatueForAddNewLaw.sections?.length - 1
        ]?.referenceParagraphs?.slice(),
    };

    this.isSectionWithNoParagraph = this.newSection.isSectionWithNoParagraph;

    this.tmpReferenceListOfNewSectionWithNoParagraph =
      this.newSection.referenceParagraphs;
  }

  confirmDeleteNewSection() {
    this.displayConfirmDeleteNewSection = true;
  }

  deleteNewSection() {
    this.selectedStatueForAddNewLaw.sections?.splice(
      [this.selectedStatueForAddNewLaw.sections?.length - 1],
      1
    );
    this.displayConfirmDeleteNewSection = false;
    this.selectedSectionForAddNewLaw =
      this.selectedStatueForAddNewLaw.sections[0];
    this.clearNewSection();
    this.isAddedNewSection = false;
    this.selectAnotherSectionOrDefaultSectionSelected();
  }

  //end of add new paragraph

  //clearing all data if dialog hide
  clearAddNewAllData() {
    this.displayAddNewLawDialog = false;

    this.isShowingStatueDialog = false;
    this.isShowingSectionDialog = false;
    this.isShowingParagraphDialog = false;
    this.isShowingConfirmAddNewLaw = false;

    //Set default value for statue dropdown of add new from statue screen
    this.statueListForAddNewLaw = JSON.parse(JSON.stringify(this.statues));
    this.selectedStatueForAddNewLaw = this.statueListForAddNewLaw[0];

    this.selectedSectionForAddNewLaw = undefined;

    this.isCollapsedCreatNewSection = false;

    this.newSection = undefined;
    this.isValidNewSectionMinPenalty = true;
    this.isValidNewSectionMaxPenalty = true;
    this.newSectionPenaltyInvalidMsg = '';
    this.newSectionDescriptionInvalidMsg = '';
    this.isValidGoNextOnSectionDialog = true;
    this.isValidFinishOnSectionDialog = false;
    this.isAddedNewSection = false;

    this.isUpdatingNewSection = false;
    this.isValidGobackToStatue = true;

    this.displayConfirmDeleteNewSection = false;

    //Clear data of new section reference list
    this.isSectionWithNoParagraph = false;
    this.newSectionWithNoParagraphReferenceStatueList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedStatue = undefined;
    this.newSectionWithNoParagraphReferenceSectionList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedSection = undefined;
    this.newSectionWithNoParagraphReferenceParagraphList = undefined;
    this.newSectionWithNoParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceNewSectionWithNoParagraph = undefined;
    this.tmpReferenceNewSectionWithNoParagraphIsExcluded = undefined;
    this.tmpReferenceListOfNewSectionWithNoParagraph = [];
    this.isValidAddReferenceToNewSectionWithNoParagraph = true;

    //clear data of new paragraph
    this.newParagraphListOfSelectedSection = [];
    this.newParagraphOfSelectedSection = undefined;
    this.newParagraphOfSelectedSectionDescription = undefined;
    this.newParagraphOfSelectedSectionAdditionalPenalty = undefined;
    this.newParagraphDescriptionInvalidMsg = undefined;
    this.newParagraphAdditionalPenaltyInvalidMsg = undefined;
    this.isValidSaveNewParagraph = false;

    this.newParagraphReferenceStatueList = undefined;
    this.newParagraphReferenceSelectedStatue = undefined;
    this.newParagraphReferenceSectionList = undefined;
    this.newParagraphReferenceSelectedSection = undefined;
    this.newParagraphReferenceParagraphList = undefined;
    this.newParagraphReferenceSelectedParagraph = undefined;

    this.tmpReferenceListOfNewParagraph = [];
    this.tmpReferenceOfNewParagraph = undefined;
    this.tmpReferenceOfNewParagraphIsExcluded = undefined;
    this.isValidAddReferenceToNewParagraph = true;

    this.newParagraphKeywordList = undefined;
    this.newParagraphSelectedKeyword = undefined;

    this.existedParagraphCountOfSelectedSection = undefined;

    this.isUpdatingNewParagraph = false;
    this.updatingParagraphIndex = undefined;
    this.deletingParagraphIndex = undefined;
    this.displayConfirmDeleteNewParagraphInNewParagraphList = false;
    this.isValidGobackToSection = true;
    this.isValidDisplayFinishAndSaveOnParagraphDialog = true;

    this.displayAddNewParagraphDialog = false;
  }
  //end of admin ADD new section

  //start of add new paragraph
  displayAddNewParagraph() {
    this.displayAddNewParagraphDialog = true;
    this.selectedStatueForAddNewLaw = { ...this.selectedStatue };
    this.selectedSectionForAddNewLaw = { ...this.selectedSection };
    if (this.selectedSectionForAddNewLaw.paragraphs?.length > 0) {
      this.isLoadingService.add();
      this.wrapperService.get(
        paths.ScribeGetParagraphsBySectionId +
          '/' +
          this.selectedSectionForAddNewLaw?.id,
        getStorageToken(),
        {
          successCallback: (response) => {
            this.existedParagraphCountOfSelectedSection = response.data.length;
            this.initValueForNewParagraph();

            this.isLoadingService.remove();
          },
          errorCallback: (error) => {
            console.log(error);
            this.isLoadingService.remove();
          },
        }
      );
    } else {
      this.existedParagraphCountOfSelectedSection = 0;
      this.initValueForNewParagraph();
    }

    this.loadKeywordListForNewParagraph();
    this.loadStatuesForAddingReferenceOfNewParagraph();
  }
  //end of add new paragraph

  //start of add new section
  displayAddNewSection() {
    this.selectedStatueForAddNewLaw = { ...this.selectedStatue };
    this.displayAddNewLawDialog = true;
    this.isShowingStatueDialog = false;
    this.isShowingSectionDialog = true;
    this.isShowingParagraphDialog = false;
    this.isShowingConfirmAddNewLaw = false;
    this.isValidGobackToStatue = false;
    this.selectAnotherStatueOrDefaultStatueSelected();
  }
  //end of add new section
}
