import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { verifyToken } from 'src/app/utilities/jwt.util';
import { getUserRole } from 'src/app/utilities/localStorage.util';

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

  return(){
    if (verifyToken()) {
      if (getUserRole() != null && getUserRole() === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (getUserRole() != null && getUserRole() === 1) {
        this.router.navigate(['/scribe/manage-laws']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

}
