import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  message: string;

  constructor() {
    this.getProfile();
  }

  ngOnInit() {}

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

  update() {
    this.message = 'Updating Profile...';

    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
      })
      .then(() => {
        let userId = firebase.auth().currentUser.uid;
        firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
          })
          .then(() => {
            this.message = 'Profile Updated Successfully.';
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
