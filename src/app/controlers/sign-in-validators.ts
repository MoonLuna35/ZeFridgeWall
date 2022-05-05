import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class SignInValidators {
    static passValidator(): ValidatorFn {
        return (control: AbstractControl):  ValidationErrors | null => {
            var num = /\d/;
            var letterUnder = /[a-z]/;
            var letterUpper = /[A-Z]/;
            var specialChar = /[\W_]/
            if (!control.value) {
            // if control is empty return no error
            return null;
          }
      
          // test the value of the control against the regexp supplied

          const valid = num.test(control.value) && letterUnder.test(control.value) && letterUpper.test(control.value) && specialChar.test(control.value);
          return valid ? null : { 'pass_uncorect': true };
        };
      }
    
    static matchPassword(control: AbstractControl): ValidationErrors | null {
 
        const password = control.get("pass")?.value;
        const confirm = control.get("re_pass")?.value;
        
        if (password ==="" || confirm ==="") {
            return null;
        }

        if (password != confirm) { 
            console.log("pas ok pass");
            return { 'noMatchPass': true } 
        }
        return null
     
    }
    static matchMail(control: AbstractControl): ValidationErrors | null {
 
        const mail = control.get("mail")?.value;
        const confirm = control.get("re_mail")?.value;
        if (mail ==="" || confirm ==="") {
            return null;
        }

        if (mail != confirm) { 
            console.log("pas ok mail");
            return { 'noMatchMail': true } 
        }
        return null
     
    }
 
        
}
