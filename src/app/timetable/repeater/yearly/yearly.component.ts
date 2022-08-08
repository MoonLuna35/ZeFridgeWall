import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html',
  styleUrls: ['./yearly.component.scss']
})
export class YearlyComponent implements OnInit {
  @Input() repeat: FormGroup; //Le formulaire fournis par le parent
  days_in_month: Array<any> = new Array(31); //Le nombre de jours dans le mois courrant. Il initialise au 1er janvier


  repeater_yearly  = this.formBuilder.group({
    n_year:[1, Validators.min(1)],
    day_y: ["1"],
    month:["1"],
    isLeapYear: [false]
  });

  private previousDayValue: string = "1"; //Pour le 29 Fevrier, on veut garder l'info du jour precedement selectionne si l'utilisateur dechoche la case a cocher
  constructor(protected formBuilder: FormBuilder) { }

  /**
   * DANS CETTE METHODE : 
   * On change le nb de jours dans le mois, si l'utilisateur coche ou decoche 
   * comme quoi il veut que son evenement se realise le 29-02 les annees
   * bisextiles
   * @param event 
   */
  onLeapYearChange(event: MatCheckboxChange): void {

    //SI l'utilisateur veut repeter l'event le 29-02 ALORS
    if(event.checked) {
      this.days_in_month = new Array(29); //On dit qu'il y a 29 jours dans le mois
      this.previousDayValue = this.repeater_yearly.get("day_y")?.value; //On prends la valeur du jour ou la repetion avait lieux avant que la case a cocher ne le soit
      this.repeater_yearly.get("day_y")?.setValue("29"); //On selectionne le 29 comme jour de la repetition
    }
    //SINON
    else {
      this.days_in_month = new Array(28); //On dit qu'il y a 28 jours dans le mois
      this.repeater_yearly.get("day_y")?.setValue(this.previousDayValue); //On remet la valeur d'avant que l'utilisateur ne coche la case 
    }

  }

  ngOnInit(): void {
    if (this.repeat.get("repeat_body") === undefined) {
      this.repeat.addControl("repeat_body", this.repeater_yearly);
    }
    else {
      this.repeat.setControl("repeat_body", this.repeater_yearly);

    }
    //QUAND la valeur du mois change ALORS
    this.repeater_yearly.get("month")?.valueChanges.subscribe(x=> {
      this.set_days_in_month(x); //On modifie le nombre de jours dans le mois
    })
    this.repeater_yearly.get("day_y")?.valueChanges.subscribe(x=> {
      if (
        this.repeater_yearly.get("month")?.value === '2'
        &&
        this.repeater_yearly.get("isLeapYear")?.value
        &&
        x !== "29"
      ) {
        
        this.repeater_yearly.patchValue({isLeapYear: false});
        this.days_in_month = new Array(28);
      }
    })
  }

  /**
   * DANS CETTE METHODE : 
   * On renvoie iterable de taille i. En somme on converti un nombre en element iterable
   * 
   * @param i 
   * @returns array
   */
  counter(i: number) : Array<any> {
    return new Array(i);
  }
  /**
   * DANS CETTE METHODE : 
   * a partir de x, la valeur du mois on modifie 
   * le nombre de jour dans le mois
   * @param x 
   */
  set_days_in_month(x: string): void {
   
    switch(x) {
      case '2': {
        this.days_in_month = new Array(28);
      }break;
      case '4': {
        this.days_in_month = new Array(30);
      }break;
      case '6': {
        this.days_in_month = new Array(30);
      }break;
      case '9': {
        this.days_in_month = new Array(30);
      }break;
      case '11': {
        this.days_in_month = new Array(30);
      }break; 
    }
  }
  /**
   * DANS CETTE METHODE : 
   * On rajoute un 0 a un nombre de 1 digit (de 0 a 9) et on le converti
   * en chaine de caractere.  
   * @param n 
   * @returns 
   */
  minTwoDigits(n: number): string {
    return (n < 10 ? '0' : '') + n;
  }
}
