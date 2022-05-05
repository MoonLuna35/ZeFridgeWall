import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Event as NavigationEvent } from "@angular/router";
import { XOR } from '../controlers/boolean';
import { regEx } from '../controlers/regEx';
import { ErrorStateMatcher } from '@angular/material/core';



/** Error when the parent is invalid */
class MailErrorMatcher implements ErrorStateMatcher {
  
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean { 
    return (form?.form.get("login")?.get("mail")?.dirty && form?.form.get("login")?.get("mailRe")?.dirty && form?.form.getError("MailNotMatch"))
      ||
      control?.dirty && control?.touched && control?.invalid;
      ;
  } 
}

/** Error when the parent is invalid */
class PwdErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return (form?.form.get("login")?.get("pass")?.dirty && form?.form.get("login")?.get("passRe")?.dirty && form?.form.getError("PassNotMatch"))
      ||
      control?.dirty && control?.touched && control?.invalid;
      ;
  } 
}
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],

  
})
export class SignInComponent implements OnInit{
  public loading: boolean = true; //chargement de la page
  public working: boolean = true; //envoie des donnees au serveur

  public mail_already_used: boolean = false; //Le serveur a revoyer que le mail est deja utilise
  public step: String = "infos"; //L'etape de l'inscription
  public signInForm: FormGroup; //Le formulaire
  public today:Date = new Date(); //Le date d'aujourd'hui

  errorMailMatcher = new MailErrorMatcher();
  errorPsssMatcher = new PwdErrorMatcher();

  //Alias a supprimer 
  public use_name: boolean = false;
  public double_auth: boolean = false;

  constructor(
    

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.signInForm = this.formBuilder.group({
      login: this.formBuilder.group({
        mail: ["", Validators.compose([
          Validators.required,
          Validators.pattern(regEx.MAIL_PATERN)
        ])],
        mailRe: ["", Validators.compose([
          Validators.required,
          Validators.pattern(regEx.MAIL_PATERN)
        ])],
        double_auth: [false, Validators.required],
        tel_prefix: ["+33", Validators.required],
        tel: ["", Validators.compose([
          Validators.required,
          this.telPaternValidator()
        ])],
        pass: ["", Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.pwdStrengthEnough()
        ])],
        passRe: ["", Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.pwdStrengthEnough()
        ])],
      }
      ),
      userDetails: this.formBuilder.group({
        mail: ["", Validators.required],
        is_using_name: [false, Validators.required],
        civility: ["", Validators.required],
        name: ["", Validators.required],
        surname: ["", Validators.required],
        birthday: ["", Validators.required],
        pronum: ["", Validators.required]
      }),
      options: this.formBuilder.group({
        is_call_by_name: [false, Validators.required],
        is_tu: [false, Validators.required],
        talk_about_me: ["neutral", Validators.required],
        is_plural: [false, Validators.required],

      }),
    }, {validators: [this.matchMail, this.matchPass]}); //On crée le formulaire
    this.step = this.route.snapshot.params["step"] || "infos";
    this.guard();
    router.events
    .pipe(
      filter(
        ( event: NavigationEvent ) => {
          return( event instanceof NavigationStart );
        }
      )
    )
    .subscribe(
      ( event: any ) => {
        this.route.params.subscribe(
          (res: any) => {
            if (res.step !== this.step) {
              this.step = res.step;
            }
          }
        );
        
      }
    )
  }

  ngOnInit(): void {
    this.loading = false;
  }

  //customs validators
  
