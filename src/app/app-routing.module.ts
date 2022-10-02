import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LoginAuthGuard } from 'src/services/auth.service';
import { DashboardComponent as AdminDasboardComponent } from './pages/admin/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageRomsComponent } from './pages/admin/manage-roms/manage-roms.component';
import { ManageScribesComponent } from './pages/admin/manage-scribes/manage-scribes.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { paths } from './utilities/paths.util';
import { ManageLawsComponent } from './pages/scribe/manage-laws/manage-laws.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent as ScribeDashboardComponent } from './pages/scribe/dashboard/dashboard.component';
import { ManageUsersComponent } from './pages/admin/manage-users/manage-users.component';
import { ManageSignsComponent } from './pages/scribe/manage-signs/manage-signs.component';
import { ManageQuestionsComponent } from './pages/scribe/manage-questions/manage-questions.component';

const routes: Routes = [
  // {
  //   path: paths.general.default,
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: paths.general.default,
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
  },
  // {
  //   path: paths.general.profile,
  //   component: ProfileComponent,
  //   // canActivate: [LoginAuthGuard],
  // },

  {
    path: paths.admin.dashboard,
    component: AdminDasboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.admin.manageScribes,
    component: ManageScribesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.admin.manageRoMs,
    component: ManageRomsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.admin.manageUsers,
    component: ManageUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.scribe.dashboard,
    component: ScribeDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: paths.scribe.manageLaws,
    component: ManageLawsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: paths.scribe.manageSigns,
    component: ManageSignsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: paths.scribe.manageQuestions,
    component: ManageQuestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: paths.general.notFound,
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
