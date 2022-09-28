import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageRomsComponent } from './pages/manage-roms/manage-roms.component';
import { ManageScribesComponent } from './pages/manage-scribes/manage-scribes.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { paths } from './utilities/paths.util';

const routes: Routes = [
  {
    path: paths.general.default,
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: paths.general.auth.login,
    component: LoginComponent,
    // canActivate: [LoginAuthGuard],
  },
  {
    path: paths.general.profile,
    component: ProfileComponent,
    // canActivate: [LoginAuthGuard],
  },
  {
    path: paths.admin.dashboard,
    component: DashboardComponent,
    // canActivate: [LoginAuthGuard],
  },
  {
    path: paths.admin.manageScribes,
    component: ManageScribesComponent,
    // canActivate: [LoginAuthGuard],
  },
  {
    path: paths.admin.manageRoMs,
    component: ManageRomsComponent,
    // canActivate: [LoginAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
