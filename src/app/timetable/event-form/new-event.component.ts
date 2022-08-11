import { AfterContentChecked,  ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { VoiceReminder } from 'src/models/event/event';
import { RepeaterComponent } from '../repeater/repeater/repeater.component';
import { DateService } from '../time-table/time-table.component';
import { TranslateService } from '@ngx-translate/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Injectable() 
export class NewEventData {
  evt_time?: Date;
}

@Component({
  template: ''
})
/**
 * Ouverture du dialogue une foi route
 * 
 */
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
export class NewEventComponent implements OnInit, AfterContentChecked   {
  active_tab: string = "infos"; //(Actif et Tab rofl) c'est l'onglet actif 
  is_usual=false; //Si l'evenement est habituel
  newEventForm: FormGroup; //Le formulaire 
  str_week_days?: string; //Quand on repete la semaine, la chaine de caractere qui indique les jours

  private date_selected: Date; //La date de l'evenement

  

  
  
  
  constructor(
    protected formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateService: DateService,
    private translate: TranslateService, 
    private changeDetector: ChangeDetectorRef
  ) {
//On crée le formulaire principal
    
console.log(this.dateService);
    //SI l'utilisateur a charger la page depuis l'url (Il n'y a pas de date passee par l'emploi du temps) ALORS
    if (this.dateService.coordinate_date === undefined) {
      this.date_selected = new Date; //L'instant selectionne est l'heure/date actuel
      this.date_selected.setMinutes(this.date_selected.getMinutes() - this.date_selected.getMinutes() % 10);//On met les minutes a 0  
      this.dateService.coordinate_date = this.date_selected;
    }
    else { //SINON
      //La date-heure selectionnee est celle passee par l'emploi du temps
      this.date_selected=  new Date(this.dateService.coordinate_date);
    
    }
    
  }
  ngOnInit() {
    //this.check_type();
    this.newEventForm = this.formBuilder.group({ 
      type:["task"],
      is_usual: [false],
      event:[]});
    
  }
  ngAfterContentChecked() : void {
    this.changeDetector.detectChanges();
}

  /**
   * QUAND le formulaire est envoyer
   * @param event 
   */
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  /*
   * QUAND On clique sur un onglet
   * 
   * @param event 
   * @param tab 
   */
  onTabClicked(event: Event, tab: string): void {
    event.preventDefault(); 
    //Il devient actif
    this.active_tab = tab;
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