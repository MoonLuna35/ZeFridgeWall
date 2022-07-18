import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/models/user/user.service';
import { User } from 'src/models/user/user';
import { Subject } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private user_serv: UserService,
    private router: Router){

  }

  canActivate(
    
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      var subject = new Subject<boolean>();
      const str_user = localStorage.getItem("user");
      if (str_user) {
        const user: User = JSON.parse(str_user); 
        if (user.token) {
          return true;
        }
      }
      this.router.navigate(["welcome"]);
      return false;
     
  }
}
