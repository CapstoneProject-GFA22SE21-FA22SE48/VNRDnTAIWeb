export interface AjaxCallback {
  successCallback: (
    response: any,
    textStatus: string | null,
    XMLHttpRequest: XMLHttpRequest | null
  ) => void;
  errorCallback: (
    errorThrown: string,
    textStatus: string,
    XMLHttpRequest: XMLHttpRequest
  ) => void;
}
