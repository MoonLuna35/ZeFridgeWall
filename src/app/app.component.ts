import { Component, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { Event as NavigationEvent } from "@angular/router";



import { Animations } from './animations';
import { filter, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Animations],
})


export class AppComponent {
  i = 0;
  log = true;

  constructor(
	  translate: TranslateService,
    router: Router,
	matDialog: MatDialog) {
    
    translate.addLangs(['en', 'fr']);
    translate.use('fr');


	
    /*router.events
			.pipe(
				filter(
					( event: NavigationEvent ) => {
						return( event instanceof NavigationStart );
					}
				)
			)
			.subscribe(
				( event: any ) => {
 					
					console.log(event)
				}
			)*/
 
  }
  

  prepareRoute(outlet: RouterOutlet) {
    
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  is_logged() {
	const str_user = localStorage.getItem("user");
	if (str_user) {
	  const user: User = JSON.parse(str_user); 
	  if (user.token) {
		return true;
	  }
	}
	return false;
  }
  
}




