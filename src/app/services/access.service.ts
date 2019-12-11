import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AccessService implements CanActivate {

  baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  // !!! Delete when production ready!
  test(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/testing`).toPromise()
    );
  }

  // Perform user registration
  registerUser(form: NgForm): Promise<any> {
    return(
      this.http.post(`${this.baseURL}/api/registeruser`, form).toPromise()
    );
  }

  // Perform user login
  userLogin(form: NgForm): Promise<any> {
    return(
      this.http.post(`${this.baseURL}/api/authenticate`, form)
      .toPromise()
      .then(result => {
        // Set token and expiry datetime in localstorage
        this.setSession(result);
        // Implicit Promise.resolve()
        return ({ status: result['status'] });
      })
      .catch(err => {
        return Promise.reject({ status: err.status });
      })
    );
  }

  // Reference used for localStorage and HttpInterceptor:
  // https://blog.angular-university.io/angular-jwt-authentication/
  // Stores the JSON token in the local storage
  private setSession(authResult) {
    localStorage.setItem('access_token', authResult.access_token);
    // Convert to ms, then set value as string
    // m -> ms because getExpiration uses moment(), which requires 13 digit integers
    localStorage.setItem("expires_at", (authResult.expiresAt * 1000).toString() );
  }

  // Removes the token from the local storage
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
  }

  // Returns boolean true/false
  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  // Returns boolean true/false
  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = parseInt(expiration);
    return moment(expiresAt);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.isLoggedIn())
      this.router.navigate(['/login']);
    return (this.isLoggedIn())
  }

}
