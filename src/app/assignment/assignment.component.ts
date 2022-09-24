import { Component, OnInit, NgZone } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  currentUserID: string;
  assignmentId: string;
  assignments: any[] = [];
  currentClass: string;
  studentClass: any[] = [];
  current: any[] = [];
  currentUserClasses: any[] = [];
  totalStudents: number;
  currentUser: string;
  submitMessage: string = '';
  dueDate = Date();
  submit: any[] = [];
  assignmentSubmit: number;
  submitlength: number;
  submitby: any[] = [];
  currentName: string;
  deleteAssignment: string = '';
  teacherA: any[] = [];
  teacherS: number;

  submitAssignment: FormGroup;

  status: boolean = true;
  current1: string[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public ngZone: NgZone,
    public fb: FormBuilder,
    public authService: AuthService
  ) {
    this.submitAssignment = this.fb.group({
      link: ['', [Validators.required]],
      desc: ['', [Validators.required]],
    });
    let userId = firebase.auth().currentUser.uid;
    this.currentUserID = userId;

    let assignmentId =
      this.activatedRoute.snapshot.paramMap.get('assignmentId');
    this.assignmentId = assignmentId;
    {
      /* Current User Assignment Submitted or not */
      firebase
        .firestore()
        .collection('assignments')
        .where('owner', '==', userId)
        .where('type', '==', 'student')
        .where('assignmentId', '==', assignmentId)
        .get()
        .then((querySnapshot) => {
          this.submit = querySnapshot.docs;
          this.assignmentSubmit = this.submit.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      /* Assignment Submitted By */
      firebase
        .firestore()
        .collection('assignments')
        .where('type', '==', 'student')
        .where('assignmentId', '==', assignmentId)
        .get()
        .then((querySnapshot) => {
          this.submitby = querySnapshot.docs;
          this.submitlength = this.submitby.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      firebase
        .firestore()
        .collection('assignments')
        .where('assignmentId', '==', assignmentId)
        .where('type', '==', 'teacher')
        .get()
        .then((querySnapshot) => {
          this.assignments = querySnapshot.docs;
          for (let currentClass of this.assignments) {
            this.currentClass = currentClass.data().cCode;
            this.dueDate = currentClass.data().dueDate;
          }
          {
            /* Current User Classes Joined and Created */
            firebase
              .firestore()
              .collection('classes')
              .where('owner', '==', userId)
              .where('status', '==', 'allow')
              .get()
              .then((querySnapshot) => {
                this.currentUserClasses = querySnapshot.docs;
                for (let current of this.currentUserClasses) {
                  current = current.data().cCode;
                  /* To Store every value in the array */
                  this.current1.push(current);
                }
                if (this.current1.indexOf(this.currentClass) == -1) {
                  this.status = false;
                } else {
                  this.status = true;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
          {
            // get the list of students
            firebase
              .firestore()
              .collection('classes')
              .where('cCode', '==', this.currentClass)
              .where('type', '==', 'student')
              .where('status', '==', 'allow')
              .get()
              .then((querySnapshot) => {
                this.studentClass = querySnapshot.docs;
                this.totalStudents = this.studentClass.length;
              })
              .catch((err) => {
                console.log(err);
              });
          }
          {
            // get the teacher of assignment
            firebase
              .firestore()
              .collection('assignments')
              .where('assignmentId', '==', assignmentId)
              .where('type', '==', 'teacher')
              .get()
              .then((querySnapshot) => {
                this.teacherA = querySnapshot.docs;
                this.teacherS = this.teacherA.length;
              })
              .catch((err) => {
                console.log(err);
              });
          }
          {
            // get the current User Type
            firebase
              .firestore()
              .collection('classes')
              .where('cCode', '==', this.currentClass)
              .where('owner', '==', userId)
              .get()
              .then((querySnapshot) => {
                this.current = querySnapshot.docs;
                for (let currentUser of this.current) {
                  this.currentUser = currentUser.data().type;
                  this.currentName = currentUser.data().name;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ngOnInit(): void {}
  subAssignment(submitAssignment) {
    let content: string = submitAssignment.value.desc;
    let link: string = submitAssignment.value.link;
    firebase
      .firestore()
      .collection('assignments')
      .add({
        user: this.currentName,
        desc: content,
        name: link,
        assignmentId: this.assignmentId,
        cCode: this.currentClass,
        type: 'student',
        createDate: firebase.firestore.FieldValue.serverTimestamp(),
        owner: firebase.auth().currentUser.uid,
      })
      .then((data) => {
        console.log(data);
        this.submitMessage = 'Posted Successfully.  Refresh the page.';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  removeAssign(id) {
    firebase
      .firestore()
      .collection('assignments')
      .doc(id)
      .delete()
      .then(() => {
        this.deleteAssignment =
          'Assignment removed Successfully. Refresh the page.';
      });
  }
}
