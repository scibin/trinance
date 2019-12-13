import { Component } from '@angular/core';
import { AccessService } from './services/access.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trinance';

  private userStatusSub: Subscription;
  private firstNameSub: Subscription;
  displayName: string;
  userStatus = false;

  constructor(private accSvc: AccessService, private router: Router) {
    this.userStatusSub = this.router.events.subscribe(ev => {
      // Everytime a page is changed, check the login status
      if (ev instanceof NavigationEnd) {
        this.userStatus = this.accSvc.isLoggedIn();
      }
    })
    this.firstNameSub = this.accSvc.getFirstName().subscribe(data => {
      // Update the display name
      this.displayName = data;
    });
  }

  logout() {
    this.accSvc.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.userStatusSub.unsubscribe();
    this.firstNameSub.unsubscribe();
  }
}
