import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ManageScribesComponent } from './pages/admin/manage-scribes/manage-scribes.component';
import { ManageRomsComponent } from './pages/admin/manage-roms/manage-roms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationCentreComponent } from './pages/notification-centre/notification-centre.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { ManageLawsComponent } from './pages/scribe/manage-laws/manage-laws.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AvatarModule } from 'primeng/avatar';
import { HeaderComponent } from './shared/layout/header/header.component';
import { ManageMembersComponent } from './pages/admin/manage-members/manage-members.component';
import { ManageSignsComponent } from './pages/scribe/manage-signs/manage-signs.component';
import { ManageQuestionsComponent } from './pages/scribe/manage-questions/manage-questions.component';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import {InputTextareaModule} from 'primeng/inputtextarea';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ScrollerModule } from 'primeng/scroller';
import { DatePipe } from './shared/pipes/date.pipe';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MyRequestComponent } from './pages/scribe/my-request/my-request.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import {InputNumberModule} from 'primeng/inputnumber';
import { SafePipe } from './shared/pipes/safe.pipe';
import {TooltipModule} from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ManageTaskComponent } from './pages/admin/manage-task/manage-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { GpsRomsComponent } from './pages/scribe/gps-roms/gps-roms.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ManageScribesComponent,
    ManageRomsComponent,
    NotificationCentreComponent,
    SidebarComponent,
    ManageLawsComponent,
    SpinnerComponent,
    NotFoundComponent,
    HeaderComponent,
    ManageMembersComponent,
    ManageSignsComponent,
    ManageQuestionsComponent,
    DatePipe,
    MyRequestComponent,
    SafePipe,
    ManageTaskComponent,
    GpsRomsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    MessagesModule,
    MessageModule,
    AvatarModule,
    MenuModule,
    SidebarModule,
    BadgeModule,
    FontAwesomeModule,
    ChartModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ScrollerModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextareaModule,
    RadioButtonModule,
    FileUploadModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule,
    InputNumberModule,
    TooltipModule,
    ChipModule,
    AutoCompleteModule,
    DragDropModule,
    MonacoEditorModule.forRoot(),
    ConfirmPopupModule
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(librabry: FaIconLibrary) {
    librabry.addIconPacks(fas, far);
  }
}
