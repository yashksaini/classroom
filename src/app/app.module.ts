import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyClassComponent } from './my-class/my-class.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateComponent } from './create/create.component';
import { ClassComponent } from './class/class.component';
import { JoinComponent } from './join/join.component';
import { TeacherComponent } from './teacher/teacher.component';
import { JoinclassComponent } from './joinclass/joinclass.component';
import { EditComponent } from './edit/edit.component';
import { AssignmentComponent } from './assignment/assignment.component';

let firebaseConfig = {
  apiKey: 'AIzaSyBbHCQQ-TybD3ShtYEIY3Eeubm1Gp_nEb0',
  authDomain: 'signup-cbcaa.firebaseapp.com',
  databaseURL: 'https://signup-cbcaa.firebaseio.com',
  projectId: 'signup-cbcaa',
  storageBucket: 'signup-cbcaa.appspot.com',
  messagingSenderId: '966010309771',
  appId: '1:966010309771:web:c62d432e2c2a1805b5d88e',
  measurementId: 'G-ZYJHV8VVZR',
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent,
    MyClassComponent,
    ProfileComponent,
    CreateComponent,
    ClassComponent,
    JoinComponent,
    TeacherComponent,
    JoinclassComponent,
    EditComponent,
    AssignmentComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
