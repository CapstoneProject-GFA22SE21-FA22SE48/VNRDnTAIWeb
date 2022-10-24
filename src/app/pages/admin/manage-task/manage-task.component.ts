import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, Column, AssignedColumn } from 'src/app/models/General.model';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
import { getStorageToken } from 'src/app/utilities/jwt.util';

import { DragDropModule } from 'primeng/dragdrop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})

export class ManageTaskComponent implements OnInit {

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadColumns();
    this.loadAssignedColumns();
    console.log('loadCollum');
  }

  scribes: User[] = [];
  columns: Column[] = [];
  assignedColumn: AssignedColumn[] = [];

  selectedColumns: Column[] = [];
  draggedColumn: any = null;

  loadColumns() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetColumns, getStorageToken(), {
      successCallback: (response) => {
        this.columns = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    });
  }

  
  scribe01 = ['6', '7', '8', '9', '10'];
  scribe02 = ['1', '2', '3', '4', '5'];
  unassignedColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  loadAssignedColumns() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetAssignedColumns, getStorageToken(), {
      successCallback: (response) => {
        this.assignedColumn = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    });
  }

  loadScribe() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetScribes, getStorageToken(), {
      successCallback: (response) => {
        this.scribes = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    });
  }


}