/*
  * Detecter si les mails ne correspondent pas
  *
  */
  matchMail(control: AbstractControl): ValidationErrors | null {
  
    const mail = control.get("login")?.get("mail")?.value;
    const confirm = control.get("login")?.get("mailRe")?.value;


    if (mail != confirm) { 
      return { 'MailNotMatch': true }; 
    }

    return null;
  }

  /*
  * Detecter si les mots de passes ne correspondent pas
  *
  */
  matchPass(control: AbstractControl): ValidationErrors | null {

    const pass = control.get("pass")?.value;
    const confirm = control.get("passRe")?.value;


    if (pass != confirm) { 
      return { 'PassNotMatch': true }; 
    }

    return null;
  }
 /**
  *  FONCTION VALIDATRICE :
  *  regarder si le mot de passe est valide
  * @returns ValidatorFn
  */
  telPaternValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

      let value:string = control.value;                       

      if (!value) {
          return null;
      }
      while(value.match(regEx.TEL_CHAR_TO_REMOVE)) { //TANT QU'il y a des caractere a supprimer 
        value = value.replace(regEx.TEL_CHAR_TO_REMOVE, "");//On les supprimes
      }
      if(!value.match(regEx.TEL_PATERN)) { //SI le tel ne respecte pas le patern ALORS
        
        return {telUnvalid: true};//On renvoie une erreur
      }
      return null;
    }
  }

   /**
  *  FONCTION VALIDATRICE :
  *  regarder si le mot de passe est valide
  * @returns ValidatorFn
  */
    pwdStrengthEnough(): ValidatorFn {
      return (control:AbstractControl) : ValidationErrors | null => {
  
        const value:string = control.value;                       
        
        if (!value) {
            return null;
        }
        const contain_upper = value.match(regEx.CONTAIN_UPPER_PATERN);
        const contain_under = value.match(regEx.CONTAIN_UNDER_PATERN);
        const contain_num = value.match(regEx.CONTAIN_NUM_PATERN);
        const contain_special_char = value.match(regEx.CONTAIN_SPECIAL_PATERN);

        const pwdValid = contain_upper && contain_under &&  contain_num && contain_special_char;

        return !pwdValid ? {pwdNotStrengthEnough: {
          upper: !contain_upper,
          under: !contain_under,
          num: !contain_num,
          special: !contain_special_char
        }} : null;//On renvoie une erreur
      }
    }

  /*
  * Regarder quelles etapes sont rempli, si rien est rempli, retourner sur login
  *
  */ 
  guard(): void {
    switch (this.step) {
      case 'userDetails': {
        if(this.signInForm.controls["login"].invalid) {
          this.step = 'infos';
          this.router.navigate(['sign-in', this.step])
        }
      } break;
      case 'options': {
        if(this.signInForm.controls["login"].invalid || this.signInForm.controls["userDetails"].invalid) {
          this.step = 'infos';
          this.router.navigate(['sign-in', this.step])
        }
      } break;
    }
  }


 //gestion des erreurs 
  mail_error(): string | null {
    
    if (this.login.controls['mail'].invalid && !this.login.controls['mail'].hasError('required')) {
      return "invalid mail";
    }
    else if (this.login.controls['mail'].hasError('required')) {
      return "mail reauired";
    }
    else if(this.signInForm.getError("MailNotMatch")) {
      return "mail not match";
    }
    return null  
  }

  pass_error(control: string): {error: string, num:boolean, special:boolean, under: boolean, upper: boolean} | null {
    
    if(this.login.controls[control].hasError('minlength') || this.login.controls[control].hasError('required') ) {
      return {
        error: "pwd too short", 
        num: false, 
        special: false, 
        under: false, 
        upper: false
      };
    }
    else if (this.login.controls[control].hasError("pwdNotStrengthEnough")) {
      const missing_char = this.login.controls[control].getError("pwdNotStrengthEnough");
      return {
        error: "pwdNotStrengthEnough", 
        num: missing_char.num, 
        special: missing_char.special, 
        under: missing_char.under, 
        upper: missing_char.upper
      };
    }
    else if(this.signInForm.getError("passNotMatch")) {
      return {
        error: "pwd not match", 
        num: false, 
        special: false, 
        under: false, 
        upper: false
      };
    }
    return null  
  }
  

  page_previous():void {
    switch (this.step) {
     
      case 'options': {
        this.step = "userDetails";
      } break;
      case 'userDetails': {
        this.step = "login";
      } break;
      default: {
        this.step = 'infos';
      } break;
    }
    this.router.navigate(['sign-in', this.step])
  }

  

 
  
  page_next(): void {
    switch (this.step) {
      case 'infos': {
        this.step = 'login';
      } break;
      case 'login': {
        //On regarde si le mail existe deja 
        this.step = "userDetails";
      } break;
      case 'userDetails': {
        this.step = "options";
      } break;
      default: {
        this.step = 'infos';
      } break;
    }
    this.router.navigate(['sign-in', this.step])
    
  }

  
  OnUseNameChange(): void {

  }

  public onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.signInForm);
  }

  no_info(): boolean {
    return this.step === "login" || this.step === "userDetails" || this.step === "options";
  }

  unauth_userDetails(): boolean {
    return this.signInForm.controls["login"].invalid && this.step === "login"
  }

  unauth_options(): boolean {
    return (this.signInForm.controls["login"].invalid || this.signInForm.controls["userDetails"].invalid) && this.step === "userDetails"
  }

  get login(): FormGroup {
    return this.signInForm.controls["login"] as FormGroup;
  }

  xor(a: boolean, b: boolean): boolean {
    return XOR(a, b);
  }
}
