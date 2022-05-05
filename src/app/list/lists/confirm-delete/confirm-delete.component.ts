import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from 'src/models/list/list';
import { ListService } from 'src/models/list/list.service';
import { User } from 'src/models/user/user';

@Component({
  template: ""
})
export class ConfirmDeleteEntry implements OnInit {
   
  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router) {
      if(this.route.parent?.snapshot.params.id !== undefined) {
        const dialogRef = this.dialog.open(ConfirmDeleteDialog, 
          {
            width: '800px',
            height:  "275px",
            panelClass: 'msg_box',
            data: parseInt(route.parent?.snapshot.params.id || "-1")
        });
        dialogRef.afterClosed().subscribe(result => { 
          if (result !== undefined) {
          }
          else {
            this.router.navigate(['../'], { relativeTo: this.route});
          }
         });
      }
      else {
        this.router.navigate(['../']);
      }
      
     }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteDialog implements OnInit {
  working = true; 
  error =false; 
  list: List = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_protected: false,
    is_archived: false,
    lines:[]
  });
  private token = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private route: ActivatedRoute,
    private listService: ListService,
    protected router: Router,
    public dialogRef:MatDialog
  ) { 
    this.list.id = this.id;    
    
  }

  ngOnInit(): void {
    this.listService.askDeleteToken(this.list).subscribe(
      (res: any) => {
        if(res.token !== undefined && typeof(res.token) === "string") {
          this.token = res.token;
          //this.token = "sdsdsdsd";
          if (this.token !== "" && this.list.name !== "") {
            this.working = false;
          }
        }
        else {
          console.log(res);
          this.router.navigate(['/']);
        }
      },
      (err) => {
        this.router.navigate(['/']);
      }
    )
    this.listService.loadList(this.list).subscribe(
      (res: any) => {
        if(
          res.list !== undefined
          ) {
            let id = this.list.id;
            this.list = new List(res.list);
            this.list.id = id;
            this.list.author = new User(res.list.author);
            this.list.date_create = new Date(this.list.date_create);
            if (this.token !== "" && this.list.name !== "") {
              this.working = false;
            }
          }
        else {
          console.log(res);
          this.router.navigate(['/']);
        }
      },
      (err) => {
        console.log(err);
        console.log(err.status === 404);
        this.router.navigate(['/']);
      }
    ) 

    
  }

  delete():void {
    this.working = true;
    this.listService.deleteWithToken(this.list, this.token).subscribe(
      (res: any) => {
        if(res.status !== undefined && res.status === "ok") {
          this.router.navigate(['lists']);
          this.dialogRef.closeAll();
        }
        else {
          this.print_error();
        }
      }, 
      (err) => {
        console.log(err.status === 404);
        if(err.status === 404) {
          this.router.navigate(['lists']);
          this.dialogRef.closeAll();
        }
        else {
          this.print_error();
        }
      }
    );
  }

  private print_error():void {
    this.error = true;
    setTimeout(() => {
      this.dialogRef.closeAll();
    },4000);

  }
}