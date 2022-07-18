import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class RootGuard implements CanActivate {
  constructor(
    private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const str_user = localStorage.getItem("user");
      if (str_user) {
        const user: User = JSON.parse(str_user); 
        if (user.is_root === true) {
          return true;
        }
      }
      this.router.navigate(["/door"]);
      return false;
  }
   
}
