import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Animations } from 'src/app/animations';
import { Event as NavigationEvent } from "@angular/router";

@Component({
  selector: 'app-list-nav',
  templateUrl: './list-nav.component.html',
  styleUrls: ['./list-nav.component.css'],
  animations: [Animations],
})
export class ListNavComponent implements OnInit, AfterViewInit {
  active_tab = '';
  private is_inited = false;
  constructor(protected router: Router) {
    this.check_url(this.router.url);
    this.router.events
			.pipe(
				filter(
					( event: NavigationEvent ) => {
						return( event instanceof NavigationStart );
					}
				)
			)
			.subscribe(
				( event: any ) => {
          this.check_url(event.url);
        })

   }


   protected check_url(url:string ) {
      if(url.match("^/lists/check-cupboard")) {
        this.active_tab = "cupboard";
      }
      else if (url.match("^/lists/lists")) {
        this.active_tab = "lists";
      }
      else if (url.match('^/lists/list/[0-9]+')) {
        this.active_tab = "lists";
      }
   }
  ngOnInit(): void {
    this.is_inited = true;
  }

  ngAfterViewInit () {
    
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
