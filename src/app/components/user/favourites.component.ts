import { Component, OnInit } from '@angular/core';
import { EthService } from 'src/app/services/eth.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Fave, FaveDetail } from '../../models';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  // Initialize containers
  userInput: string;
  favourites: Fave;

  // Initialize the form
  favForm: FormGroup;
  faveDetails: FormArray;

  // Form editable status
  canEditForm = false;

  // Error message if load fails
  loadErrMsg = '';

  constructor(private ethSvc: EthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.faveDetails = this.fb.array([]);
    this.favForm = this.createForm(this.faveDetails);
    // Loads the user's favourites list
    this.ethSvc.getUserFavouritesList()
      .then(result => {
        // Patch values only if there
        if (result.data.faveDetails.length) {
          this.favourites = result.data;
          // this.favForm.patchValue({  })
          this.favourites.faveDetails.forEach((entry, idx) => {
            this.faveDetails.push(this.patchfaveDetails(
              entry.tag, entry.ethAddress, entry.notes, entry.fav_details_id,
              this.favourites.ethBalanceArr[idx]
            ));
          });
        }
        // Disable form for editing
        this.favForm.disable();
      })
      .catch(err => {
        this.loadErrMsg = 'Something went wrong, please reload the page and try again.';
      });
  }

  updateFavourites() {
    // Initialize favourites object
    const favourites: Fave = {
      faveDetails: []
    };
    // 'for' loop to push each faveDetail in
    for (let g = 0; g < this.faveDetails.length; g++) {
      const fg: FormGroup = this.faveDetails.controls[g] as FormGroup;
      favourites.faveDetails.push({
        tag: fg.value['tag'],
        ethAddress: fg.value['ethAddress'],
        notes: fg.value['notes']
      } as FaveDetail);
    }
    this.ethSvc.updateUserFavouritesList(favourites)
      .then(result => {
        this.canEditForm = false;
        this.favForm.disable();
      })
      .catch(err => { this.loadErrMsg = 'Something went wrong, please try again!'; } );
  }

  addfaveDetails() {
    // IMPT NOTE: faveDetails is not an array, but it has a push method!
    this.faveDetails.push(this.createfaveDetails());
    // this.faveDetails.length will increase
  }

  deleteItem(index) {
    // Delete button only works if form is enabled
    if (this.canEditForm) {
      this.faveDetails.removeAt(index);
    }

  }

  private createfaveDetails(): FormGroup {
    return (
      this.fb.group({
        tag: this.fb.control('', [ Validators.required, Validators.maxLength(32) ]),
        ethAddress: this.fb.control('', [ Validators.required, Validators.minLength(42), Validators.maxLength(42) ]),
        notes: this.fb.control(''),
        fav_details_id: this.fb.control(null),
        balance: this.fb.control(null)
      })
    );
  }

  private patchfaveDetails(tag: string, ethAddress: string, notes: string, fav_details_id: number, balance: string): FormGroup {
    return (
      this.fb.group({
        tag: this.fb.control(tag, [ Validators.required, Validators.maxLength(32) ]),
        ethAddress: this.fb.control(ethAddress, [ Validators.required, Validators.minLength(42), Validators.maxLength(42) ]),
        notes: this.fb.control(notes),
        fav_details_id: this.fb.control(fav_details_id),
        balance: this.fb.control(balance)
      })
    );
  }

  // We can pass in a FormArray called faveDetails. If not passed in, use this.fb.array([])
  private createForm(faveDetails: FormArray = null): FormGroup {
    return(
      // each of these takes one control
      this.fb.group({
         faveDetails: faveDetails || this.fb.array([])
      })
    );
  }

  // Toggles the edit functionality
  toggleForm() {
    if (this.canEditForm) {
      this.favForm.disable();
      this.canEditForm = false;
    } else {
      this.favForm.enable();
      this.canEditForm = true;
    }
  }
}
