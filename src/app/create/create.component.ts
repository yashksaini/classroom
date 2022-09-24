import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { stringify } from 'querystring';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  user: any = {};
  myForm: FormGroup;

  message: string = '';
  errormessage: string = '';
  @Output('classCreated') classCreated = new EventEmitter();

  constructor(public fb: FormBuilder, public authService: AuthService) {
    this.myForm = this.fb.group({
      className: ['', [Validators.required]],
      subject: ['', [Validators.required]],
    });
    this.getProfile();
  }
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
      });
  }
  cCode: string;
  ngOnInit(): void {}
  createClass(createForm) {
    let className: string = createForm.value.className;
    let subject: string = createForm.value.subject;

    this.cCode = Math.random().toString(36).substr(2, 5);
    firebase
      .firestore()
      .collection('classes')
      .add({
        name: this.user.displayName,
        email: this.user.email,
        cCode: this.cCode,
        subject: subject,
        className: className,
        status: 'allow',
        type: 'teacher',
        owner: firebase.auth().currentUser.uid,
      })
      .then((data) => {
        console.log(data);
        this.classCreated.emit();
        this.message = 'Class Created Successfully';
      })
      .catch((error) => {
        console.log(error);
        this.errormessage = 'Try Again';
      });
  }
}
