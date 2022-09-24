import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ClassComponent } from './class/class.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateComponent } from './create/create.component';
import { TeacherComponent } from './teacher/teacher.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from './auth.guard';
import { AssignmentComponent } from './assignment/assignment.component';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'class',
    component: ClassComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher',
    redirectTo: 'class',
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher/:classId',
    component: TeacherComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:classId',
    component: EditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'assignment/:assignmentId',
    component: AssignmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
