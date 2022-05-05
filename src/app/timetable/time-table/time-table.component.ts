import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewEventData } from '../new-evt/new-event/new-event.component';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  date_monday: Date; 
  constructor(
    public newEventData: NewEventData,
    private route: ActivatedRoute,
    protected router: Router
  ) {
    const today = new Date();
    const td_wd = today.getDay() - 1;
    this.date_monday = today;
    this.date_monday.setDate(this.date_monday.getDate() - td_wd);
    this.date_monday.setHours(0);
    this.date_monday.setMinutes(0);
    this.date_monday.setSeconds(0);
    console.log(this.date_monday)

  }

  ngOnInit(): void {
  }

  get_day(i: number) {
    let reterned_date: Date = new Date(this.date_monday); 
    reterned_date.setDate(reterned_date.getDate() + i -1); //on met le bon jour
    return reterned_date.toLocaleDateString("fr");
  }

  OnTableClicked(event: Event, i: number, j: number) {
    event.preventDefault();

    let coordinate_date = new Date(this.date_monday);

    const rect = (event.target as HTMLTableRowElement).getBoundingClientRect();
    const click_y = (event as MouseEvent).clientY - rect.top; //x position within the element.
    const min = Math.floor(click_y / 10) * 10

    coordinate_date.setDate(coordinate_date.getDate() + j); //on met le bon jour
    coordinate_date.setHours(i);//on mets la bonne heure. 
    coordinate_date.setMinutes(min);//on mets aux bonne minutes. 
    this.newEventData.evt_time = coordinate_date;
    this.router.navigate(['new-event'], { relativeTo: this.route} );
    

  }


}

/*-
week day	        time	    date begin date end	
(1, 2, 3, 4, 5)  	12:00:00	12/02/22	12/02/23	repetition LUNDI… Vendredi a 12h du 12/02/22 au 12/02/23] 
NULL	            15:00:00	15/04/23	NULL	    A 15h le 15/04/23
(1, 2,)  	        18:00:00	18/02/20	NULL	    TOUT les lundi et mardi a 18h
*/