import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {
  @Input() repeat: FormGroup;

  
  repeater_monthly = this.formBuilder.group({
    n_month:[1, Validators.min(1)],
    type: ["day of month"],
    day: this.formBuilder.array([])
  });
  
  constructor(protected formBuilder: FormBuilder) {
    for(let i=0; i < 31; i++) {
      this.days.push(this.newDay());
    }
   }

  get days(): FormArray {
    return this.repeater_monthly.get("day") as FormArray;
  }


  week_day(i: number): string {
    switch (i - Math.floor(i / 7) * 7) {
      case 0: {
        return "Lun";
      }break;
      case 1: {
        return "Mar";
      }break;
      case 2: {
        return "Mer";
      }break;
      case 3: {
        return "Jeu";
      }break;
      case 4: {
        return "Ven";
      }break;
      case 5: {
        return "Sam";
      }break;
      default: {
        return "Dim";
      }

    }
  }
  
  newDay(): FormGroup {
    return this.formBuilder.group({
      is_repeated: [false]
    })
  }

  ngOnInit(): void {
    if (this.repeat.get("repeat_body") === undefined) {
      this.repeat.addControl("repeat_body", this.repeater_monthly);
    }
    else {
      this.repeat.setControl("repeat_body", this.repeater_monthly);

    }
    this.repeater_monthly.get("type")?.valueChanges.subscribe(x => {
      if (x === 'day of month') {
        for(let i = 0; i < 4; i++) {
          this.days.removeAt(this.days.length-1);
        }
      }
      else {
        for(let i = 0; i < 4; i++) {
          this.days.push(this.newDay());
        }
      }
    });
  }

  

}
