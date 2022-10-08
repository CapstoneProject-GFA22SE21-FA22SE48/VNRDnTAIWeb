import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { AnyARecord } from 'dns';
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
  testCategories: any = [{ name: 'A1' }, { name: 'A2' }, { name: 'B1, B2' }]; //used for filtering

  loadedTestCategories: any;
  selectedTestCategory: any; //used for creating new question

  filterTestCategory: any;
  searchStr: string = '';

  displayUpdateDialog: boolean = false;
  txtAnswerChange: string = '';
  isChanging: boolean = false;
  imageSrc: any;

  displayDeleteDialog: boolean = false;

  displayCreateDialog: boolean = false;
  newQuestion: any;
  isValidNewQuestionName: boolean = true;
  newQuestionName: any;
  newQuestionContent: string = '';
  newQuestionAnswer: any;
  editingNewQuestionAnswerIndex: any;
  txtEditNewQuestionAnswer: any;
  newQuestionAnswers: any[] = [];
  isEditingNewQuestionAnswer: boolean = false;
  newQuestionImgUrl: string = '';
  isValidNewQuestion: boolean = false;
  inValidMsg: string = `Vui lòng nhập: - Số câu 
                  - Nội dung 
                  - Tối thiểu 2 đáp án 
                  - Chọn đáp án đúng
                  - Hình ảnh đính kèm (nếu có)
  Để tiến hành tạo yêu cầu tạo mới câu hỏi
  `;

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
              this.loadedTestCategories = response.data;
              this.selectedTestCategory = this.loadedTestCategories[0];
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

  resetDataUpdateQuestion() {
    this.tmpSelectedQuestion = JSON.parse(
      JSON.stringify(this.selectedQuestion)
    );
    this.selectedAdmin = this.admins[0];
    this.displayUpdateDialog = false;
    this.isChanging = false;
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
                this.resetDataUpdateQuestion();
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
    let deleteQuestion = JSON.parse(JSON.stringify(this.selectedQuestion));

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

  checkNewQuestionName(event: any) {
    this.newQuestionName = event.value;
    let isDuplicated = false;

    this.tmpQuestions.forEach((q: Question) => {
      if (parseInt(q.name.split(' ')[1]) === parseInt(this.newQuestionName)) {
        isDuplicated = true;
      }
    });

    if (isDuplicated) {
      this.isValidNewQuestionName = false;
    } else {
      this.isValidNewQuestionName = true;
    }

    this.validateNewQuestion();
  }

  getNewQuestionContent(event: any) {
    this.newQuestionContent = event.target.value;
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

  saveEditNewQuestionAnswer(i: number) {
    this.newQuestionAnswers[i].description = this.txtEditNewQuestionAnswer;
    this.isEditingNewQuestionAnswer = false;
  }

  disableEditNewQuestionAnswer() {
    this.isEditingNewQuestionAnswer = false;
  }

  deleteNewQuestionAnswer(i: number) {
    this.newQuestionAnswers.forEach((item, index) => {
      if (index === i) this.newQuestionAnswers.splice(index, 1);
    });
    this.validateNewQuestion();
  }

  addNewQuestionImage(event: any, newQuestionImageUploaded: any): void {
    this.fileUploadService
      .uploadImageToFirebase(event.files[0])
      .then((imgUrl: any) => {
        this.newQuestionImgUrl = imgUrl;
        this.detectChange();
        newQuestionImageUploaded.clear();
      });
  }

  validateNewQuestion() {
    let hasCorrectAnswer = false;
    this.newQuestionAnswers.forEach((a: any) => {
      if (a.isCorrect) hasCorrectAnswer = true;
    });

    this.isValidNewQuestionName &&
    this.newQuestionName !== undefined &&
    this.newQuestion !== '' &&
    this.newQuestionContent !== '' &&
    this.newQuestionAnswers.length >= 2 &&
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
    this.selectedTestCategory = this.loadedTestCategories[0];
    this.isValidNewQuestionName = true;
    this.displayCreateDialog = false;
  }

  createQuestion() {
    var newAnswers: any[] = [];
    this.newQuestionAnswers.forEach((a: any) => {
      newAnswers.push({
        description: a.description,
        isCorrect: a.isCorrect,
      });
    });

    this.newQuestion = {
      testCategoryId: this.selectedTestCategory.id,
      name: 'Câu ' + this.newQuestionName,
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
        successCallback: (response) => {
          this.wrapperService.post(
            paths.ScribeCreateQuestionModificationRequest,
            {
              // create new question -> no modifiedQuestionId
              modifyingQuestionId: response.data.id,
              scribeId: decodeToken(getStorageToken() || '').Id,
              adminId: this.selectedAdmin.id,
              operationType: OperationType.Add,
            },
            getStorageToken(),
            {
              successCallback: (response) => {
                this.displayCreateDialog = false;
                this.messageService.add({
                  key: 'createAddROMSuccess',
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
