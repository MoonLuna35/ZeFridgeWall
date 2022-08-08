import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-each-week',
  templateUrl: './each-week.component.html',
  styleUrls: ['./each-week.component.scss']
})
export class EachWeekComponent implements OnInit {
  @Input() repeat: FormGroup;
  
  
  repeater_weekly = this.formBuilder.group({
    n_week:[1, Validators.min(1)],
    repeat_monday: [false],
    repeat_tuesday: [false],
    repeat_wednesday: [false],
    repeat_thursday: [false],
    repeat_friday: [false],
    repeat_saturday: [false],
    repeat_sunday: [false]
  });

  constructor(protected formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.repeat.addControl("repeat_body", this.repeater_weekly);
    this.ative_current_day();

    this.repeater_weekly.valueChanges.subscribe(newValue => {
      if(!(
        newValue.repeat_monday 
        || 
        newValue.repeat_tuesday 
        || 
        newValue.repeat_wednesday
        || 
        newValue.repeat_thursday 
        || 
        newValue.repeat_friday
        || 
        newValue.repeat_saturday
        || 
        newValue.repeat_sunday )
      ) {
        this.ative_current_day();
      }
    })
  }

  private ative_current_day(): void {
    const d = new Date(); 
    const day = d.getDay();
    
    switch(day) {
      case 2 : {
        this.repeater_weekly.patchValue({repeat_tuesday: true});
      }
      break;
      case 3 : {
        this.repeater_weekly.patchValue({repeat_wednesday: true});
      }
      break;
      case 4 : {
        this.repeater_weekly.patchValue({repeat_thursday: true});
      }
      break;
      case 5 : {
        this.repeater_weekly.patchValue({repeat_friday: true});
      }
      break;
      case 6 : {
        this.repeater_weekly.patchValue({repeat_saturday: true});
      }
      break;
      case 6 : {
        this.repeater_weekly.patchValue({repeat_sunday: true});
      }
      break;
      default: {
        this.repeater_weekly.patchValue({repeat_monday: true});
      }
    }
  }

}
