import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  error = '';

  constructor(private router: Router, private firebaseAuth: AngularFireAuth) {}

  login(username: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(username, password).then(
      credential => {
        console.log(credential);
        this.router.navigate(['chat']);
      },
      err => {
        this.error = err.message || 'Unknown error';
      }
    );
  }
}
