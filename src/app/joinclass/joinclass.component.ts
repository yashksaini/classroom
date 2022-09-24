import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-joinclass',
  templateUrl: './joinclass.component.html',
  styleUrls: ['./joinclass.component.css'],
})
export class JoinclassComponent implements OnInit {
  @Input('class') class: any;

  studentData: any = {};
  user: any = {};

  constructor() {}

  ngOnInit() {
    this.studentData = this.class.data();
    this.user = firebase.auth().currentUser;
  }
}
