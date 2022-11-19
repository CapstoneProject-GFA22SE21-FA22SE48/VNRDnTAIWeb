import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import { getStorageToken } from 'src/app/utilities/jwt.util';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Status } from 'src/app/common/status';
import * as commonStr from '../../../common/commonStr';
@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})

export class ManageTaskComponent implements OnInit {

  allTasks: any;
  unAssignedTasks: any;
  assignedTasks: any;

  scribes: any;
  tmpScribes: any;
  connectedTo: string[] = [];

  isChanged: boolean = false;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
   }

  ngOnInit(): void {
    this.loadAllTasks();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.detectChange();
  }

  loadScribe() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetScribes, getStorageToken(), {
      successCallback: (response) => {
        this.scribes = [];
        response.data?.filter((s: any) => s.status === Status.Active).forEach((scribe: any) => {
          this.scribes.push({
            id: scribe.id,
            username: scribe.username,
            taskList: []
          })
        });

        this.assignedTasks.forEach((at: any) => {
          this.scribes.forEach((s: any) => {
            if(s.taskList === undefined || s.taskList === null){
              s.taskList = [];
            } else if(at.scribeId === s.id){
              s.taskList.push({taskId: at.taskId, taskName: at.taskName, scribeId: s.id});
            }
          })
        });
        
        var uTasks: any[] = [];
        this.unAssignedTasks.forEach((ut: any) => {
          uTasks.push({taskId: ut.taskId, taskName: ut.taskName, scribeId: null})
        })

        var emptyScribe = {
          id: "00000000-0000-0000-0000-000000000000",
          username: null,
          taskList: uTasks
        }
        this.scribes.push(emptyScribe);

        this.tmpScribes = JSON.parse(JSON.stringify(this.scribes));

        this.scribes.forEach((s: any) => {
          this.connectedTo.push(s.id)
        });

        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    });
  }

  //including assigned and unassigned tasks
  loadAllTasks() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetTasks, getStorageToken(), {
      successCallback: (response) => {
        this.allTasks = response.data;
        this.assignedTasks = [];
        this.unAssignedTasks = [];
        response.data.forEach((task: any) => {
          if(task.isAssigned){
            this.assignedTasks.push(task);
          } else {
            this.unAssignedTasks.push(task);
          }
        });

        this.loadScribe();
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    })
  }

  detectChange(){
    if(JSON.stringify(this.scribes) !== JSON.stringify(this.tmpScribes)){
      this.isChanged = true;
    } else {
      this.isChanged = false;
    }
  }

  resetScribes(){
    this.scribes = JSON.parse(JSON.stringify(this.tmpScribes));
    this.isChanged = false;
  }

  confirmApproveSaveChange(event: any) {
    this.confirmationService.confirm({
      target: event?.target,
      key: 'confirmApprove',
      message: `Thao tác này sẽ cập nhật danh sách quản lý của các nhân viên \n. Bạn có chắc?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var taskDTOList: any[] = [];
        this.scribes.forEach((s: any) => {
          if(s.username !== null){//filter unAssigedTasks that set to an empty scribe before
            s.taskList?.forEach((t:any) => {
              taskDTOList.push({
                taskId: t.taskId,
                scribeId: s.id
              })
            });
          }
        });

        this.isLoadingService.add();
        this.wrapperService.post(paths.AdminUpdateAssignedTasks, taskDTOList, getStorageToken(), {
          successCallback: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: commonStr.success,
              detail: commonStr.dataUpdatedSuccessfully,
            });
            this.loadAllTasks();
            this.isLoadingService.remove();
          }, 
          errorCallback: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: commonStr.fail,
              detail: error?.response?.data || commonStr.errorOccur,
            });
            this.isLoadingService.remove();
          }
        })
      },
      reject: () => {},
    });
  }

}
