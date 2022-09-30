import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ManageScribesComponent } from './pages/manage-scribes/manage-scribes.component';
import { ManageRomsComponent } from './pages/manage-roms/manage-roms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationCentreComponent } from './pages/notification-centre/notification-centre.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

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
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
