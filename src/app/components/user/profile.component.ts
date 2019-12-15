import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PROFILE } from 'src/app/models';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // Minimum age
  minAge = 21;
  maxDate = moment().subtract(this.minAge, 'years');
  // maxDate2 = (new Date()).setFullYear( (new Date()).getFullYear() - this.minAge );

  // Initialize the form
  profileForm: FormGroup;

  // Form editable status
  canEditForm = false;

  // Update status
  updateStatus = '';

  constructor(private fb: FormBuilder, private accSvc: AccessService) { }

  ngOnInit() {
    this.profileForm = this.createForm();
    this.accSvc.getUserProfile()
      .then(result => {
        const profile: PROFILE = result.data[0];
        this.profileForm.patchValue(profile);
        // Disable form for editing
        this.profileForm.disable();
      });
  }

  private createForm(): FormGroup {
    return(
      // each of these takes one control
      this.fb.group({
        firstName: this.fb.control('', [Validators.required]),
        lastName: this.fb.control('', [Validators.required]),
        dob: this.fb.control(this.maxDate.toDate()),
        country: this.fb.control(null),
        phone: this.fb.control(null),
        // !!! Radio buttons not working as intended
        mailPreferences: this.fb.control(0)
      })
    );
  }

  updateFavourites() {
    const profile: PROFILE = {
      firstName: this.profileForm.value['firstName'],
      lastName: this.profileForm.value['lastName'],
      dob: (isNaN(moment(this.profileForm.value['dob']).unix())) ? null : moment(this.profileForm.value['dob']).unix(),
      country: this.profileForm.value['country'],
      phone: this.profileForm.value['phone'],
      mailPreferences: this.profileForm.value['mailPreferences']
    };
    this.accSvc.updateUserProfile(profile)
      .then(result => {
        this.updateStatus = 'Success!';
      })
      .catch(err => {
        this.updateStatus = 'Something went wrong, please try again';
      });
  }

  // Toggles the edit functionality
  toggleForm() {
    if (this.canEditForm) {
      this.profileForm.disable();
      this.canEditForm = false;
    } else {
      this.profileForm.enable();
      this.canEditForm = true;
    }
  }

}
