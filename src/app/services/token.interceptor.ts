import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { AccessService } from './access.service';
import { Observable } from 'rxjs';
// import {  } from 'rxjs/Observable';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private accSvc: AccessService) {}

    // Attribution for http interceptor references:
    // https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
    // https://blog.angular-university.io/angular-jwt-authentication/

    intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem('access_token');

        if (idToken) {
            const cloned = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            return next.handle(cloned);
        } else {
            return next.handle(request);
        }
    }
}
