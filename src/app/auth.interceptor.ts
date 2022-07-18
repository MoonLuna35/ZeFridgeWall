import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpResponse,
  } from "@angular/common/http"
  import { Observable, of } from "rxjs"
  import { User } from "src/models/user/user";
  import { Injectable } from '@angular/core';
  import { tap, map } from 'rxjs/operators';
  import { Router } from '@angular/router';
  import { UserService } from 'src/models/user/user.service';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(
      private router: Router, 
      private userService: UserService
      ) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const str_user = localStorage.getItem("user");
      if (str_user) {
        const user: User = JSON.parse(str_user); 
        if (user.token) {

          req = req.clone({ headers: req.headers.set('Authorization', "Bearer " + user.token)});
        } 
      }
      return next.handle(req).pipe(tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            
              if (event.body.data !== undefined && event.body.data['user'] !== undefined) {
                    let user: User = event.body.data['user'];
                    this.userService.save_user(user);
                    
              }
          }
          return event;
        },
        (err: any) => {
          if(err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              localStorage.removeItem("user");
              this.router.navigate(['login']);
            }
            else if(err.status === 404) {
              console.log("dsdsd");
              this.router.navigate(['door']);
            }
          }
        }
        ));
    }
  }
    