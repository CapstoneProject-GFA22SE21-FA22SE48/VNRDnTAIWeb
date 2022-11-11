import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import { Answer, Question, User } from 'src/app/models/General.model';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { FileUploadService } from 'src/services/file-upload.service';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import * as commonStr from '../../../common/commonStr';
import { toNonAccentVietnamese } from 'src/app/utilities/nonAccentVietnamese';
import { NotificationService } from 'src/services/notification.service';
import { SubjectType } from 'src/app/common/subjectType';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css'],
})
export class ManageQuestionsComponent implements OnInit {
  questions: any;
  tmpQuestions: any;
  selectedQuestion: any;
  tmpSelectedQuestion: any;
  testCategories: any;
  questionCategories: any;

  loadedTestCategories: any;
  selectedTestCategoryId: any;
  selectedQuestionCategoryId: any;

  filterTestCategoryId: any;
  filterQuestionCategoryId: any;
  searchStr: string = '';

  displayUpdateDialog: boolean = false;
  invalidUpdatedQuestionContent: boolean = false;
  invalidUpdatedQuestionAnswer: boolean = false;
  txtAnswerChange: string = '';
  isChanging: boolean = false;
  imageSrc: any;
  updateQuestionImgFile: any;

  displayDeleteDialog: boolean = false;

  displayCreateDialog: boolean = false;
  newQuestion: any;
  newQuestionName: any;
  newQuestionContent: any;
  newQuestionAnswer: any;
  editingNewQuestionAnswerIndex: any;
  txtEditNewQuestionAnswer: any;
  inValidNewQuestionEdittedAnswer: boolean = false;
  newQuestionAnswers: any[] = [];
  isEditingNewQuestionAnswer: boolean = false;
  newQuestionImgUrl: string = '';
  newQuestionImgFile: any;
  isValidNewQuestion: boolean = false;
  inValidNewQuestionContent: boolean = false;
  inValidNewQuestionAnswer: boolean = false;

