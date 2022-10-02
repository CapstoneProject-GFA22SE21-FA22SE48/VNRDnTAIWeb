import { Injectable } from '@angular/core';
import { Callback } from 'src/app/models/Callback.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WrapperService {
  constructor() {}

  private fetchApi(
    url: string,
    body: string | null,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    token: string | null,
    callbacks: Callback
   ) {
    axios({
      method: method,
      url: url,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response: any) => {
        callbacks.successCallback(response?.value ? response?.value : response);
      })
      .catch((error: any) => {
        callbacks.errorCallback(error);
      });
  }

  get(url: string, token: string | null, callbacks: Callback) {
    this.fetchApi(url, null, 'GET', token, callbacks);
  }

  post(url: string, body: object, token: string | null, callbacks: Callback) {
    this.fetchApi(url, JSON.stringify(body), 'POST', token, callbacks);
  }

  put(
    url: string,
    body: object | null,
    token: string | null,
    callbacks: Callback
  ) {
    this.fetchApi(url, JSON.stringify(body), 'PUT', token, callbacks);
  }

  delete(url: string, token: string | null, callbacks: Callback) {
    this.fetchApi(url, null, 'DELETE', token, callbacks);
  }
}
