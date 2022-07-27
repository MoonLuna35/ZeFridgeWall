import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-each-week',
  templateUrl: './each-week.component.html',
  styleUrls: ['./each-week.component.scss']
})
export class EachWeekComponent implements OnInit {
  @Input() repeat_weekly: FormGroup;


  constructor() { }

  ngOnInit(): void {
    this.ative_current_day();

    this.repeat_weekly.valueChanges.subscribe(newValue => {
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
        this.repeat_weekly.patchValue({repeat_tuesday: true});
      }
      break;
      case 3 : {
        this.repeat_weekly.patchValue({repeat_wednesday: true});
      }
      break;
      case 4 : {
        this.repeat_weekly.patchValue({repeat_thursday: true});
      }
      break;
      case 5 : {
        this.repeat_weekly.patchValue({repeat_friday: true});
      }
      break;
      case 6 : {
        this.repeat_weekly.patchValue({repeat_saturday: true});
      }
      break;
      case 6 : {
        this.repeat_weekly.patchValue({repeat_sunday: true});
      }
      break;
      default: {
        this.repeat_weekly.patchValue({repeat_monday: true});
      }
    }
  }

}
