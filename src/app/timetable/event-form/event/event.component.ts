import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateService } from '../../time-table/time-table.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['../../evt/new-event/new-event.component.scss', './event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() event: FormGroup; 
  eventForm =  this.formBuilder.group({
    date_begin:[this.datePipe.transform(new Date(), 'yyy-MM-dd')],
    time_begin: [this.datePipe.transform(new Date(), 'HH:mm')],
    date_end:[this.datePipe.transform(new Date(), 'yyy-MM-dd')],
    time_end: [this.datePipe.transform(new Date(), 'HH:mm')],
    label: ['', Validators.required],
    desc: [''],
    place: ['']
  })

  constructor(
    private dateService: DateService,
    protected formBuilder: FormBuilder,
    private datePipe: DatePipe
    ) { }


    
  ngOnInit(): void {
    let d = this.dateService.coordinate_date;

    this.eventForm.patchValue({date_begin: this.datePipe.transform(d, 'yyy-MM-dd')});
    this.eventForm.patchValue({time_begin: this.datePipe.transform(d, 'HH:mm')});

    this.event.setControl("event", this.eventForm);
    //On ajoute une heure a la date d
    d.setTime(d.getTime() + 60*60*1000);
    this.eventForm.patchValue({date_end: this.datePipe.transform(d, 'yyy-MM-dd')});
    this.eventForm.patchValue({time_end: this.datePipe.transform(d, 'HH:mm')});
  
    
  }

}
