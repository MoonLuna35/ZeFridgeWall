import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateService } from 'src/app/timetable/time-table/time-table.component';

@Component({
  selector: 'app-event-message',
  templateUrl: './event-message.component.html',
  styleUrls: ['../../event-form/new-event.component.scss', './event-message.component.scss']
})
export class EventMessageComponent implements OnInit {
  @Input() event: FormGroup; 
  message_event: FormGroup; 

  //Le formulaire quand l'evenement est pour l'assistant vocal
  private event_message_form =  this.formBuilder.group({
    date_begin:[this.datePipe.transform(new Date(), 'yyy-MM-dd')],
    time_begin: [this.datePipe.transform(new Date(), 'HH:mm')],
    label: ['', Validators.required],
    sentance: [''],
    ring: [true],
    device: ["Sam"]
  })

  constructor(
    protected formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateService: DateService
  ) {
  }

  ngOnInit(): void {
    this.event.setControl("event", this.event_message_form);
    this.event_message_form.patchValue({date_begin: this.datePipe.transform(this.dateService.coordinate_date, 'yyy-MM-dd')})
    this.event_message_form.patchValue({time_begin: this.datePipe.transform(this.dateService.coordinate_date, 'HH:mm')})
    this.message_event = this.event.get("event") as FormGroup;
  }


}
