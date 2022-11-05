import { Component, OnInit, ViewChild } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //Chart all members by years
  chartAllMemberLabels: string[] = [];
  chartAllMemberDatasetData: number[] = [];
  chartAllMemberData: any;
  totalUser: number = 0;

  //Chart new members by month year
  chartNewMemberLabels: string[] = [];
  chartNewMemberDatasetData: number[] = [];
  chartNewMemberData: any;
  newUser: number = 0;
  monthYearPickNewMember: Date = new Date();

  //Chart Rom by month year of adminId
  chartRomLabels: string[] = [];
  chartRomDatasetData: number[] = [];
  chartRomData: any;
  romReportDTO: any;
  monthYearPickRom: Date = new Date();

  //Scribe report
  scribeReportDTO: any;
  monthYearPickScribe: Date = new Date();

  lineChartOptions: any;
  barChartOptions: any;

  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {
    this.lineChartOptions = {
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

    this.barChartOptions = {
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
      new Date().getMonth() + 1, //month start from 0
      new Date().getFullYear()
    );
    this.loadRomChart(
      new Date().getMonth() + 1, //month start from 0
      new Date().getFullYear()
    );
    this.loadScribeReport(
      new Date().getMonth() + 1, //month start from 0
      new Date().getFullYear()
    )
  }

  loadChartAllMemberData() {
    this.isLoadingService.add();
    this.wrapperService.get(paths.AdminGetAllMemberDataReport, getStorageToken(), {
      successCallback: (response) => {
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
      paths.AdminGetNewMemberDataReport + '/' + month + '/' + year,
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
                backgroundColor: '#C9F5B6',
                borderColor: '#8BE78B',
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

  loadRomChart(month: number, year: number){
    this.chartRomLabels = [];
    this.chartRomDatasetData = [];
    this.chartRomData = undefined;

    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetRomReport + '/' + month + '/' + year + '/' + decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.romReportDTO = response.data;
          this.chartRomDatasetData.push(this.romReportDTO.totalRomCount);
          this.chartRomDatasetData.push(this.romReportDTO.pendingRomCount);
          this.chartRomDatasetData.push(this.romReportDTO.approvedRomCount);
          this.chartRomDatasetData.push(this.romReportDTO.deniedRomCount);
          this.chartRomDatasetData.push(this.romReportDTO.confirmedRomCount);
          this.chartRomDatasetData.push(this.romReportDTO.cancelledRomCount);

          this.chartRomData = {
            labels: ['Tổng số', 'Đang chờ', 'Đã duyệt', 'Đã từ chối', 'Đã xử lý', 'Đã bị hủy'],
            datasets: [
              {
                label: 'Số lượng',
                data: this.chartRomDatasetData,
                backgroundColor: ['#75C6FF', '#DBEE98', '#4FE884', '#FF8780', '#BF9EEE', '#C09553'],
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

  loadScribeReport(month: number, year: number){
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.AdminGetScribeReport + '/' + month + '/' + year,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.scribeReportDTO = response.data;          
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
      parseInt(this.monthYearPickNewMember.toLocaleDateString('sv').slice(5, 7)),
      parseInt(this.monthYearPickNewMember.toLocaleDateString('sv').slice(0, 4))
    );
  }

  renderNewRomChart(){
    this.loadRomChart(
      parseInt(this.monthYearPickRom.toLocaleDateString('sv').slice(5, 7)),
      parseInt(this.monthYearPickRom.toLocaleDateString('sv').slice(0, 4))
    );
  }

  renderNewScribeReport(){
    this.loadScribeReport(
      parseInt(this.monthYearPickScribe.toLocaleDateString('sv').slice(5, 7)),
      parseInt(this.monthYearPickScribe.toLocaleDateString('sv').slice(0, 4))
    );
  }

}
