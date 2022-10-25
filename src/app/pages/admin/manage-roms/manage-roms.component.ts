import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-manage-roms',
  templateUrl: './manage-roms.component.html',
  styleUrls: ['./manage-roms.component.css']
})
export class ManageRomsComponent implements OnInit {

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) { }

  ngOnInit(): void {
    this.loadRoms();
  }

  loadRoms(){
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetRomList + "/" + decodeToken(getStorageToken() || '').Id, getStorageToken(), {
      successCallback: (response) => {
        console.log(response);
        
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      }
    })
  }

}
