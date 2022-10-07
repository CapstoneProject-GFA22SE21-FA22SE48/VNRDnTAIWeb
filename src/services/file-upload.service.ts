import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
    downloadURL: any;

  constructor(
    private storage: AngularFireStorage
  ) {}

  uploadImageToFirebase(file: any): Promise<string> {
    var n = Date.now();
    const filePath = `images/mock-test/${file.name}_${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return new Promise((resolve) => {
      task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              resolve(url);
            }
          });
        })
      )
      .subscribe((error) => {
          // console.log(error);
      });
    })
  }
}
