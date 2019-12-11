import { Component } from '@angular/core';
import { AccessService } from './services/access.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trinance';

  constructor(private accSvc: AccessService, private router: Router) {}

  logout() {
    this.accSvc.logout();
    this.router.navigate(['/']);
  }
}
