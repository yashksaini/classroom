import {
  Component,
  OnInit,
  NgZone,
  Input,
  ɵsetCurrentInjector,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  assignments: any[] = [];
  teacherClass: any[] = [];
  studentClass: any[] = [];
  currentUserClasses: any[] = [];
  requests: any[] = [];
  material: any[] = [];
  status: boolean = true;
  current1: string[] = [];
  notices: any[] = [];
  assignment_list: any[] = [];
  totalStudents: number;
  totalrequests: number;
  currentUser: string;
  temail: string;
  currentStudent: any[] = [];
  materialForm: FormGroup;
  noticeForm: FormGroup;
  assignmentForm: FormGroup;
  addMaterial: string = '';
  deleteSuccess: string = '';
  allowMessage: string = '';
  currentUserID: string;
  addNotice: string = '';
  deleteNotice1: string = '';
  Assignment: string = '';
  currentName: string;
  deleteSt: string = '';

  text: string;
  user: any = {};
  class: any = {};
  classId: string = ' ';
  classCode: string;
  classOwner: string;
  constructor(
    public activatedRoute: ActivatedRoute,
    public ngZone: NgZone,
    public fb: FormBuilder,
    public authService: AuthService
  ) {
    this.materialForm = this.fb.group({
      material_des: ['', [Validators.required]],
      material_link: ['', [Validators.required]],
    });
    this.noticeForm = this.fb.group({
      content: ['', [Validators.required]],
    });
    this.assignmentForm = this.fb.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      currentDate: ['', [Validators.required]],
    });
    let userId = firebase.auth().currentUser.uid;
    this.currentUserID = userId;

    let classId = this.activatedRoute.snapshot.paramMap.get('classId');
    this.classId = classId;
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
      /* Student Requests  */
      firebase
        .firestore()
        .collection('classes')
        .where('status', '==', 'restrict')
        .where('cCode', '==', classId)
        .get()
        .then((querySnapshot) => {
          this.requests = querySnapshot.docs;
          this.totalrequests = this.requests.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      /* To Get The current user Type */
      firebase
        .firestore()
        .collection('classes')
        .where('cCode', '==', classId)
        .where('owner', '==', userId)
        .get()
        .then((querySnapshot) => {
          this.currentUserClasses = querySnapshot.docs;
          for (let type_user of this.currentUserClasses) {
            this.currentUser = type_user.data().type;
            this.currentName = type_user.data().name;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      /* To Get All Class Notices */
      firebase
        .firestore()
        .collection('notices')
        .orderBy('created', 'desc')
        .where('cCode', '==', classId)
        .get()
        .then((querySnapshot) => {
          this.notices = querySnapshot.docs;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    {
      // get the list of classes
      firebase
        .firestore()
        .collection('classes')
        .where('cCode', '==', classId)
        .where('type', '==', 'teacher')
        .get()
        .then((querySnapshot) => {
          this.teacherClass = querySnapshot.docs;
          for (let teacherEmail of this.teacherClass) {
            this.temail = teacherEmail.data().email;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      // get the list of material Created
      firebase
        .firestore()
        .collection('materials')
        .where('cCode', '==', classId)
        .get()
        .then((querySnapshot) => {
          this.material = querySnapshot.docs;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    {
      // get the list of assignments
      firebase
        .firestore()
        .collection('assignments')
        .orderBy('createDate', 'desc')
        .where('cCode', '==', classId)
        .where('type', '==', 'teacher')
        .get()
        .then((querySnapshot) => {
          this.assignment_list = querySnapshot.docs;
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
        .where('cCode', '==', classId)
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
      /* get the details of current student with this class */
      firebase
        .firestore()
        .collection('classes')
        .where('cCode', '==', classId)
        .where('type', '==', 'student')
        .where('owner', '==', userId)
        .get()
        .then((querySnapshot) => {
          this.currentStudent = querySnapshot.docs;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ngOnInit() {}

  createMaterial(materialForm) {
    let desc: string = materialForm.value.material_des;
    let link: string = materialForm.value.material_link;

    firebase
      .firestore()
      .collection('materials')
      .add({
        desc: desc,
        link: link,
        cCode: this.classId,
        type: 'teacher',
        owner: firebase.auth().currentUser.uid,
      })
      .then((data) => {
        console.log(data);
        this.addMaterial = 'Material Added Successfully. Refresh the page.';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  createAssignment(assignmentForm) {
    let desc: string = assignmentForm.value.desc;
    let name: string = assignmentForm.value.name;
    let currentDate: string = assignmentForm.value.currentDate;
    let assignment_Code = Math.random().toString(36).substr(2, 5);

    firebase
      .firestore()
      .collection('assignments')
      .add({
        user: this.currentName,
        desc: desc,
        name: name,
        assignmentId: assignment_Code,
        cCode: this.classId,
        type: 'teacher',
        dueDate: currentDate,
        createDate: firebase.firestore.FieldValue.serverTimestamp(),
        owner: firebase.auth().currentUser.uid,
      })
      .then((data) => {
        console.log(data);
        this.Assignment = 'Assignment Created Successfully. Refresh the page.';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  createNotice(noticeForm) {
    let content: string = noticeForm.value.content;

    firebase
      .firestore()
      .collection('notices')
      .add({
        content: content,
        owner: this.currentUserID,
        cCode: this.classId,
        type: 'teacher',
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((data) => {
        console.log(data);
        this.addNotice = 'Posted Successfully.  Refresh the page.';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deletematerial(id) {
    firebase
      .firestore()
      .collection('materials')
      .doc(id)
      .delete()
      .then(() => {
        this.deleteSuccess =
          'Material removed Successfully. Refresh the page. ';
      });
  }
  allowStudent(id) {
    firebase
      .firestore()
      .collection('classes')
      .doc(id)
      .update({
        status: 'allow',
      })
      .then(() => {
        this.allowMessage = 'Allowed Successfully';
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deleteNotice(id) {
    firebase
      .firestore()
      .collection('notices')
      .doc(id)
      .delete()
      .then(() => {
        this.deleteNotice1 = 'Notice  removed Successfully. Refresh the page.';
      });
  }
  deleteStudent(id) {
    firebase
      .firestore()
      .collection('classes')
      .doc(id)
      .delete()
      .then(() => {
        this.deleteSt = 'Student Remove Successfully. Refresh the page.';
      });
  }
}
