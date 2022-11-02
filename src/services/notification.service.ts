import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Notification } from 'src/app/models/General.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private dbPath = '/notifications';

  notificationsRef: AngularFireList<Notification>;

  constructor(private db: AngularFireDatabase) {
    this.notificationsRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Notification> {
    return this.notificationsRef;
  }

  create(notification: Notification): any {
    return this.notificationsRef.push(notification);
  }

  update(subjectId: string, value: any): Promise<void> {
    return this.notificationsRef.update(subjectId, value);
  }
}