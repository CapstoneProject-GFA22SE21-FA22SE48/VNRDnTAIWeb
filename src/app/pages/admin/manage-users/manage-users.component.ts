import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { User, Comment } from 'src/app/models/General.model';
import { getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  members: User[] = [];
  status: any = [
    {
      name: 'Hoạt động',
    },
    { name: 'Ngưng hoạt động' },
  ];

  selectedMember: User | undefined;
  userComments: Comment[] = [];

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetMembers, getStorageToken(), {
      successCallback: (response) => {
        this.members = response.data;
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  viewInfo(member: User) {
    this.isLoadingService.add();
    this.selectedMember = member;

    this.wrapperService.get(
      paths.AdminGetMemberComments + '/' + this.selectedMember.id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.userComments = response.data;
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
    this.selectedMember = undefined;
  }
}
