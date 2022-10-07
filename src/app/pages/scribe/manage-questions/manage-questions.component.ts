import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OperationType } from 'src/app/common/operationType';
import {
  Answer,
  Question,
  TestCategory,
  User,
} from 'src/app/models/General.model';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { vietNameseNormalize } from 'src/app/utilities/string.util';
import { FileUploadService } from 'src/services/file-upload.service';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css'],
})
export class ManageQuestionsComponent implements OnInit {
  questions: Question[] = [];
  tmpQuestions: Question[] = [];
  testCats: TestCategory[] = [];
  selectedQuestion: any;
  tmpSelectedQuestion: any;
  testCategories: any = [{ name: 'A1' }, { name: 'A2' }, { name: 'B1, B2' }];

  filterTestCategory: any;
  searchStr: string = '';

  displayUpdateDialog: boolean = false;
  txtAnswerChange: string = '';
  isChanging: boolean = false;
  imageSrc: any;

  displayDeleteDialog: boolean = false;

  displayCreateDialog: boolean = false;
  newQuestion: any;

  admins: User[] = [];
  selectedAdmin: any;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.loadAdmins();
  }

  loadQuestions() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.ScribeGetQuestions, getStorageToken(), {
      successCallback: (response) => {
        this.questions = response.data;
        this.tmpQuestions = response.data;
        this.wrapperService.get(
          paths.ScribeGetTestCategories,
          getStorageToken(),
          {
            successCallback: (response) => {
              this.questions.forEach((q) => {
                response.data.forEach((r: any) => {
                  if (r.id === q.testCategoryId) q.testCategory = r;
                });
              });
            },
            errorCallback: (error) => {
              console.log(error);
            },
          }
        );
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
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

  changeCategory() {
    this.filterData();
  }

  filterData() {
    this.questions = this.tmpQuestions;

    //Search
    if (this.searchStr != '') {
      this.questions = this.questions.filter(
        (q) =>
          q.content?.toLowerCase().includes(this.searchStr.toLowerCase()) ||
          q.name?.toLowerCase().includes(this.searchStr.toLowerCase())
      );
    } else {
      this.questions = this.tmpQuestions;
    }

    //Filter test category
    if (this.filterTestCategory?.name === 'A1') {
      this.questions = this.questions.filter((q) => {
        q.testCategory.name === 'A1';
      });
    } else if (this.filterTestCategory?.name === 'A2') {
      this.questions = this.questions.filter((q) => {
        q.testCategory.name === 'A2';
      });
    } else if (this.filterTestCategory?.name === 'B1,B2') {
      this.questions = this.questions.filter((q) => {
        q.testCategory.name === this.filterTestCategory?.name;
      });
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

  detectChange() {
    if (
      JSON.stringify(this.selectedQuestion) !==
      JSON.stringify(this.tmpSelectedQuestion)
    ) {
      this.isChanging = true;
    } else {
      this.isChanging = false;
    }
  }

  changeTxtQuestionContent(newQuestionContent: string) {
    this.tmpSelectedQuestion.content = newQuestionContent;
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

  changeTxtAnswer(answer: Answer, newAnswer: string) {
    this.tmpSelectedQuestion.answers.forEach((a: Answer) => {
      if (a.id === answer.id) {
        if (a.description !== newAnswer.trim()) {
          a.description = newAnswer;
          this.isChanging = true;
        } else {
          this.isChanging = false;
        }
      }
    });
    this.detectChange();
  }

  updateImage(event: any, imageUploaded: any): void {
    this.fileUploadService
      .uploadImageToFirebase(event.files[0])
      .then((imgUrl: any) => {
        this.tmpSelectedQuestion.imageUrl = imgUrl;
        this.detectChange();
        imageUploaded.clear();
      });
  }

  addImage(event: any, imageUploaded: any): void {
    // this.fileUploadService
    //   .uploadImageToFirebase(event.files[0])
    //   .then((imgUrl: any) => {
    //     this.tmpSelectedQuestion.imageUrl = imgUrl;
    //     this.detectChange();
    //     imageUploaded.clear();
    //   });
  }

  updateQuestion() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateQuestionForROM,
      this.tmpSelectedQuestion,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateQuestionModificationRequest,
            {
              modifiedQuestionId: this.selectedQuestion.id,
              modifyingQuestionId: response.data.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Update,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayUpdateDialog = false;
                this.messageService.add({
                  key: 'createUpdateROMSuccess',
                  severity: 'success',
                  summary: 'Thành công',
                  detail: 'Yêu cầu đã được tạo thành công',
                });
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

  deleteQuestion() {
    this.tmpSelectedQuestion.isDeleted = true;
    this.tmpSelectedQuestion.answers.forEach((a: Answer) => {
      a.isDeleted = true;
    })

    this.isLoadingService.add();
    this.wrapperService.post(
      paths.ScribeCreateQuestionForROM,
      this.tmpSelectedQuestion,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateQuestionModificationRequest,
            {
              modifiedQuestionId: this.selectedQuestion.id,
              modifyingQuestionId: response.data.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Delete,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayDeleteDialog = false;
                this.messageService.add({
                  key: 'createDeleteROMSuccess',
                  severity: 'success',
                  summary: 'Thành công',
                  detail: 'Yêu cầu đã được tạo thành công',
                });
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
}
