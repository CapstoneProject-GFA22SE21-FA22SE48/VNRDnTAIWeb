import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  isLoading: Observable<boolean> | any;

  constructor(private isLoadingService: IsLoadingService) { }

  ngOnInit(): void {
    this.isLoading = this.isLoadingService.isLoading$();
  }

}
