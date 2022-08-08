import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
  @Input() repeat: FormGroup;

  repeater_daily = this.formBuilder.group({
    n_day:[1, Validators.min(1)]
  });
  constructor(protected formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.repeat.get("repeat_body") === undefined) {
      this.repeat.addControl("repeat_body", this.repeater_daily);
    }
    else {
      this.repeat.setControl("repeat_body", this.repeater_daily);
  
    }
  }
    

}
