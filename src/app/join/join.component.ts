import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { AuthService } from '../auth.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
})
export class JoinComponent implements OnInit {
  myForm: FormGroup;
  user: any = {};
  joined: any = {};
  message: string = '';
  errormessage: string = '';
  classData: any = {};
  @Output('studentCreated') studentCreated = new EventEmitter();

  constructor(public fb: FormBuilder, public authService: AuthService) {
    this.myForm = this.fb.group({
      className: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      cCode: ['', [Validators.required]],
    });

    this.getProfile();
  }

  /* Get the profile of the current user */
  getProfile() {
    let userId = firebase.auth().currentUser.uid;

    firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then((documentSnapshot) => {
        this.user = documentSnapshot.data();
        this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
        this.user.id = documentSnapshot.id;
      })
      .catch((error) => {
        console.log(error);
        this.errormessage = error;
      });
  }

  ngOnInit(): void {}
  createStudent(joinForm) {
    let className: string = joinForm.value.className;
    let cCode: string = joinForm.value.cCode;
    let subject: string = joinForm.value.subject;
    /* Get All Classes data to check uniquness of student in the class */
    let query = firebase.firestore().collection('classes');
    let query2 = query.where('cCode', '==', cCode);
    query2.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        this.errormessage = 'Class Code Invalid Try Again';
      } else {
        let query1 = query
          .where('cCode', '==', cCode)
          .where('owner', '==', firebase.auth().currentUser.uid);

        query1.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            firebase
              .firestore()
              .collection('classes')
              .add({
                name: this.user.displayName,
                email: this.user.email,
                cCode: cCode,
                subject: subject,
                className: className,
                status: 'restrict',
                type: 'student',
                owner: firebase.auth().currentUser.uid,
              })
              .then((data) => {
                console.log(data);
                this.studentCreated.emit();
                this.message = 'Join Request send Successfully';
              })
              .catch((error) => {
                console.log(error);
                this.errormessage = 'Try Again';
              });
          } else {
            this.errormessage = 'Already in the Class';
          }
        });
      }
    });
  }
}
