import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken, verifyLocalStorageToken, verifySessionStorageToken } from 'src/app/utilities/jwt.util';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  returnHome(){
    if (verifySessionStorageToken()) {
      const token = sessionStorage.getItem('token')
      if (parseInt(decodeToken(token ? token : '')?.Role) === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (parseInt(decodeToken(token ? token : '')?.Role) === 1) {
        this.router.navigate(['/scribe/my-request']);
      }
    } else if (verifyLocalStorageToken()) {
      const token = localStorage.getItem('token')
      if (decodeToken(token ? token : '')?.Role === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (decodeToken(token ? token : '')?.Role === 1) {
        this.router.navigate(['/scribe/my-request']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

}
