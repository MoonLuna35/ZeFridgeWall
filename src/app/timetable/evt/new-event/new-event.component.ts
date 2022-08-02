import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { VoiceReminder } from 'src/models/event/event';
import { RepeaterComponent } from '../../repeater/repeater/repeater.component';
import { DateService } from '../../time-table/time-table.component';
import { TranslateService } from '@ngx-translate/core';

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
      panelClass: 'eventDialog',
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
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit  {
  event_time: Date;
  newEventForm: FormGroup;
  is_usual=false;

  str_week_days?: string;

  public active_tab: string = "infos"; //(Actif et Tab rofl) c'est l'onglet actif 

  private repeater = this.formBuilder.group({
    repeat_patern: ['weekly']
    
  });

  private date_selected: Date;
  private event_message_form =  this.formBuilder.group({
    date_begin:[this.datePipe.transform(new Date(), 'yyy-MM-dd')],
    time_begin: [this.datePipe.transform(new Date(), 'HH:mm')],
    label: [''],
    sentance: [''],
    ring: [true],
    device: ["Sam"]
  })

  constructor(
    private newEventData: NewEventData,
    protected formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dateService: DateService,
    private translate: TranslateService
  ) {
    this.event_time = newEventData.evt_time instanceof Date? newEventData.evt_time : new Date()
    this.newEventForm = this.formBuilder.group({ //On crée le formulaire
      type:["voice_reminder"],
      is_usual: [false],
      repeat_mode: ["weekly"],
      repeat_forever: [false],

    });
 
    if (this.dateService.coordinate_date === undefined) {
      this.date_selected = new Date; 
      this.date_selected.setMinutes(this.date_selected.getMinutes() - this.date_selected.getMinutes() % 10);  
    }
    else {
      this.date_selected=  new Date(this.dateService.coordinate_date);
    }
    
  }
  ngOnInit() {
    this.check_type();
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
          //sentance: this.newEventForm.get("sentance")?.value,
          ring: this.newEventForm.get("ring")?.value,
          assistant_device: this.newEventForm.get("assistant_device")?.value,
        })
        console.log(voiceReminder);
      }
    }
  }

  on_is_usual_changed(event: Event): void {
    //event.preventDefault(); 
    if (this.newEventForm.get("is_usual")?.value === false) {
      this.newEventForm.addControl("repeater", this.repeater);
      this.is_usual =true; 

      this.newEventForm.get("repeater")?.valueChanges.subscribe(x => {
        this.str_week_days = this.generate_weekDay_repeat_str(x.repeat_body);
      });      
    }
    else {
      this.newEventForm.removeControl("repeater");
      this.is_usual =false; 
    }
    
  }

  

  onTabClicked(event: Event, tab: string): void {
    event.preventDefault(); 

    this.active_tab = tab;
  }

  private check_type() {
    const type =  this.newEventForm.get("type")?.value;
    this.newEventForm.removeControl("event"); 
    switch(type) {
      case "voice_reminder": {
        this.newEventForm.addControl("event", this.event_message_form);
        this.newEventForm.get('event')?.patchValue({date_begin:  this.datePipe.transform(this.date_selected, 'yyy-MM-dd')});
        this.newEventForm.get('event')?.patchValue({time_begin:  this.datePipe.transform(this.date_selected, 'HH:mm')});
        //time_begin: [this.datePipe.transform(new Date(), 'HH:mm')],
      }
    }
  }

  /*
  *
  * Dans cette methode : 
  * On genere les repetions
  * 
  * */
  private generate_weekDay_repeat_str(repeater: any) : string { 
    let week_day: string = "" //la chaine qu'on renvera a la fin
    if (this.newEventForm.get('repeater')?.get('repeat_patern')?.value !== 'weekly') {
      return "";
    }
    
    const open_days = ( //Prends pour valeur vrai si tout les jours ouvrees sont selectionnes
      repeater.repeat_monday 
      && 
      repeater.repeat_tuesday 
      && 
      repeater.repeat_wednesday 
      && 
      repeater.repeat_thursday
      &&
      repeater.repeat_friday
    )
    //SI Tous les jours sont selectionnees
    if (open_days && repeater.repeat_saturday && repeater.repeat_sunday) {
      week_day = this.translate.instant("time_table.Everydays") //On l'indiuque
      return week_day;
    } 
    //SINON SI ET SEULEMENT SI tout les jours ouvrables sont selectionnees 
    else if (open_days && !repeater.repeat_saturday && !repeater.repeat_sunday) {
      week_day = this.translate.instant("time_table.Everydays from monday to friday")
      return week_day;
    }
    //SINON
    else {
      //on fait jour par jour
      if(repeater.repeat_monday) {
        week_day += "Lun, ";
      };
      if(repeater.repeat_tuesday) {
        week_day += "Mar, ";
      };
      if(repeater.repeat_wednesday) {
        week_day += "Mer, ";
      };
      if(repeater.repeat_thursday) {
        week_day += "Jeu, ";
      };
      if(repeater.repeat_friday) {
        week_day += "Ven, ";
      };
      if(repeater.repeat_saturday) {
        week_day += "Sam, ";
      };
      if(repeater.repeat_sunday) {
        week_day += "Dim, ";
      }
      return week_day.slice(0, -2); //On enleve la virgule et l'espace a la fin
    }
      
    
    
  }
}