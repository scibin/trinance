import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccessService } from '../services/access.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginStatus = 0;

  constructor(private accSvc: AccessService, private router: Router) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    this.accSvc.userLogin(form.value)
      .then(result => {
        // 0 means successful login
        if (result.status === 0) {
          // !!! Reroute to 2FA
          this.router.navigate(['/user/dashboard']);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          // Toggle text in login page to inform user of wrong email/password
          this.loginStatus = 1;
        }
        if (error.status === 500) {
          this.loginStatus = 2;
        }
      });
  }
}
