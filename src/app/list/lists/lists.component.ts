import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ListArticle } from 'src/models/list-article/list-article';
import { List } from 'src/models/list/list';
import { ListService } from 'src/models/list/list.service';
import { User } from 'src/models/user/user';
import { Event as NavigationEvent  } from "@angular/router";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  is_tu = false;
  is_the_first_time =true;
  is_archived? = false;
  lists: List[] = [];
  lists_already_printed: number = 0;
  selectedState: string = "actives";
  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    protected router: Router
  ) {
      this.selectedState = this.route.snapshot.queryParams["state"] || "";
      
    
      const str_user = localStorage.getItem("user");
      if (str_user) {
        const user: User = JSON.parse(str_user); 
        if (user.is_tu) {
          this.is_tu = true; 
        }
      }
      router.events
			.pipe(
				filter(
					( event: NavigationEvent ) => {
						return( event instanceof NavigationStart );
					}
				)
			)
			.subscribe(
				( event: any ) => {
          if (event.navigationTrigger === "popstate") {
            this.selectedState = router.getCurrentNavigation()?.extractedUrl.queryParams.state || "";    
            this.OnPageLoad();
          }
          else {
            if (
              router.getCurrentNavigation()?.extras.state?.from  !== undefined 
              &&
              router.getCurrentNavigation()?.extras.state?.from === "add-list"
              &&
              router.getCurrentNavigation()?.extras.state?.data
            ) {
              this.OnPageLoad();
            }
          } 
				}
			)
		;


   }


  search(from_html = true) {
    switch (this.selectedState) {
      case "all": {
          this.is_archived = undefined;
          this.router.navigate(['lists/lists'], { queryParams: { state: "all" } });
      } break; 
      case "archived": {
        this.is_archived = true;
        this.router.navigate(['lists/lists'], { queryParams: { state: "archived" } });
      } break;
      default: {
        if (from_html) {
          this.router.navigate(['./'], {relativeTo: this.route});
        }
        this.is_archived = false;
      }
    }
    this.load_lists();
     
  }

  search_from_history() {
    switch (this.selectedState) {
      case "all": {
          this.is_archived = undefined;
      } break; 
      case "archived": {
        this.is_archived = true;
      } break;
      default: {
        this.is_archived = false;
      }
    }
    
    this.load_lists();
  }

  load_lists() {
    this.listService.selectLists(this.lists_already_printed, this.is_archived).subscribe(
      (res: any) => {
        if (
          res.status !== undefined && res.status === "ok" 
          &&
          res.lists !== undefined && res.lists.length > 0
        ) {
          
          this.lists = res.lists;
          
          //On creer les dates
          for (let i = 0; i < res.lists.length; i++) {
            this.lists[i].date_create = new Date(this.lists[i].date_create);
          }
        }
        else {
          this.lists = [];
        }
      }
      
    )
  }

  archive(indice: number) {
    let list = this.lists[indice];
    if(this.selectedState !== "all") {
      this.lists.splice(indice, 1);
    }
    

    this.listService.archive(list).subscribe(
      (res: any) => {
        if(res.error !== undefined) {
          this.lists.push(list);
        }
        else if(this.selectedState === "all" && res.status !== undefined) {
          this.lists[indice].is_archived = true;
        }
      },
      (err: any) => {
        this.lists.push(list);
      }
    )
  }

  unarchive(indice: number) {
    let list = this.lists[indice];
    if(this.selectedState !== "all") {
      this.lists.splice(indice, 1);
    }

    this.listService.unarchive(list).subscribe(
      (res: any) => {
        if(res.error !== undefined) {
          this.lists.push(list);
        }
        else if(this.selectedState === "all" && res.status !== undefined) {
          this.lists[indice].is_archived = false;
        }
      },
      (err: any) => {
        this.lists.push(list);
      }
    )
  }

  OnPageLoad(route: boolean = true) {
    if (
      this.selectedState !== "archived" 
      && 
      this.selectedState !== "all" 
      && 
      this.selectedState !== "" && route
    ) {
      //this.router.navigate(['lists']);
      this.selectedState = "actives"
    }
    else if (this.selectedState === "") {
      this.selectedState = "actives"
    }
    this.search_from_history();
  }

  ngOnInit(): void {
    if (this.selectedState !== "archived" && this.selectedState !== "all" && this.selectedState !== "") {
        
      this.router.navigate(['lists']);
      this.selectedState = "actives"
    }
    else if (this.selectedState === "") {
      this.selectedState = "actives"
    }
    this.search(false);
  }

}
