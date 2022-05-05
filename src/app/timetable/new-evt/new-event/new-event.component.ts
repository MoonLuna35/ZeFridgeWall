import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { VoiceReminder } from 'src/models/event/event';


@Injectable() 
export class NewEventData {
  evt_time?: Date;
}

@Component({
  template: ''
})
export class NewEventEntryComponent {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,
  ) { 
    const dialogRef = this.dialog.open(NewEventComponent, 
    {
      width: '900px',
      height: "900px",
      maxHeight: '90vh',
      panelClass: 'edit_type_dialog',
      data: ""
  });
  dialogRef.afterClosed().subscribe(result => { 
    if (result !== undefined) {
      this.router.navigate(['../'], { relativeTo: this.route} );
    }
    this.router.navigate(['../'], { relativeTo: this.route });
   });
  }
}

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit  {
  event_time: Date;
  newEventForm: FormGroup;
  
  constructor(
    private newEventData: NewEventData,
    protected formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.event_time = newEventData.evt_time instanceof Date? newEventData.evt_time : new Date()
    this.newEventForm = this.formBuilder.group({ //On crée le formulaire
      type:["voice_reminder"],
      date_begin:[this.datePipe.transform(this.event_time, 'yyy-MM-dd')],
      time_begin: [this.datePipe.transform(this.event_time, 'HH:mm')],
      label: [''],
      sentance: [''],
      ring: [true],
      assistant_device: ["alexa"],
      repeat: [true],
      repeat_mode: ["weeky"],
      repeat_day: ["Monday"],
      repeat_forever: [false]

    });
  }
  ngOnInit() {

  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.newEventForm.get("type")?.value);
    switch(this.newEventForm.get("type")?.value) {
      case "voice_reminder": {
        let voiceReminder = new VoiceReminder({
          type: this.newEventForm.get("type")?.value,
          time_begin: new Date(),
          label: this.newEventForm.get("label")?.value,
          sentance: this.newEventForm.get("sentance")?.value,
          ring: this.newEventForm.get("ring")?.value,
          assistant_device: this.newEventForm.get("assistant_device")?.value,
        })
        console.log(voiceReminder);
      }
    }
  }

}