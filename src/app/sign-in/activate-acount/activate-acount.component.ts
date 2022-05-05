import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from 'src/models/user/user';
import { UserService } from 'src/models/user/user.service';

@Component({
  selector: 'app-activate-acount',
  templateUrl: './activate-acount.component.html',
  styleUrls: ['./activate-acount.component.css']
})
export class ActivateAcountComponent implements OnInit {

  _is_working = true;
  _has_error = false;
  _mail_not_exist = false;
  _tu = false;
  _user: User= new User( {
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
    activate:""
  }); 

  _is_already_activate = false;
  _no_activation = false;
  

  constructor(
    private route: ActivatedRoute,
    private _userService: UserService) { 
  }

  ngOnInit(): void {
      this._user.activate = this.route.snapshot.paramMap.get("token") || "";
      this._userService.activate_user(this._user).subscribe(
        (res: any) => { //On appelle de serveur 
          if (res.error) { //SI il renvoie une erreur nomée alors 
            if(res.error === "ACCOUNT IS ALREADY ACTIVATE") {
              this._has_error = true;
              this._is_already_activate = true;
              this._is_working = false;
            }
            else if (res.error === "NO ACCOUNT HAS THIS ACTIVATION TOKEN") {
              this._has_error = true;
              this._no_activation = true;
              this._is_working = false;
            }
          }
          else { //SINON
            let user: User =  res; //On type la réponse
            if (user.id) { //SI le format est correct ALORS
              this._has_error = false;
              this._is_working = false;
            }
            else {
              this._has_error = true;
              this._is_working = false;
            }
            
          }
        },
        (err) => { //SI il y a une erreur http
          this._has_error = true;
          this._is_working = false;
          console.log(err.message);
        }
      );
  }
}

  


