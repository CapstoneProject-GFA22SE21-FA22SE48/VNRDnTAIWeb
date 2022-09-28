export class FileUpload {
  key: string = '';
  name: string = '';
  url: string = '';
  file: File;
  constructor(file: File) {
    this.file = file;
  }
}

export const parentFolders = {
  uImg: "profilePictures",
  cv: "cvs",
};
