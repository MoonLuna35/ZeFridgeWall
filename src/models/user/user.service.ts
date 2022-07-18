import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { User } from './user';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost/OurFridgeWall/user/";
  

 optionRequete = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
    })
  };

  constructor(private http: HttpClient) 
  { }

  add_user(user: User) {
    return this.http.post(`${this.baseUrl}add_user`, { data: user }).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
  
  activate_user(user: User) {
    return this.http.post(`${this.baseUrl}activate_user`, { data: user }).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  save_user(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  log_in(user: User) {
    let payload = {
      data: {
        mail: user.mail,
        pass: user.pass
      }
    }
    console.log(user);
    return this.http.post(`${this.baseUrl}log-in`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        console.log(res['data']);
        return res['data'];
        
      })
    );
  }
  new_device(user: User) {
    const payload = {
      data: {
        first_log_token: user.first_log_token 
      }
    }
    console.log(user);
    return this.http.post(`${this.baseUrl}new_log`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      }) 
    );
  }

  log_out() {
    
    return this.http.post(`${this.baseUrl}log-out`, { }, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      }) 
    );
  }
  
}