  admins: User[] = [];
  selectedAdmin: any;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAssigedQuestions();
    this.loadAdmins();
  }

  loadAssigedQuestions() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.ScribeGetAssignedQuestions +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.questions = response.data;
          this.tmpQuestions = response.data;

          this.testCategories = [];
          this.questionCategories = [];

          this.questions.forEach((q: any) => {
            if (
              !this.testCategories.find((tc: any) => q.testCategoryId === tc.id)
            ) {
              this.testCategories.push({
                id: q.testCategoryId,
                name: q.testCategoryName,
              });
            }
          });

          this.questions.forEach((q: any) => {
            if (
              !this.questionCategories.find(
                (qc: any) => q.questionCategoryId === qc.id
              )
            ) {
              this.questionCategories.push({
                id: q.questionCategoryId,
                name: q.questionCategoryName + ' (' + q.testCategoryName + ')',
              });
            }
          });

          this.selectedTestCategoryId = this.testCategories[0]?.id;
          this.selectedQuestionCategoryId = this.questionCategories[0]?.id;

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
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

  filterData() {
    this.questions = this.tmpQuestions;

    //Search
    if (this.searchStr && this.searchStr.trim() != '') {
      this.questions = this.questions.filter(
        (q: any) =>
          toNonAccentVietnamese(q.content?.toLowerCase())
            .trim()
            .includes(
              toNonAccentVietnamese(this.searchStr.toLowerCase()).trim()
            ) ||
          q.name
            ?.toLowerCase()
            .trim()
            .includes(this.searchStr.toLowerCase().trim())
      );
    } else {
      this.questions = this.tmpQuestions;
    }

    //Filter test category
    if (this.filterTestCategoryId) {
      this.questions = this.questions.filter(
        (q: any) => q.testCategoryId === this.filterTestCategoryId
      );
    }

    //Filter test category
    if (this.filterQuestionCategoryId) {
      this.questions = this.questions.filter(
        (q: any) => q.questionCategoryId === this.filterQuestionCategoryId
      );
    }
  }

  viewInfo(question: Question) {
    this.isChanging = false;
    this.isLoadingService.add();
    this.selectedQuestion = question;
    this.tmpSelectedQuestion = JSON.parse(
      JSON.stringify(this.selectedQuestion)
    );
    this.wrapperService.get(
      paths.ScribeGetAnswersByQuestionId + '/' + this.selectedQuestion?.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.selectedQuestion.answers = response.data;
          this.tmpSelectedQuestion.answers = JSON.parse(
            JSON.stringify(response.data)
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

  closeInfo() {
    this.selectedQuestion = undefined;
  }

  openUpdateQuestion() {
    this.resetDataUpdateQuestion();
    this.displayUpdateDialog = true;
  }

  resetDataUpdateQuestion() {
    this.tmpSelectedQuestion = JSON.parse(
      JSON.stringify(this.selectedQuestion)
    );

    this.newQuestionContent = this.tmpSelectedQuestion?.content;
    this.selectedAdmin = this.admins[0];
    this.displayUpdateDialog = false;
    this.isChanging = false;
    this.invalidUpdatedQuestionAnswer = false;
    this.invalidUpdatedQuestionContent = false;
    this.updateQuestionImgFile = undefined;
  }

  detectChange() {
    if (
      JSON.stringify(this.selectedQuestion) !==
        JSON.stringify(this.tmpSelectedQuestion) &&
      !this.invalidUpdatedQuestionContent &&
      !this.invalidUpdatedQuestionAnswer
    ) {
      this.isChanging = true;
    } else {
      this.isChanging = false;
    }
  }

  changeTxtQuestionContent(newQuestionContent: string) {
    if (
      newQuestionContent?.trim() !== '' &&
      newQuestionContent?.length <= 2000
    ) {
      this.tmpSelectedQuestion.content = newQuestionContent;
      this.invalidUpdatedQuestionContent = false;
    } else {
      this.invalidUpdatedQuestionContent = true;
    }
    this.detectChange();
  }

  changeSelectedQuestionCorrectAnswer(answer: Answer) {
    this.tmpSelectedQuestion.answers.forEach((a: Answer) => {
      if (a.id === answer.id) {
        a.isCorrect = true;
      } else {
        a.isCorrect = false;
      }
    });
    this.detectChange();
  }

  changeTxtAnswer(answer: Answer, newAnswer: string, i: number) {
    if (this.tmpSelectedQuestion.answers) {
      var isExistedAnsweer = this.tmpSelectedQuestion.answers.some(
        (a: any, index: number) =>
          a.description?.trim() === newAnswer.trim() && i !== index
      );
      if (isExistedAnsweer) {
        this.invalidUpdatedQuestionAnswer = true;
      } else {
        this.tmpSelectedQuestion.answers.forEach((a: Answer) => {
          if (a.id === answer.id) {
            if (
              newAnswer?.trim() !== '' &&
              newAnswer?.length <= 2000 &&
              a.description !== newAnswer?.trim()
            ) {
              a.description = newAnswer;
              this.isChanging = true;
              this.invalidUpdatedQuestionAnswer = false;
            } else {
              this.isChanging = false;
              this.invalidUpdatedQuestionAnswer = true;
            }
          }
        });
      }
    }
    this.detectChange();
  }

  updateImage(event: any, imageUploaded: any): void {
    this.tmpSelectedQuestion.imageUrl =
      event.files[0].objectURL?.changingThisBreaksApplicationSecurity;
    this.updateQuestionImgFile = event.files[0];
    imageUploaded.clear();
    this.detectChange();
  }

  updateQuestion() {
    if (
      this.updateQuestionImgFile !== undefined &&
      this.tmpSelectedQuestion.imgUrl !== ''
    ) {
      this.fileUploadService
        .uploadImageToFirebase(
          this.updateQuestionImgFile,
          `images/mock-test/new/`
        )
        .then((imgUrl: any) => {
          this.tmpSelectedQuestion.imageUrl = imgUrl;
        })
        .then(() => {
          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCreateQuestionForROM,
            this.tmpSelectedQuestion,
            getStorageToken(),
            {
              successCallback: (response1) => {
                this.wrapperService.post(
                  paths.ScribeCreateQuestionModificationRequest,
                  {
                    modifiedQuestionId: this.selectedQuestion.id,
                    modifyingQuestionId: response1.data.id,
                    scribeId: decodeToken(getStorageToken() || '')?.Id,
                    adminId: this.selectedAdmin.id,
                    operationType: OperationType.Update,
                  },
                  getStorageToken(),
                  {
                    successCallback: (response2) => {
                      //add notification
                      this.notiService.create({
                        subjectId: response2.data?.modifyingQuestionId,
                        subjectType: SubjectType.Question,
                        senderId: decodeToken(getStorageToken() || '')?.Id,
                        senderUsername: response2.data?.scribe?.username || '',
                        receiverId: this.selectedAdmin.id,
                        receiverUsername: this.selectedAdmin?.username || '',
                        action: commonStr.requestUpdate,
                        relatedDescription: this.tmpSelectedQuestion?.content,
                        createdDate: new Date().toString(),
                        isRead: false,
                      });

                      this.resetDataUpdateQuestion();
                      this.loadAdmins();
                      this.loadAssigedQuestions();
                      this.displayUpdateDialog = false;

                      this.isLoadingService.remove();

                      this.messageService.add({
                        key: 'createUpdateROMSuccess',
                        severity: 'success',
                        summary: commonStr.success,
                        detail: commonStr.romCreatedSuccessfully,
                      });
                    },
                    errorCallback: (error) => {
                      this.resetDataUpdateQuestion();
                      this.loadAdmins();
                      this.loadAssigedQuestions();
                      this.displayUpdateDialog = false;

                      this.selectedQuestion = undefined;

                      this.isLoadingService.remove();

                      this.messageService.add({
                        key: 'createUpdateROMError',
                        severity: 'error',
                        summary: commonStr.fail,
                        detail: error?.response?.data || commonStr.errorOccur,
                      });
                    },
                  }
                );
              },
              errorCallback: (error) => {
                this.resetDataUpdateQuestion();
                this.loadAdmins();
                this.loadAssigedQuestions();
                this.displayUpdateDialog = false;

                this.isLoadingService.remove();

                this.messageService.add({
                  key: 'createUpdateROMError',
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
        paths.ScribeCreateQuestionForROM,
        this.tmpSelectedQuestion,
        getStorageToken(),
        {
          successCallback: (response1) => {
            this.wrapperService.post(
              paths.ScribeCreateQuestionModificationRequest,
              {
                modifiedQuestionId: this.selectedQuestion.id,
                modifyingQuestionId: response1.data.id,
                scribeId: decodeToken(getStorageToken() || '')?.Id,
                adminId: this.selectedAdmin.id,
                operationType: OperationType.Update,
              },
              getStorageToken(),
              {
                successCallback: (response2) => {
                  //add notification
                  this.notiService.create({
                    subjectId: response2.data?.modifyingQuestionId,
                    subjectType: SubjectType.Question,
                    senderId: decodeToken(getStorageToken() || '')?.Id,
                    senderUsername: response2.data?.scribe?.username || '',
                    receiverId: this.selectedAdmin.id,
                    receiverUsername: this.selectedAdmin?.username || '',
                    action: commonStr.requestUpdate,
                    relatedDescription: this.tmpSelectedQuestion?.content,
                    createdDate: new Date().toString(),
                    isRead: false,
                  });

                  this.resetDataUpdateQuestion();
                  this.loadAdmins();
                  this.loadAssigedQuestions();
                  this.displayUpdateDialog = false;

                  this.isLoadingService.remove();

                  this.messageService.add({
                    key: 'createUpdateROMSuccess',
                    severity: 'success',
                    summary: commonStr.success,
                    detail: commonStr.romCreatedSuccessfully,
                  });
                },
                errorCallback: (error) => {
                  this.resetDataUpdateQuestion();
                  this.loadAdmins();
                  this.loadAssigedQuestions();
                  this.displayUpdateDialog = false;

                  this.selectedQuestion = undefined;

                  this.isLoadingService.remove();

                  this.messageService.add({
                    key: 'createUpdateROMError',
                    severity: 'error',
                    summary: commonStr.fail,
                    detail: error?.response?.data || commonStr.errorOccur,
                  });
                },
              }
            );
          },
          errorCallback: (error) => {
            this.resetDataUpdateQuestion();
            this.loadAdmins();
            this.loadAssigedQuestions();
            this.displayUpdateDialog = false;

            this.isLoadingService.remove();

            this.messageService.add({
              key: 'createUpdateROMError',
              severity: 'error',
              summary: commonStr.fail,
              detail: commonStr.errorOccur,
            });
          },
        }
      );
    }
  }

  deleteQuestion() {
    var deleteQuestion = JSON.parse(JSON.stringify(this.selectedQuestion));

    deleteQuestion.isDeleted = true;
    deleteQuestion.answers.forEach((a: Answer) => {
      a.isDeleted = true;
    });

    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateQuestionForROM,
      deleteQuestion,
      getStorageToken(),
      {
        successCallback: (response1) => {
          this.wrapperService.post(
            paths.ScribeCreateQuestionModificationRequest,
            {
              modifiedQuestionId: this.selectedQuestion.id,
              modifyingQuestionId: response1.data.id,
              scribeId: decodeToken(getStorageToken() || '')?.Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response2) => {
                //add notification
                this.notiService.create({
                  subjectId: response2.data?.modifyingQuestionId,
                  subjectType: SubjectType.Question,
                  senderId: decodeToken(getStorageToken() || '')?.Id,
                  senderUsername: response2.data?.scribe?.username || '',
                  receiverId: this.selectedAdmin.id,
                  receiverUsername: this.selectedAdmin?.username || '',
                  action: commonStr.requestDelete,
                  relatedDescription: deleteQuestion?.content,
                  createdDate: new Date().toString(),
                  isRead: false,
                });

                this.displayDeleteDialog = false;
                this.messageService.add({
                  key: 'createDeleteROMSuccess',
                  severity: 'success',
                  summary: commonStr.success,
                  detail: commonStr.romCreatedSuccessfully,
                });
                this.loadAdmins();
                this.isLoadingService.remove();
              },
              errorCallback: (error) => {
                console.log(error);
                this.displayDeleteDialog = false;
                this.messageService.add({
                  key: 'createDeleteROMError',
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
          this.displayDeleteDialog = false;
          this.messageService.add({
            key: 'createDeleteROMError',
            severity: 'error',
            summary: commonStr.fail,
            detail: commonStr.errorOccur,
          });
          this.isLoadingService.remove();
        },
      }
    );
  }

  initValueForCreateNew() {
    this.selectedTestCategoryId = this.testCategories[0]?.id;
    this.selectedQuestionCategoryId = this.questionCategories[0]?.id;
  }

  getNewQuestionContent(event: any) {
    this.newQuestionContent = event.target.value;
    if (
      this.newQuestionContent?.trim() === '' ||
      this.newQuestionContent?.length > 2000
    ) {
      this.inValidNewQuestionContent = true;
    } else {
      this.inValidNewQuestionContent = false;
    }
    this.validateNewQuestion();
  }

  getNewQuestionAnswer() {
    if (
      // this.newQuestionAnswer?.trim() === '' ||
      this.newQuestionAnswer?.length > 2000
    ) {
      this.inValidNewQuestionAnswer = true;
    } else {
      if (this.newQuestionAnswers) {
        var isExistedAnsweer = this.newQuestionAnswers.some(
          (a: any) => a.description?.trim() === this.newQuestionAnswer?.trim()
        );
        if (isExistedAnsweer) {
          this.inValidNewQuestionAnswer = true;
        } else {
          this.inValidNewQuestionAnswer = false;
        }
      }
    }
    this.validateNewQuestion();
  }

  addNewQuestionAnswer() {
    this.newQuestionAnswers.push({
      description: this.newQuestionAnswer,
      isCorrect: false,
    });
    this.newQuestionAnswer = '';
    this.validateNewQuestion();
  }

  pickNewAnswersCorrectAnswer(i: number) {
    this.newQuestionAnswers.forEach((a, index) => {
      if (index === i) {
        a.isCorrect = true;
      } else {
        a.isCorrect = false;
      }
    });
    this.validateNewQuestion();
  }

  enableEditNewQuestionAnswer(answer: any, i: number) {
    this.isEditingNewQuestionAnswer = true;
    this.txtEditNewQuestionAnswer = answer.description;
    this.editingNewQuestionAnswerIndex = i;
  }

  getEditNewQuestionAnswer(i: number) {
    this.inValidNewQuestionEdittedAnswer = false;
    if (this.newQuestionAnswers) {
      var isExistedAnsweer = this.newQuestionAnswers.some(
        (a: any, index: number) =>
          a.description?.trim() === this.txtEditNewQuestionAnswer.trim() &&
          i !== index
      );
      if (isExistedAnsweer) {
        this.inValidNewQuestionEdittedAnswer = true;
      } else {
        this.inValidNewQuestionEdittedAnswer = false;
      }
    }
  }

  saveEditNewQuestionAnswer(i: number) {
    this.newQuestionAnswers[i].description = this.txtEditNewQuestionAnswer;
    this.isEditingNewQuestionAnswer = false;
  }

  disableEditNewQuestionAnswer() {
    this.isEditingNewQuestionAnswer = false;
    this.inValidNewQuestionEdittedAnswer = false;
  }

  deleteNewQuestionAnswer(i: number) {
    this.newQuestionAnswers.forEach((item, index) => {
      if (index === i) this.newQuestionAnswers.splice(index, 1);
    });
    this.validateNewQuestion();
  }

  addNewQuestionImage(event: any, newQuestionImageUploaded: any): void {
    this.newQuestionImgUrl =
      event.files[0].objectURL?.changingThisBreaksApplicationSecurity;
    this.newQuestionImgFile = event.files[0];
    newQuestionImageUploaded.clear();
    this.validateNewQuestion();
  }

  validateNewQuestion() {
    let hasCorrectAnswer = false;
    this.newQuestionAnswers.forEach((a: any) => {
      if (a.isCorrect) hasCorrectAnswer = true;
    });

    !this.inValidNewQuestionAnswer &&
    !this.inValidNewQuestionEdittedAnswer &&
    this.newQuestionContent?.trim() !== '' &&
    this.newQuestionAnswers?.length >= 2 &&
    hasCorrectAnswer
      ? (this.isValidNewQuestion = true)
      : (this.isValidNewQuestion = false);
  }

  resetDataCreateQuestion() {
    this.newQuestionName = undefined;
    this.newQuestionContent = '';
    this.newQuestionAnswers = [];
    this.newQuestionImgUrl = '';
    this.selectedAdmin = this.admins[0];
    this.selectedTestCategoryId = undefined;
    this.selectedQuestionCategoryId = undefined;
    this.displayCreateDialog = false;
    this.inValidNewQuestionContent = false;
    this.inValidNewQuestionAnswer = false;
    this.inValidNewQuestionEdittedAnswer = false;
    this.newQuestionImgFile = undefined;
  }

  createQuestion() {
    if (
      this.newQuestionImgFile !== undefined &&
      this.newQuestionImgUrl !== ''
    ) {
      this.fileUploadService
        .uploadImageToFirebase(this.newQuestionImgFile, `images/mock-test/new/`)
        .then((imgUrl: any) => {
          this.newQuestionImgUrl = imgUrl;
        })
        .then(() => {
          var newAnswers: any[] = [];
          this.newQuestionAnswers.forEach((a: any) => {
            newAnswers.push({
              description: a.description,
              isCorrect: a.isCorrect,
            });
          });

          this.newQuestion = {
            testCategoryId: this.selectedTestCategoryId,
            questionCategoryId: this.selectedQuestionCategoryId,
            content: this.newQuestionContent,
            imageUrl: this.newQuestionImgUrl,
            answers: newAnswers,
          };

          this.isLoadingService.add();
          this.wrapperService.post(
            paths.ScribeCreateQuestionForROM,
            this.newQuestion,
            getStorageToken(),
            {
              successCallback: (response1) => {
                this.wrapperService.post(
                  paths.ScribeCreateQuestionModificationRequest,
                  {
                    // create new question -> no modifiedQuestionId
                    modifyingQuestionId: response1.data.id,
                    scribeId: decodeToken(getStorageToken() || '')?.Id,
                    adminId: this.selectedAdmin.id,
                    operationType: OperationType.Add,
                  },
                  getStorageToken(),
                  {
                    successCallback: (response2) => {
                      //add notification
                      this.notiService.create({
                        subjectId: response2.data?.modifyingQuestionId,
                        subjectType: SubjectType.Question,
                        senderId: decodeToken(getStorageToken() || '')?.Id,
                        senderUsername: response2.data?.scribe?.username || '',
                        receiverId: this.selectedAdmin.id,
                        receiverUsername: this.selectedAdmin?.username || '',
                        action: commonStr.requestCreate,
                        relatedDescription: this.newQuestion?.content,
                        createdDate: new Date().toString(),
                        isRead: false,
                      });

                      this.resetDataCreateQuestion();
                      this.displayCreateDialog = false;
                      this.messageService.add({
                        key: 'createAddROMSuccess',
                        severity: 'success',
                        summary: commonStr.success,
                        detail: commonStr.romCreatedSuccessfully,
                      });
                      this.loadAdmins();
                      this.isLoadingService.remove();
                    },
                    errorCallback: (error) => {
                      console.log(error);
                      this.displayCreateDialog = false;
                      this.messageService.add({
                        key: 'createAddROMError',
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
                this.displayCreateDialog = false;
                this.messageService.add({
                  key: 'createAddROMError',
                  severity: 'error',
                  summary: commonStr.fail,
                  detail: commonStr.errorOccur,
                });
                this.isLoadingService.remove();
              },
            }
          );
        });
    } else {
      var newAnswers: any[] = [];
      this.newQuestionAnswers.forEach((a: any) => {
        newAnswers.push({
          description: a.description,
          isCorrect: a.isCorrect,
        });
      });

      this.newQuestion = {
        testCategoryId: this.selectedTestCategoryId,
        questionCategoryId: this.selectedQuestionCategoryId,
        content: this.newQuestionContent,
        answers: newAnswers,
      };

      this.isLoadingService.add();
      this.wrapperService.post(
        paths.ScribeCreateQuestionForROM,
        this.newQuestion,
        getStorageToken(),
        {
          successCallback: (response1) => {
            this.wrapperService.post(
              paths.ScribeCreateQuestionModificationRequest,
              {
                // create new question -> no modifiedQuestionId
                modifyingQuestionId: response1.data.id,
                scribeId: decodeToken(getStorageToken() || '')?.Id,
                adminId: this.selectedAdmin.id,
                operationType: OperationType.Add,
              },
              getStorageToken(),
              {
                successCallback: (response2) => {
                  //add notification
                  this.notiService.create({
                    subjectId: response2.data?.modifyingQuestionId,
                    subjectType: SubjectType.Question,
                    senderId: decodeToken(getStorageToken() || '')?.Id,
                    senderUsername: response2.data?.scribe?.username || '',
                    receiverId: this.selectedAdmin.id,
                    receiverUsername: this.selectedAdmin?.username || '',
                    action: commonStr.requestCreate,
                    relatedDescription: this.newQuestion?.content,
                    createdDate: new Date().toString(),
                    isRead: false,
                  });
                  this.resetDataCreateQuestion();
                  this.displayCreateDialog = false;
                  this.messageService.add({
                    key: 'createAddROMSuccess',
                    severity: 'success',
                    summary: commonStr.success,
                    detail: commonStr.romCreatedSuccessfully,
                  });
                  this.loadAdmins();
                  this.isLoadingService.remove();
                },
                errorCallback: (error) => {
                  console.log(error);
                  this.displayCreateDialog = false;
                  this.messageService.add({
                    key: 'createAddROMError',
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
            this.displayCreateDialog = false;
            this.messageService.add({
              key: 'createAddROMError',
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
}
