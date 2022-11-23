import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { IsLoadingService } from '@service-work/is-loading';
import { map } from 'rxjs';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  account: any;
  decrees: any;
  originDecree: any;
  changeDecree: any;
  originDecreeTooltip: any;
  
  constructor(
    private router: Router,
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.getAccountInformation();
    this.afs.collection('decrees').snapshotChanges().pipe(
      map(changes =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.decrees = data;
      this.originDecree = this.decrees.filter((d: any) => d.isOrigin)[0];
      this.changeDecree = this.decrees.filter((d: any) => !d.isOrigin)[0];

      this.originDecreeTooltip = this.originDecree?.decreeName + ' sửa đổi bổ sung bởi ' + this.changeDecree?.decreeName;
    });
  }

  logOut() {
    sessionStorage.setItem('token', '');
    localStorage.setItem('token', '');
    this.router.navigate(['/']);
  }

  getAccountInformation() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.GetAccountInformation +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.account = response.data;          
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }

  openOriginDecree(){
    window.open(this.originDecree?.decreeLink);
  }

  openChangeDecree(){
    window.open(this.changeDecree?.decreeLink);
  }
}
