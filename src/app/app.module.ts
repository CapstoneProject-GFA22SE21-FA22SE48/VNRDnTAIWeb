import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ManageScribesComponent } from './pages/admin/manage-scribes/manage-scribes.component';
import { ManageRomsComponent } from './pages/admin/manage-roms/manage-roms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationCentreComponent } from './pages/notification-centre/notification-centre.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ManageLawsComponent } from './pages/scribe/manage-laws/manage-laws.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomepageComponent,
    ManageScribesComponent,
    ManageRomsComponent,
    NotificationCentreComponent,
    ProfileComponent,
    SidebarComponent,
    ManageLawsComponent,
    SpinnerComponent,
    NotFoundComponent
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
    MessageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
