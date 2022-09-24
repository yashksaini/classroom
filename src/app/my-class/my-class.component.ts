import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-my-class',
  templateUrl: './my-class.component.html',
  styleUrls: ['./my-class.component.css'],
})
export class MyClassComponent implements OnInit {
  @Input('class') class: any;
  @Output('onDelete') onDelete = new EventEmitter();

  classData: any = {};
  user: any = {};

  constructor() {}

  ngOnInit() {
    this.classData = this.class.data();
    this.user = firebase.auth().currentUser;
  }
  /*
  delete() {
    firebase
      .firestore()
      .collection('classes')
      .doc(this.class.id)
      .delete()
      .then(() => {
        this.onDelete.emit();
      });
  }
  */
}
