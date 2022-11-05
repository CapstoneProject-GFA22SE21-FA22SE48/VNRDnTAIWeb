import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { IsLoadingService } from '@service-work/is-loading';
import { map, Observable } from 'rxjs';
import { SubjectType } from 'src/app/common/subjectType';
import { Notification } from 'src/app/models/General.model';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { EventEmitterService } from 'src/services/event-emitter.service';
import { NotificationService } from 'src/services/notification.service';

@Component({
  selector: 'app-notification-centre',
  templateUrl: './notification-centre.component.html',
  styleUrls: ['./notification-centre.component.css'],
})
export class NotificationCentreComponent implements OnInit {
  notifications: Notification[] = [];
  tmpNotifications: Notification[] = [];
  unReadNotifications: Notification[] = [];
  receiverId: string = '';

  isShowingNotifications: boolean = false;

  isAllNoti: boolean = true;
  isUnReadNoti: boolean = false;

  selectedNotiKey: string = '';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    // this.notifications = [];
    // this.unReadNotifications = [];
    this.receiverId = decodeToken(getStorageToken() || '')?.Id;

    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data: any) => {
        this.notifications = [];
        this.unReadNotifications = [];
        data.forEach((d: any) => {
          if (d.receiverId === this.receiverId) {
            this.notifications.push(d);
            this.tmpNotifications.push(d);
            if (!d.isRead) {
              this.unReadNotifications.push(d);
            }
          }
        });
      });
  }

  showNotifications() {
    if (this.isShowingNotifications === true) {
      this.isShowingNotifications = false;
    } else {
      this.isShowingNotifications = true;
    }
  }

  viewAllNoti() {
    this.isAllNoti = true;
    this.notifications = this.tmpNotifications.slice();
  }

  viewUnReadNoti() {
    this.isAllNoti = false;

    this.notifications = this.unReadNotifications.slice();
  }

  //clicked on notification
  viewInfo(noti: Notification) {
    if (!noti.isRead) {
      noti.isRead = true;
    }

    this.notificationService.update(noti.key || '', { isRead: true });

    this.isShowingNotifications = false;

    //admin role -> view Rom from scribe
    if (parseInt(decodeToken(getStorageToken() || '')?.Role) === 0) {
      if (
        noti.subjectType === SubjectType.Statue ||
        noti.subjectType === SubjectType.Section ||
        noti.subjectType === SubjectType.Paragraph
      ) {
        this.router.navigate(['/admin/manage-roms']).then(() => {
          this.eventEmitterService.onAdminNotiClick({
            lawRomId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Sign) {
        this.router.navigate(['/admin/manage-roms']).then(() => {
          this.eventEmitterService.onAdminNotiClick({
            modifyingSignId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Gpssign) {
        this.router.navigate(['/admin/manage-roms']).then(() => {
          this.eventEmitterService.onAdminNotiClick({
            modifyingGpssignId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Question) {
        this.router.navigate(['/admin/manage-roms']).then(() => {
          this.eventEmitterService.onAdminNotiClick({
            modifyingQuestionId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Promotion) {
        this.router.navigate(['/admin/manage-roms']).then(() => {
          this.eventEmitterService.onAdminNotiClick({
            modifyingUserId: noti.subjectId,
          });
        });
      }
    } else if (parseInt(decodeToken(getStorageToken() || '')?.Role) === 1) {
      //scribe role -> view admin approvement/denial
      if (noti.subjectType === SubjectType.Statue) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingStatueId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Section) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingSectionId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Paragraph) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingParagraphId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Sign) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingSignId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Gpssign) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingGpssignId: noti.subjectId,
          });
        });
      } else if (noti.subjectType === SubjectType.Question) {
        this.router.navigate(['/scribe/my-request']).then(() => {
          this.eventEmitterService.onScribeNotiClick({
            modifyingQuestionId: noti.subjectId,
          });
        });
      }
    }
  }
}
