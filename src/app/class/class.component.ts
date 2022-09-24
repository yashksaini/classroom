import { Component, OnInit } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
})
export class ClassComponent implements OnInit {
  user: any = {};
  classes: any[] = [];
  students: any[] = [];
  requestSend: any[] = [];
  totalreq: number;
  leaveSuccess: string = '';

  constructor() {
    this.user = firebase.auth().currentUser;
    this.getClasses();
    this.getStudents();
    {
      firebase
        .firestore()
        .collection('classes')
        .where('type', '==', 'student')
        .where('status', '==', 'restrict')
        .where('owner', '==', this.user.uid)
        .get()
        .then((querySnapshot) => {
          this.requestSend = querySnapshot.docs;
          this.totalreq = this.requestSend.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ngOnInit(): void {}
  getClasses() {
    // get the list of classes
    firebase
      .firestore()
      .collection('classes')
      .where('type', '==', 'teacher')
      .get()
      .then((querySnapshot) => {
        this.classes = querySnapshot.docs;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getStudents() {
    // get the list of classes
    firebase
      .firestore()
      .collection('classes')
      .where('type', '==', 'student')
      .get()
      .then((querySnapshot) => {
        this.students = querySnapshot.docs;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onStudentCreated() {
    // refresh the list of classes

    this.getStudents();
    this.students = [];
  }
  onClassCreated() {
    // refresh the list of classes
    this.getClasses();
    this.classes = [];
  }
  onDelete() {
    // refresh the list of classes
    this.classes = [];
    this.getClasses();
  }
  leave(id) {
    firebase
      .firestore()
      .collection('classes')
      .doc(id)
      .delete()
      .then(() => {
        this.leaveSuccess = 'Class Exited Successfully';
      });
  }
}
