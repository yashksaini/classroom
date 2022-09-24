import { Component, OnInit, NgZone } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  user: any = {};
  message: string;
  classId: string = ' ';
  currentStudent: any[] = [];
  currentUserClasses: any[] = [];
  status: boolean = true;
  current1: string[] = [];
  currentClassId: string;
  totalStudents: any[] = [];

  /* Joined Class Variables */
  jcCode: string;
  jname: string;
  jcName: string;
  jsubject: string;
  jtype: string;
  currentID: string;
  deleteSt: string = '';
  lengthStudent: number;

  constructor(public activatedRoute: ActivatedRoute, public ngZone: NgZone) {
    let classId = this.activatedRoute.snapshot.paramMap.get('classId');
    this.classId = classId;
    let userId = firebase.auth().currentUser.uid;

    {
      /* Current User Classes Joined and Created */
      firebase
        .firestore()
        .collection('classes')
        .where('owner', '==', userId)
        .get()
        .then((querySnapshot) => {
          this.currentUserClasses = querySnapshot.docs;
          for (let current of this.currentUserClasses) {
            current = current.data().cCode;
            /* To Store every value in the array */
            this.current1.push(current);
          }
          if (this.current1.indexOf(this.classId) == -1) {
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
      /* get the details of Joined Class */
      firebase
        .firestore()
        .collection('classes')
        .where('cCode', '==', classId)
        .where('type', '==', 'student')
        .get()
        .then((querySnapshot) => {
          this.totalStudents = querySnapshot.docs;
          this.lengthStudent = this.totalStudents.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    {
      /* get the details of Joined Class */
      firebase
        .firestore()
        .collection('classes')
        .where('cCode', '==', classId)
        .where('owner', '==', userId)
        .get()
        .then((querySnapshot) => {
          this.currentStudent = querySnapshot.docs;
          for (let joined of this.currentStudent) {
            this.currentID = joined.id;
            this.jcCode = joined.data().cCode;
            this.jname = joined.data().name;
            this.jcName = joined.data().className;
            this.jsubject = joined.data().subject;
            this.jtype = joined.data().type;
            this.currentClassId = joined.id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ngOnInit() {}

  updateClassDetatils() {
    this.message = 'Updateding Class Details.';
    firebase
      .firestore()
      .collection('classes')
      .doc(this.currentClassId)
      .update({
        name: this.jname,
        className: this.jcName,
        subject: this.jsubject,
      })
      .then(() => {
        this.message = 'Class Details Updated Successfully.';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deleteStudent(id) {
    firebase
      .firestore()
      .collection('classes')
      .doc(id)
      .delete()
      .then(() => {
        this.deleteSt = 'Class left successfully. Refresh the page.';
      });
  }
}
