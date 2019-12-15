import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from '../services/access.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationStatus = 0;

  constructor(private accSvc: AccessService, private router: Router) { }

  ngOnInit() {
  }

  register(form: NgForm) {
    this.accSvc.registerUser(form.value)
      .then(result => {
        // If registration is successful, go to login page
        if (result.status === 0) {
          this.router.navigate(['/login']);
          form.reset();
        }
      })
      .catch(err => {
        // Separate status to indicate catch error
        this.registrationStatus = 1;
      });
  }
}
