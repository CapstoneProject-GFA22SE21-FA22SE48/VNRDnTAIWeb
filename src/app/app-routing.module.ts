import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LoginAuthGuard } from 'src/services/auth.service';
import { DashboardComponent as AdminDasboardComponent } from './pages/admin/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageRomsComponent } from './pages/admin/manage-roms/manage-roms.component';
import { ManageScribesComponent } from './pages/admin/manage-scribes/manage-scribes.component';
import { paths } from './utilities/paths.util';
import { ManageLawsComponent } from './pages/scribe/manage-laws/manage-laws.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ManageMembersComponent } from './pages/admin/manage-members/manage-members.component';
import { ManageSignsComponent } from './pages/scribe/manage-signs/manage-signs.component';
import { ManageQuestionsComponent } from './pages/scribe/manage-questions/manage-questions.component';
import { MyRequestComponent } from './pages/scribe/my-request/my-request.component';
import { ManageTaskComponent } from './pages/admin/manage-task/manage-task.component';
import { GpsRomsComponent } from './pages/scribe/gps-roms/gps-roms.component';
import { RetrainRomsComponent } from './pages/scribe/retrain-roms/retrain-roms.component';

const routes: Routes = [
  {
    path: paths.general.default,
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
  },
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
    path: paths.admin.manageMembers,
    component: ManageMembersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.admin.manageTask,
    component: ManageTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: paths.scribe.myRequests,
    component: MyRequestComponent,
    canActivate: [AuthGuard],
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
    path: paths.scribe.gpsRoms,
    component: GpsRomsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: paths.scribe.retrainRoms,
    component: RetrainRomsComponent,
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
