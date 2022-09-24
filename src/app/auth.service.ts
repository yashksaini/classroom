import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  signup(
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          response.user
            .updateProfile({
              displayName: first_name + ' ' + last_name,
              photoURL:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgziHQ3ubr4WDBvytWcg7e4_abFkjHTXahdQ&usqp=CAU',
            })
            .then(() => {
              resolve(response.user);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
}
