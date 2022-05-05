import { Component, OnInit } from '@angular/core';

import { User } from 'src/models/user/user';
import { UserService } from 'src/models/user/user.service';

import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-new-device',
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.css', "../log-in.component.css"]
})
export class NewDeviceComponent implements OnInit {
  _user: User= new User({
    id: -1,
    pseudo:"",
    is_using_name: null,
    civility: "",
    name: "",
    surname: "",
    birthday: null,
    is_call_by_name: null,
    is_tu: null,
    pronum:"",
    talk_about_me: "",
    is_plural: null,
    activate:"",
    first_log_token: ""
  });
  constructor(
    private route: ActivatedRoute,
    private _userService: UserService,
    private router: Router,
  ) {

   }

  ngOnInit(): void {
    this._user.first_log_token = this.route.snapshot.paramMap.get("token") || "";
    this._userService.new_device(this._user).subscribe(
      (res: any) => { //On appelle de serveur 
        if (res.error) { //SI il renvoie une erreur nomée alors 
          
        }
        else { //SINON
          let user: User =  res; //On type la réponse
          if (user.id) { //SI le format est correct ALORS
            this._userService.save_user(user);
          }
        }
      },
      (err) => { //SI il y a une erreur http
        setTimeout(() => {
          this.router.navigate(['/door']);
        }, 2000);
        
      }
    );
    
  }

}
