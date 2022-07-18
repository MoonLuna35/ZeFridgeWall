import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInValidators } from 'src/app/controlers/sign-in-validators';
import {Router, ActivatedRoute} from '@angular/router';

import { User } from 'src/models/user/user';
import { UserService } from 'src/models/user/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  log_in_form: FormGroup;
  hide = true;
  is_new_device = false;
  submited = false;

  _user: User = new User({ 
    id: -1,
    pseudo: "", 
    is_using_name: null,
    civility: "",
    name: "",
    surname: "",
    birthday: null,
    mail: "",
    tel: "",
    pass: "", 
    is_double_auth: null,
    is_call_by_name: null,
    is_tu: null,
    pronum: "",
    talk_about_me: "",
    is_plural: null,
  });
  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.log_in_form = this.formBuilder.group({
      mail: ["", Validators.compose([
        Validators.required, 
        Validators.email])
      ],
      pass: ["", Validators.compose([
        Validators.required,
        SignInValidators.passValidator(),
        Validators.minLength(8)])
      ]
    }); //On crée le formulaire
      
  }


  log_in() {
    
    this._userService.log_in(this._user).subscribe(
      (res: any) => { //On appelle de serveur 
        if (res.status) { //SI il renvoie une erreur nomée alors 
          if(res.status === "NEW PLACE") {
            this.is_new_device = true;
          }
        }
        else { //SINON
          let user: User =  res; //On type la réponse
          if (user.token) { //SI le format est correct ALORS
            this._userService.save_user(user);
            this.router.navigate(['/door']);
          }
          
        }
      },
      (err) => { //SI il y a une erreur http
        console.log(err); //On l'affiche
      }
      
  );
  }
  
  ngOnInit(): void {
    this.hide =  true;
  }

  public onSubmit(event: Event) {
    event.preventDefault();

    if (this.log_in_form.valid === true || 1===1) { //SI le formulaire est valide ALORS
      this._user.mail = this.log_in_form.get("mail")?.value;
      this._user.pass = this.log_in_form.get("pass")?.value;
      
      this.log_in(); 
      this.submited=true;
    } 
  }

}
