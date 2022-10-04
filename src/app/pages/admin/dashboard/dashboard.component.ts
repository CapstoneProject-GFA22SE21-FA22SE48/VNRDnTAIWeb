import { Component, OnInit } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  chartUserByYearLabels: string[] = [];
  chartUserByYearDatasetData: number[] = [];
  chartUserByYearData: any;
  totalUser: number = 0;

  chartOptions: any;
  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {
    this.chartOptions = {
      legend: {display: false}
    }
  }

  ngOnInit(): void {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminUserByYear,
      getStorageToken(),
      {
        successCallback: (response) => {
          response.data?.userByYear?.forEach((e: string) => {
            this.chartUserByYearLabels.push(e.split('-')[0]);
            this.chartUserByYearDatasetData.push(parseInt(e.split('-')[1]));
            this.totalUser += parseInt(e.split('-')[1]);
          });
          this.chartUserByYearData = {
            labels: this.chartUserByYearLabels,
            datasets: [
              {
                label: 'Thành viên',
                data: this.chartUserByYearDatasetData,
                fill: true,
                backgroundColor: "#CFEBFF",
                borderColor: '#0E9CFF',
                tension: .4,
              },
            ]
          };
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }
}
