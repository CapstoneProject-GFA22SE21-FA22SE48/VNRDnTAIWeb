import { Component, OnInit, ViewChild } from '@angular/core';
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
  chartAllMemberLabels: string[] = [];
  chartAllMemberDatasetData: number[] = [];
  chartAllMemberData: any;
  totalUser: number = 0;

  chartNewMemberLabels: string[] = [];
  chartNewMemberDatasetData: number[] = [];
  chartNewMemberData: any;
  newUser: number = 0;
  monthYearPick: any;
  @ViewChild('calendar') private calendar: any;
  currentMonthYear: string =
    new Date().getMonth() + '/' + new Date().getFullYear();

  chartOptions: any;
  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {
    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 1
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadChartAllMemberData();
    this.loadChartNewMemberData(
      new Date().getMonth(),
      new Date().getFullYear()
    );
  }

  loadChartAllMemberData() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetAllMemberData, getStorageToken(), {
      successCallback: (response) => {
        console.log(response);

        response.data?.membersByYear?.forEach((e: string) => {
          this.chartAllMemberLabels.push(e.split('-')[0]);
          this.chartAllMemberDatasetData.push(parseInt(e.split('-')[1]));
          this.totalUser += parseInt(e.split('-')[1]);
        });
        this.chartAllMemberData = {
          labels: this.chartAllMemberLabels,
          datasets: [
            {
              label: 'Thành viên',
              data: this.chartAllMemberDatasetData,
              fill: true,
              backgroundColor: '#CFEBFF',
              borderColor: '#0E9CFF',
              tension: 0.4,
            },
          ],
        };
        this.isLoadingService.remove();
      },
      errorCallback: (error) => {
        console.log(error);
        this.isLoadingService.remove();
      },
    });
  }

  loadChartNewMemberData(month: number, year: number) {
    this.chartNewMemberLabels = [];
    this.chartNewMemberDatasetData = [];
    this.chartNewMemberData = undefined;
    this.newUser = 0;
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetNewMemberData + '/' + month + '/' + year,
      getStorageToken(),
      {
        successCallback: (response) => {
          response.data?.newMembersByDay?.forEach((e: string) => {
            this.chartNewMemberLabels.push(e.split('-')[0]);
            this.chartNewMemberDatasetData.push(parseInt(e.split('-')[1]));
            this.newUser += parseInt(e.split('-')[1]);
          });
          this.chartNewMemberData = {
            labels: this.chartNewMemberLabels,
            datasets: [
              {
                label: 'Thành viên',
                data: this.chartNewMemberDatasetData,
                fill: true,
                backgroundColor: '#CFEBFF',
                borderColor: '#0E9CFF',
                tension: 0.4,
              },
            ],
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

  renderNewMemberChart() {
    this.loadChartNewMemberData(
      this.monthYearPick.toLocaleDateString('sv').slice(5, 7),
      this.monthYearPick.toLocaleDateString('sv').slice(0, 4)
    );
  }
}
