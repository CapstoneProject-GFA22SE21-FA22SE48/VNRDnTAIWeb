import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeAdminNoti = new EventEmitter();
  invokeScribeNoti = new EventEmitter();
  invokeScribeSidebar = new EventEmitter();

  //Admin notification clicked
  onAdminNotiClick(emittedRom: any) {
    this.invokeAdminNoti.emit(emittedRom);
  }

  //Scribe notification clicked
  onScribeNotiClick(emittedRom: any) {
    this.invokeScribeNoti.emit(emittedRom);
  }

  //Reload sidebar for scribe
  onScribeSidebarChange(){
    this.invokeScribeSidebar.emit();
  }

}
